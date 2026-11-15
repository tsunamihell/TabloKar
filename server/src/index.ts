import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { configureDatabase } from './db.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await configureDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 سرور تابلوکار با موفقیت روی پورت ${PORT} اجرا شد.`);
    console.log(`🌐 آدرس دسترسی محلی: http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

