import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Ensures logs appear in the console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

logger.exceptions.handle(
  new winston.transports.Console(),
  new winston.transports.File({ filename: "logs/exceptions.log" })
);

export default logger;
