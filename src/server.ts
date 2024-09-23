import express from "express";
import proxyRouter from "./routes/proxy";
import { applicationPort, basePath } from "./configs";
import { setupSwagger } from "./swagger";

const app = express();
app.use(express.json());
app.use(basePath, proxyRouter);

// Set up Swagger
setupSwagger(app);

app.listen(applicationPort, () => {
	console.log(`Server is running on port ${applicationPort}`);
});

export default app;
