import { describe, expect, test, beforeEach } from "@jest/globals";
import RequestQueue from "../src/RequestQueue";
import QueueRequestType from "../src/types/queueRequest";

describe("RequestQueue", () => {
	let requestQueue: RequestQueue;
	let mockRequest: QueueRequestType;

	beforeEach(() => {
		requestQueue = new RequestQueue();
		mockRequest = {
			url: "http://domain-a.com",
			resolve: jest.fn(),
			reject: jest.fn(),
		};
	});

	test("should add a request to the queue", () => {
		requestQueue.addRequest("domain-a.com", mockRequest);
		expect(requestQueue.hasRequests("domain-a.com")).toBe(true);
	});

	test("should retrieve the next request from the queue", () => {
		requestQueue.addRequest("domain-a.com", mockRequest);
		const nextRequest = requestQueue.getNextRequest("domain-a.com");
		expect(nextRequest).toEqual(mockRequest);
	});

	test("should return undefined when getting next request from an empty queue", () => {
		const nextRequest = requestQueue.getNextRequest("domain-a.com");
		expect(nextRequest).toBeUndefined();
	});

	test("should return false when checking for requests in an empty queue", () => {
		expect(requestQueue.hasRequests("domain-a.com")).toBe(false);
	});

	test("should return true when there are requests in the queue", () => {
		requestQueue.addRequest("domain-a.com", mockRequest);
		expect(requestQueue.hasRequests("domain-a.com")).toBe(true);
	});

	test("should handle multiple requests for the same domain", () => {
		const anotherMockRequest = {
			url: "http://domain-a.com",
			resolve: jest.fn(),
			reject: jest.fn(),
		};
		requestQueue.addRequest("domain-a.com", mockRequest);
		requestQueue.addRequest("domain-a.com", anotherMockRequest);

		const firstRequest = requestQueue.getNextRequest("domain-a.com");
		const secondRequest = requestQueue.getNextRequest("domain-a.com");

		expect(firstRequest).toEqual(mockRequest);
		expect(secondRequest).toEqual(anotherMockRequest);
	});

	test("should handle requests for different domains separately", () => {
		const anotherMockRequest = {
			url: "http://domain-b.com",
			resolve: jest.fn(),
			reject: jest.fn(),
		};
		requestQueue.addRequest("domain-a.com", mockRequest);
		requestQueue.addRequest("domain-b.com", anotherMockRequest);

		const firstDomainRequest = requestQueue.getNextRequest("domain-a.com");
		const secondDomainRequest = requestQueue.getNextRequest("domain-b.com");

		expect(firstDomainRequest).toEqual(mockRequest);
		expect(secondDomainRequest).toEqual(anotherMockRequest);
	});
});
