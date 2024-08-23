import winston from 'winston';
import path from 'path';
import { format } from 'date-fns';

const logFolderPath = './storage/logs';
const formatedDate = format(new Date(), 'yyyyMMdd_HHmmss');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logFolderPath, `${formatedDate}_error.log`), level: 'error' }),
    new winston.transports.File({ filename: path.join(logFolderPath, `${formatedDate}.log`) }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;