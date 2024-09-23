import { describe, expect, test, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import proxyRouter from "../src/routes/proxy";
import HttpClient from "../src/HttpClient/HttpClient";
import ApiResponse from "../src/ApiResponse";

jest.mock("../src/HttpClient/HttpClient");

const app = express();
app.use(express.json());
app.use("/", proxyRouter);

describe("POST /proxy", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("should return 400 if method is not GET", async () => {
		const response = await request(app)
			.post("/proxy")
			.send({ url: "https://httpbin.org/get", method: "POST" });

		expect(response.status).toBe(400);
		expect(response.body).toEqual(
			new ApiResponse(400, "", "Invalid method. Only GET is supported")
		);
	});

	test("should return 400 if URL is invalid", async () => {
		const response = await request(app)
			.post("/proxy")
			.send({ url: "invalid-url", method: "GET" });

		expect(response.status).toBe(400);
		expect(response.body).toEqual(
			new ApiResponse(400, "", "Invalid URL : invalid-url")
		);
	});
	test("should return 400 if no URL is passed", async () => {
		const response = await request(app)
			.post("/proxy")
			.send({ url: "", method: "GET" });

		expect(response.status).toBe(400);
		expect(response.body).toEqual(new ApiResponse(400, "", "Invalid URL"));
	});

	test("should return 400 if URL protocol is invalid", async () => {
		const response = await request(app)
			.post("/proxy")
			.send({ url: "ftp://httpbin.org/get", method: "GET" });

		expect(response.status).toBe(400);
		expect(response.body).toEqual(
			new ApiResponse(400, "", "Invalid URL protocol")
		);
	});

	test("should return 200 and proxy the request successfully", async () => {
		const mockResponse = { status: 200, data: { key: "value" } };
		(HttpClient.prototype.get as jest.Mock).mockResolvedValue(mockResponse);

		const response = await request(app)
			.post("/proxy")
			.send({ url: "https://httpbin.org/get", method: "GET" });

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockResponse);
	});

	test("should return 500 if there is an error fetching data", async () => {
		(HttpClient.prototype.get as jest.Mock).mockRejectedValue(
			new Error("Network error")
		);

		const response = await request(app)
			.post("/proxy")
			.send({ url: "https://httpbin.org/get", method: "GET" });

		expect(response.status).toBe(500);
		expect(response.body).toEqual(
			new ApiResponse(
				500,
				"",
				"Error fetching data from https://httpbin.org/get. Error is : Network error"
			)
		);
	});
});
