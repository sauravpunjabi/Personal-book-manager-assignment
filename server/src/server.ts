import 'dotenv/config';
import { validateEnv } from './lib/validateEnv';
import { connectDB } from './lib/db';
import app from './app';

const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
  validateEnv();
  await connectDB();

  app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
