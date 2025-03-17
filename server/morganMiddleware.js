import morgan from "morgan";
import fs from "fs";
import path from "path";
import { createStream } from "rotating-file-stream";
import logger from "./logger.js";

// Ensure logs directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a rotating write stream for request logs
const accessLogStream = createStream("requests.log", {
  interval: "1d", // Rotate daily
  path: logDir,
});

const winstonStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};
// Additional Morgan for error logging (status >= 400)
const morganErrorMiddleware = morgan("combined", {
  stream: winstonStream,
  skip: (req, res) => res.statusCode < 400,
});

// Setup Morgan with Winston-compatible format
const morganMiddleware = morgan("combined", { stream: accessLogStream });

export { morganMiddleware, morganErrorMiddleware };
