import morgan from "morgan";
import fs from "fs";
import path from "path";
import { createStream } from "rotating-file-stream";

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

// Setup Morgan with Winston-compatible format
const morganMiddleware = morgan("combined", { stream: accessLogStream });

export default morganMiddleware;
