// server/server.js
import express from "express";
import path from "path";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./setup/initPool.js";

import morganMiddleware from "./morganMiddleware.js";
import logger from "./logger.js";

import { initCourses } from "./setup/initCourses.js";
import { createUsersTable } from "./setup/initUsersTable.js";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Ensure courses exist and users table exists
initCourses();
createUsersTable();

// Define __dirname
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;
const app = express();

// Serve frontend
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// Enable JSON parsing
app.use(express.json());

// Morgan middleware for logging
app.use(morganMiddleware);

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Enable cookie parsing
app.use(cookieParser());

// JWT Middleware: Protect routes except for whitelisted ones
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    getToken: (req) => req.cookies.token,
  }).unless({
    path: ["/api/login", "/api/signup", "/api/client-logs", "/api/courses"],
  }) // Temporary: Allow access to client logs and courses without JWT
);

// Client logs endpoint
// maybe add some checks to ensure malicious stuff can't be manually logged
app.post("/api/client-logs", (req, res) => {
  const { level, message } = req.body;
  if (!level || !message) {
    return res.status(400).json({ error: "Missing log data" });
  }
  logger.log(level, `CLIENT: ${message}`);
  res.status(200).json({ success: true });
});

app.get("/api/validateJwt", (req, res) => {
  // so long as it returns something and the whitelist doesn't contain this endpoint, it should only return if valid jwt
  res.json({});
});

// Login route
app.post("/api/login", async (req, res) => {
  logger.info("login accessed");
  const { email, password } = req.body;

  async function findUserByEmail(email) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0];
    } catch (err) {
      console.error("Error fetching user from database", err);
      return null;
    }
  }

  let user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful" });
});

// Signup route
app.post("/api/signup", async (req, res) => {
  logger.info("signup accessed");
  const { email, password, username, firstName, lastName, phone, address } =
    req.body;

  async function findUserByEmail(email) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0];
    } catch (err) {
      console.error("Error fetching user from database", err);
      return null;
    }
  }

  async function createUser(
    email,
    password,
    username,
    firstName,
    lastName,
    phone = null,
    address = null
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (email, password, username, firstName, lastName, phone, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    try {
      const result = await pool.query(query, [
        email,
        hashedPassword,
        username,
        firstName,
        lastName,
        phone,
        address,
      ]);
      return result.rows[0];
    } catch (err) {
      console.error("Error creating user:", err);
      throw new Error("Error creating user");
    }
  }

  let user = await findUserByEmail(email);
  if (!user) {
    user = await createUser(
      email,
      password,
      username,
      firstName,
      lastName,
      phone,
      address
    );
  } else {
    return res
      .status(409)
      .json({ message: "User with this email already exists" });
  }

  res.json({ message: "User created successfully" });
});

/* ========== New Course Routes ========== */

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Enroll in a course (JWT Protected)
app.post("/api/enroll", async (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: "Missing userId or courseId" });
  }

  try {
    await pool.query(
      "INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)",
      [userId, courseId]
    );
    res.json({ message: "Successfully enrolled in the course!" });
  } catch (error) {
    console.error("Error enrolling:", error);
    res.status(500).json({ error: "Enrollment failed" });
  }
});

/* ========== End of New Routes ========== */

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
