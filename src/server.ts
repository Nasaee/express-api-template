import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

import rootRouter from './routes/rootRouter';
import { errorHandlerMiddleware } from './middlewares/errors.middleware';
import {
  handleUncaughtExceptions,
  handleUnhandledRejections,
} from './utils/errorLogger';
import { scheduleLogCleanup } from './utils/scheduler';

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use(
  cors({
    origin: ['http://localhost', process.env.CLIENT_URL!],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Logging Middleware
app.use(morgan('dev'));

// Security Middleware
app.use(helmet());

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// API routes
app.use('/api/v1', rootRouter);

// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Path not found' });
});

app.use(errorHandlerMiddleware);

// Schedule Daily Log Cleanup
scheduleLogCleanup();

// Handle uncaught exceptions and unhandled promise rejections
handleUncaughtExceptions();
handleUnhandledRejections();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
