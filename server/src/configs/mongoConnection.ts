import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

// Connect to MongoDB with enhanced security settings
mongoose.connect(`${config.databases.mongodb.url}`, {
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  family: 4,
  serverSelectionTimeoutMS: 3000,
});
// Enable query logging
mongoose.set('debug', true);

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  logger.info('Mongo has connected successfully 😊');
});

mongoose.connection.on('reconnected', () => {
  logger.info('Mongo has reconnected 😊');
});

mongoose.connection.on('error', (error) => {
  logger.warn('Mongo connection has an error', error);
  mongoose.disconnect();
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongo connection is disconnected 🥺');
});

// Handle Node.js process termination to close MongoDB connection
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.warn('Mongo connection is disconnected due to application termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});
