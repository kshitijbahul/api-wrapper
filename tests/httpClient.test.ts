import { describe, expect, test, beforeEach, afterAll } from "@jest/globals";
import HttpClient from "../src/HttpClient/HttpClient";
import { retryWithBackoff } from "../src/utils/retry.utils";

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

// Mocking retryWithBackoff
jest.mock("../src/utils/retry.utils", () => ({
	retryWithBackoff: jest.fn(),
}));

describe("Test HttpClient Constuctor", () => {
	test("Should return error if the number of concurrent request is negitive", async () => {
		expect(() => new HttpClient(-1)).toThrow(
			"Concurrency limit must be a positive integer"
		);
	});
	test("Should throw an error if concurrency limit is zero", () => {
		expect(() => new HttpClient(0)).toThrow(
			"Concurrency limit must be a positive integer"
		);
	});
});

describe("Test HttpClient Wrapper", () => {
	let httpClient: HttpClient;

	beforeEach(() => {
		httpClient = new HttpClient(2); // Set concurrency limit to 2
		// Mock retryWithBackoff to directly call the provided function
		(retryWithBackoff as jest.Mock).mockImplementation((fn) => fn());
		(fetch as jest.Mock).mockClear();
	});

	afterAll(() => {
		jest.resetAllMocks();
	});
	test("Should get data from a URL", async () => {
		const url = "https://httpbin.org/get?param=1";
		// Mock fetch response
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValue({ success: true }),
		});
		const data = await httpClient.get(url);
		expect(data).toEqual({ success: true });
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith(url);
	});

	test("Should return an error if the downstream API returns an error", async () => {
		const url = "https://httpbin.org/get?param=1";

		// Mock fetch to return a 500 error
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: jest.fn(),
		});

		await expect(httpClient.get(url)).rejects.toThrow(
			"Error from upstream API 500"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	test("Should treat lowercase and uppercase URLs as the same request", async () => {
		const urlLowerCase = "https://httpbin.org/get?param=1";
		const urlUpperCase = "HTTPS://HTTPBIN.ORG/GET?PARAM=1";

		// Mock fetch response
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValue({ success: true }),
		});

		// Make 2 requests, one with lowercase and one with uppercase URL
		const [data1, data2] = await Promise.all([
			httpClient.get(urlLowerCase),
			httpClient.get(urlUpperCase),
		]);

		expect(data1).toEqual({ success: true });
		expect(data2).toEqual({ success: true });

		// Only one fetch call should be made due to URL normalization
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	test("Should treat mixed-case URLs as the same request", async () => {
		const urlLowerCase = "https://httpbin.org/get?param=1";
		const urlMixedCase = "https://Httpbin.org/Get?Param=1";

		// Mock fetch response
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValue({ success: true }),
		});

		// Make 2 requests, one with lowercase and one with mixed-case URL
		const [data1, data2] = await Promise.all([
			httpClient.get(urlLowerCase),
			httpClient.get(urlMixedCase),
		]);

		expect(data1).toEqual({ success: true });
		expect(data2).toEqual({ success: true });

		// Only one fetch call should be made due to URL normalization
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	test("Should not treat https and http URLs as the same", async () => {
		const urlHttps = "https://httpbin.org/get?param=1";
		const urlHttp = "http://Httpbin.org/Get?Param=1";

		// Mock fetch response
		(fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({ success: true }),
		});

		const [data1, data2] = await Promise.all([
			httpClient.get(urlHttps),
			httpClient.get(urlHttp),
		]);

		expect(data1).toEqual({ success: true });
		expect(data2).toEqual({ success: true });

		// Two fetch calls should be made since https and http URLs are different
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	test("Should use the response of an in-flight request", async () => {
		const url = "https://httpbin.org/get?param=1";

		// Mock fetch
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValue({ success: true }),
		});

		// Initiate two concurrent requests for the same URL
		const [data1, data2] = await Promise.all([
			httpClient.get(url),
			httpClient.get(url),
		]);

		expect(data1).toEqual({ success: true });
		expect(data2).toEqual({ success: true });

		// Only one fetch call should be made since the same URL is in-flight
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	test("Should queue up requests to an endpoint after reaching concurrency limit", async () => {
		const urls = [
			"https://httpbin.org/get?param=1",
			"https://httpbin.org/get?param=2",
			"https://httpbin.org/get?param=3",
			"https://httpbin.org/get?param=4",
		];

		// Mock fetch to resolve after a short delay
		(fetch as jest.Mock).mockImplementation(() =>
			Promise.resolve({
				ok: true,
				json: jest.fn().mockResolvedValue({ success: true }),
			})
		);

		// Initiate four requests; the fourth should be queued due to concurrency limit
		const promises = urls.map((url) => httpClient.get(url));

		// Initially, only 2 fetch calls should be made due to concurrency limit
		expect(fetch).toHaveBeenCalledTimes(2);

		// Resolve one of the in-flight requests
		// Simulate `onRequestComplete` by waiting briefly
		await new Promise((resolve) => setImmediate(resolve));

		// After one request completes, the next should start
		expect(fetch).toHaveBeenCalledTimes(4);

		// Await all promises
		const results = await Promise.all(promises);

		results.forEach((result) => {
			expect(result).toEqual({ success: true });
		});
	});

	test("Should enforce concurrency check with 4 calls to the same API with different params", async () => {
		const urls = [
			"https://httpbin.org/get?param=1",
			"https://httpbin.org/get?param=2",
			"https://httpbin.org/get?param=3",
			"https://httpbin.org/get?param=4",
		];

		// Mock fetch to resolve for each request
		(fetch as jest.Mock).mockImplementation(() =>
			Promise.resolve({
				ok: true,
				json: jest.fn().mockResolvedValue({ success: true }),
			})
		);

		const promises = urls.map((url) => httpClient.get(url));

		// All should resolve with the same mocked result
		const results = await Promise.all(promises);

		expect(fetch).toHaveBeenCalledTimes(4); // Ensure 4 calls were made
		results.forEach((result) => {
			expect(result).toEqual({ success: true });
		});
	});
});
