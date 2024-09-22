import { Router, Request, Response } from 'express';
import HttpClient from '../httpClient';  // Adjust the import based on the correct path
import { concurrentDomianRequestLimit } from '../configs';

const proxyRouter = Router();
const httpClient = new HttpClient(concurrentDomianRequestLimit);  // Use appropriate configurations if needed

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
 *                 example: 'http://example.com'
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
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const result = await httpClient.getData(url);
        console.log('test result is', result);

        res.status(200).json(result);
    } catch (error: any) {
        console.log('error is ', error);
        res.status(500).json({ error: error.message });
    }
});

export default proxyRouter;
