import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 500 }));

app.get('/health', (req, res) => res.json({ status: 'ok', name: 'FMS API' }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/common-expenses', expenseRoutes);
app.use('/api/ledgers', ledgerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => app.listen(PORT, () => console.log(`FMS API running on port ${PORT}`)))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
