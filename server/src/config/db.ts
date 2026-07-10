import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/promptfolio';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Connection failed or MongoDB not running locally (${(error as Error).message}). API server will continue running in Phase 0 mode.`);
  }
};

export const getDBStatus = () => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};
