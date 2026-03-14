import mongoose from 'mongoose';
import logger from '../utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const connectDB = async (attempt = 1): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI as string;
    await mongoose.connect(uri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection attempt ${attempt} failed:`, error);
    if (attempt < MAX_RETRIES) {
      logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(attempt + 1);
    }
    logger.error('MongoDB connection failed after max retries. Exiting.');
    process.exit(1);
  }
};

export default connectDB;
