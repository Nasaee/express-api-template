import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import 'dotenv/config';
import rootRouter from './routes/rootRouter';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS MIDDLEWARE
app.use(
  cors({
    origin: ['http://localhost', process.env.CLIENT_URL!],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// LOGGING MIDDLEWARE
app.use(morgan('dev'));
// HIDDEN SENSITIVE HEADER INFO
app.use(helmet());

app.use('/api/v1', rootRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
