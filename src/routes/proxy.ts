import { Router, Request, Response } from 'express';
import HttpClient from '../HttpClient/HttpClient';
import { concurrentDomainRequestLimit } from '../configs';

const proxyRouter = Router();
const httpClient = new HttpClient(concurrentDomainRequestLimit);

/**
 * @swagger
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
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: 'mock data'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
proxyRouter.post('/proxy', async (req: Request, res: Response) => {
    try {
        const { url, method = 'GET' } = req.body;
        if (method && method.toUpperCase() !== 'GET') {
            return res.status(400).json({ error: 'Only GET requests are supported' });
        }
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'Invalid URL' });
        }
        // TODO - Add validation for URL
        try {
            const validUrl = new URL(url);
            if (!['http:', 'https:'].includes(validUrl.protocol)) {
                return res.status(400).json({ error: 'Invalid URL protocol' });
            }
        } catch (error) {
            return res.status(400).json({ error: `Invalid URL : ${url}` });
        }
        // TODO - Get the Response code from the call to the URL
        const result = await httpClient.get(url);
        console.log('test result is', result);

        res.status(200).json(result);
    } catch (error: any) {
        console.error(`Error fetching data from ${req.body.url}:`, error);
        res.status(500).json({ error: `Error fetching data from ${req.body.url}. Error is : ${error.message}` });
    }
});

export default proxyRouter;
