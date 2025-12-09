// backend/src/app.js
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import limiter from './middlewares/rateLimiter.js'; 
import errorHandler from './middlewares/errorHandler.js';
import { StatusCodes } from 'http-status-codes';
import employeeRoutes from './routes/employeeRoutes.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'docs', 'swagger.json'), 'utf8')
);

const app = express();

app.use(helmet());

app.use(morgan('dev'));

app.use('/api', limiter);

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/api/health', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API Service is running successfully!' });
});

app.use('/api/employees', employeeRoutes); 

app.use((req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({ 
        message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
        data: null
    });
});

app.use(errorHandler);

export default app;