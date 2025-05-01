import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `${timestamp} [${level}]: ${message}`,
        ),
    ),
    transports: [
        new winston.transports.Console(),
        // Additional transports like File can be added here
    ],
});

export default logger;
