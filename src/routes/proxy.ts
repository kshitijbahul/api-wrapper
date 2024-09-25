import { Router, Request, Response } from "express";
import HttpClient from "../HttpClient/HttpClient";
import { concurrentDomainRequestLimit } from "../configs";
import ApiResponse from "../ApiResponse";
import ApiRequest from "../APIRequest";

const proxyRouter = Router();
const httpClient = new HttpClient(concurrentDomainRequestLimit);

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         responseCode:
 *           type: integer
 *           example: 200
 *         responseBody:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           example: { "key": "value" }
 *         error:
 *           type: string
 *           nullable: true
 *           example: null
 *
 * /proxy:
 *   post:
 *     summary: Proxy a request
 *     description: Proxy a request to another URL.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: 'https://httpbin.org/get'
 *               method:
 *                 type: string
 *                 example: 'GET'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
proxyRouter.post(
	"/proxy",
	async (req: Request<ApiRequest>, res: Response<ApiResponse>) => {
		try {
			const { url, method = "GET" } = req.body;
			if (method && method.toUpperCase() !== "GET") {
				return res
					.status(400)
					.json(
						new ApiResponse(
							400,
							"",
							"Invalid method. Only GET is supported"
						)
					);
			}
			if (!url || typeof url !== "string") {
				return res
					.status(400)
					.json(new ApiResponse(400, "", "Invalid URL"));
			}
			// TODO - Add validation for URL
			try {
				const validUrl = new URL(url);
				if (!["http:", "https:"].includes(validUrl.protocol)) {
					return res
						.status(400)
						.json(new ApiResponse(400, "", "Invalid URL protocol"));
				}
			} catch (error) {
				console.error(
					`Invalid URL: ${url} . Error Message is : ${
						(error as Error).message
					}`
				);
				return res
					.status(400)
					.json(new ApiResponse(400, "", `Invalid URL : ${url}`));
			}
			// TODO - Get the Response code from the call to the URL
			const result = await httpClient.get(url);
			console.log("test result is", result);

			res.status(result.status).json(result);
		} catch (error: unknown) {
			console.error(`Error fetching data from ${req.body.url}:`, error);
			res.status(500).json(
				new ApiResponse(
					500,
					``,
					`Error fetching data from ${req.body.url}. Error is : ${
						(error as Error).message
					}`
				)
			);
		}
	}
);

export default proxyRouter;
