import winston from "winston";
import fs from "fs";
import path from "path";

// Ensure logs directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Winston Logger Configuration
const logger = winston.createLogger({
  level: "info", // Default logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({ filename: path.join(logDir, "server.log") }),
  ],
});

// Console logging for development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

export default logger;
