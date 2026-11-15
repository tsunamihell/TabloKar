import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || false,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / Status check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'TabloKar API', timestamp: new Date().toISOString() });
});

// Main API routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status === 400 ? 400 : err.status === 413 ? 413 : 500;
  res.status(status).json({ error: status === 500 ? 'خطای داخلی سرور' : 'درخواست نامعتبر است.' });
};
app.use(errorHandler);

export default app;

