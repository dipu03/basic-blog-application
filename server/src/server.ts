/* eslint-disable @typescript-eslint/no-unused-vars */
import app from './app';
import moment from 'moment';
import config from './configs/config';
import logger from './configs/logger';
import http from 'http';

process.env.TZ = config.constants.defaultTimezone;
const server: http.Server = http.createServer(app);;


// Get the current date and time
const currentTime = moment();
server.listen(config.essentials.port, () => {
  logger.info(
    `${config.essentials.appName} server is working fine 😊 & listening on PORT: ${config.essentials.port} | Default Timezone: ${process.env.TZ} | Current date and time: ${currentTime.format('YYYY-MM-DD HH:mm:ss')}`
  );
});

// Server exit operations
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Unexpected error handler
const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler as unknown as NodeJS.RejectionHandledListener);
process.on('SIGTERM', exitHandler);
