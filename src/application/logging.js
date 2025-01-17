import winston from "winston";

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.prettyPrint(),
  transports: [
    new winston.transports.Console({})
  ]
});