import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import redisClient from './config/redis';
import logger from './utils/logger';

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async () => {
  try {
    // Connect to MongoDB (required — will exit on failure)
    await connectDB();

    // Connect to Redis (optional — server continues without it)
    try {
      await redisClient.connect();
    } catch (redisErr) {
      logger.warn('Redis unavailable — caching disabled. Server will continue without Redis.', redisErr);
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV ?? 'development'} mode`);
    });

    // ── Graceful Shutdown ─────────────────────────────────────────────────
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        logger.info('HTTP server closed');
        try {
          if (redisClient.status === 'ready') {
            await redisClient.quit();
            logger.info('Redis connection closed');
          }
          process.exit(0);
        } catch (err) {
          logger.error('Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force exit if shutdown takes too long
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
