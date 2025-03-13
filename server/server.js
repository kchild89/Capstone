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

// make sure courses exist and users table exists
initCourses();
createUsersTable();

// define __dirname
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;
const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// allow json stuff
app.use(express.json());

// morgan stuff
app.use(morganMiddleware);

// configure cors
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
// allow cross origin resource sharing
app.use(cors(corsOptions));

// allow reading cookies
app.use(cookieParser());

// verify jwts on all pages except whitelisted ones
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    getToken: (req) => req.cookies.token,
  }).unless({ path: ["/api/login", "/api/signup", "/api/client-logs"] })
);

app.post("/api/client-logs", (req, res) => {
  const { level, message } = req.body;
  if (!level || !message) {
    return res.status(400).json({ error: "Missing log data" });
  }
  logger.log(level, `CLIENT: ${message}`);
  res.status(200).json({ success: true });
});

app.post("/api/login", async (req, res) => {
  logger.info("login accessed");
  const { email, password } = req.body;
  // Function to find user by email
  async function findUserByEmail(email) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0]; // Return the user object
    } catch (err) {
      console.error("Error fetching user from database", err);
      return null;
    }
  }

  // Find user from database using email
  let user = await findUserByEmail(email);

  // If user doesn't exist, return message saying so
  if (!user) {
    console.log("user not found");
    res.json({ message: "user not found" });
    return;
  }

  // Compare passwords using bcrypt (for both new and existing users)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const payload = {
    userId: user.id, // or whatever your user identifier is
    email: user.email, // Use email instead of username
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
    algorithm: "HS256",
  }); // Token expires in 1 hour

  // Send the token to the client
  res.cookie("token", token, {
    httpOnly: true, // Prevents JavaScript access
    secure: true, // Only send over HTTPS
    sameSite: "Strict", // Prevent CSRF (can be 'Lax' or 'None' for cross-site)
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  console.log("successful login");
  res.json({
    message: "Login successful",
  });
});

app.post("/api/signup", async (req, res) => {
  logger.info("signup accessed");
  const { email, password, username, firstName, lastName, phone, address } =
    req.body;
  // phone and address are optional
  // Function to find user by email
  async function findUserByEmail(email) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0]; // Return the user object
    } catch (err) {
      console.error("Error fetching user from database", err);
      return null;
    }
  }

  // Function to create a new user (only email and password are required)
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
      console.log("User created:", result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.error("Error creating user:", err);
      throw new Error("Error creating user");
    }
  }

  // Find user from database using email
  let user = await findUserByEmail(email);
  // If user doesn't exist, create the user
  if (!user) {
    console.log("creating new user");
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
    console.log("user already exists");
    res.status(409).json({ message: "user with this email already exists" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "user created probably",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
