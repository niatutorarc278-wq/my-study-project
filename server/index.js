import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, getDbStatus } from './config/db.js';
import { seedDatabase } from './seed.js';

import courseRoutes from './routes/courses.routes.js';
import couponRoutes from './routes/coupons.routes.js';
import userRoutes from './routes/users.routes.js';
import paymentRoutes from './routes/payments.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import progressRoutes from './routes/progress.routes.js';
import referralRoutes from './routes/referrals.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/referrals', referralRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'STUDY LMS Express API',
    database: getDbStatus() ? 'MySQL (Connected)' : 'In-Memory Store (Active)',
    timestamp: new Date().toISOString()
  });
});

// Initialize Database & Start Server
const startServer = async () => {
  console.log('🚀 Initializing STUDY LMS Express Server...');
  await initDb();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  STUDY LMS API Server running on port ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Database Status: ${getDbStatus() ? 'MySQL' : 'Active Store'}`);
    console.log(`==================================================`);
  });
};

startServer();
