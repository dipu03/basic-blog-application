import morgan from 'morgan';
import config from './config';
import logger from './logger';
import moment from 'moment';
import { Request, Response } from 'express';

morgan.token('message', (req: Request, res: Response) => res.locals.message || 'No message available');

const getIpFormat = (): string => (config.essentials.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;


export const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: {
    write: (message: string) => {
      const currentTime = moment().format();
      const logMessage = `${currentTime}<=>${message.trim()}\n`;
      logger.info(logMessage);
    },
  },
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: {
    write: (message: string) => {
      logger.error(message.trim());
    },
  },
});