import {
    describe, expect, test,
    beforeAll,beforeEach, afterAll,
} from '@jest/globals';
import HttpClient from '../src/httpClient';
const { retryWithBackoff } = require('../src/retry');
// Mock fetch
global.fetch = jest.fn() as jest.Mock;

// Mocking retry
jest.mock('../src/retry', () => ({
    retryWithBackoff: jest.fn(),
}));

describe('Test HttpClient Wrapper', () => {
    let httpClient: HttpClient;

    beforeAll(() => {
        // Any setup if needed
    });

    beforeEach(() => {
        httpClient = new HttpClient(2);
        // Mock retryWithBackoff to call the function immediately
        retryWithBackoff.mockImplementation((fn) => fn());
        (fetch as jest.Mock).mockClear();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    test('Should get Data from a URL', async () => {
        const url = 'https://httpbin.org/get?param=1';
        // Mock fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ success: true }),
        });
        const data = await httpClient.getData(url);
        expect(data).toEqual({ success: true });
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url);
    });

    test('Should return an error if the Downstream API returns an error', async () => {
        const url = 'https://httpbin.org/get?param=1';

        // Mock fetch to return a 500 error
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn(),
        });

        await expect(httpClient.getData(url)).rejects.toThrow('HTTP error! status: 500');

        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should treat lowercase and uppercase URLs as the same request', async () => {
        const urlLowerCase = 'https://httpbin.org/get?param=1';
        const urlUpperCase = 'HTTPS://HTTPBIN.ORG/GET?PARAM=1';

        // Mock fetch response
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        // Make 2 requests: one with uppercase URL
        const [data1, data2] = await Promise.all([httpClient.getData(urlLowerCase), httpClient.getData(urlUpperCase)]);

        expect(data1).toEqual({ success: true });
        expect(data2).toEqual({ success: true });

        // Only one fetch call should be made due to URL normalization
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should treat mixed-case URLs as the same request', async () => {
        const urlLowerCase = 'https://httpbin.org/get?param=1';
        const urlMixedCase = 'https://Httpbin.org/Get?Param=1';

        // Mock fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        // Make two requests: one with lowercase and one with mixed-case URL
        const [data1, data2] = await Promise.all([httpClient.getData(urlLowerCase), httpClient.getData(urlMixedCase)]);

        expect(data1).toEqual({ success: true });
        expect(data2).toEqual({ success: true });

        // Only one fetch call should be made due to URL normalization
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should not treat https and http URLs to be same', async () => {
        const urlLowerCase = 'https://httpbin.org/get?param=1';
        const urlMixedCase = 'http://Httpbin.org/Get?Param=1';

        // Mock fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        const [data1, data2] = await Promise.all([httpClient.getData(urlLowerCase), httpClient.getData(urlMixedCase)]);

        expect(data1).toEqual({ success: true });
        expect(data2).toEqual({ success: true });

        // Two fetch call should be made
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    test('Should use response of an in-flight request', async () => {
        const url = 'https://httpbin.org/get?param=1';

        // Mock fetch
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        // Initiate two concurrent requests
        const [data1, data2] = await Promise.all([httpClient.getData(url), httpClient.getData(url)]);

        expect(data1).toEqual({ success: true });
        expect(data2).toEqual({ success: true });
        // Only one fetch call should be made
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('Should queue up requests to an endpoint after its already serving 2 request', async () => {
        const urls = [
            'https://httpbin.org/get?param=1',
            'https://httpbin.org/get?param=2',
            'https://httpbin.org/get?param=3',
            'https://httpbin.org/get?param=4',
        ];

        // Mock fetch to resolve after a short delay
        (fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: jest.fn().mockResolvedValue({ success: true }),
            })
        );

        // Initiate four requests; the fourth should be queued
        const promises = urls.map((url) => httpClient.getData(url));

        // Initially, only 3 fetch calls should be made
        expect(fetch).toHaveBeenCalledTimes(2);

        // Resolve one of the in-flight requests
        // For simplicity, we'll simulate onRequestComplete by waiting briefly
        await new Promise((resolve) => setImmediate(resolve));

        // After the first three complete, the fourth should be fetched
        // all should have been called by now since fetch is mocked
        expect(fetch).toHaveBeenCalledTimes(4);

        // Await all promises
        const results = await Promise.all(promises);

        results.forEach((result) => {
            expect(result).toEqual({ success: true });
        });
    });

    test('Should enforce concurrency check, with 4 calls to the same API with different params', async () => {
        // Implement the test logic here
    });
});