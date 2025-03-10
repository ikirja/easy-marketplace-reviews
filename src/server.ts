import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import * as cron from './lib/cron';
import { apiV1 } from './api/v1';
import * as securityMiddleware from './middleware/security';

const DEFAULT_DB = 'mongodb://localhost:27017/easy-marketplace-reviews';
const DEFAULT_PORT = 3000;

const DB = process.env.DB || DEFAULT_DB;
const PORT = process.env.PORT || DEFAULT_PORT;
const app: Express = express();

mongoose.connect(DB);

cron.cronTaskUpdateWBReviews.start();

app.use(express.json({ limit: '10mb' }));
app.use(securityMiddleware.checkAccessPermission);
app.use('/api/v1', apiV1);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
