import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import HttpClient from './httpClient';
import { applicationPort as port } from './configs';
import { concurrentDomianRequestLimit } from './configs';

// Initialize Express app
const app: Application = express();
app.use(bodyParser.json()); // Parse JSON body

const httpClient = new HttpClient(concurrentDomianRequestLimit);

app.post('/proxy', async (req: Request, res: Response) => {
    try {
        const { url, method = 'GET' } = req.body;
        // If the method is not GET, return an error 
        if (method && method.toUpperCase() !== 'GET') {
            return res.status(400).json({ error: 'Only GET requests are supported' });
        }
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Use HttpClient to perform the request
        const result = await httpClient.getData(url);

        // Return the result from the external service
        res.json(result);
    } catch (error: any) {
        // Handle any errors from HttpClient
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});