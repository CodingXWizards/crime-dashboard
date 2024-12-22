import winston from "winston";

// Define log formats
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

// Create a logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    logFormat,
  ),
  transports: [
    // Log to console with colorization
    new winston.transports.Console(),
    // Optionally, log to a file (you can configure the path and filename)
    // new winston.transports.File({ filename: 'logs/server.log' }),
  ],
});

export default logger;
