import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`[Server] Promptfolio API listening on port ${PORT}`);
    console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
  });
};

startServer().catch((err) => {
  console.error('[Server] Fatal error during server startup:', err);
});
