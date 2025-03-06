// server/server.js

const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const pool = new Pool({
  connectionString: process.env.RENDER
    ? process.env.DATABASE_URL_INTERNAL
    : process.env.DATABASE_URL_EXTERNAL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const PORT = process.env.PORT || 3001;

const fs = require("fs");
const { pipeline } = require("stream");
const copyFrom = require("pg-copy-streams").from;

// move these functions to different files
async function copyCSVToDB() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'courses'
      );
    `);
    const tableExists = result.rows[0].exists;
    if (!tableExists) {
      // create courses table if it doesn't exist
      await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        string_id VARCHAR PRIMARY KEY,
        title VARCHAR,
        description TEXT,
        schedule VARCHAR,
        classroom_number VARCHAR,
        maximum_capacity INT,
        credit_hours INT,
        tuition_cost DECIMAL
      );
    `);
      const query = `COPY courses(string_id, title, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost) 
                   FROM STDIN WITH CSV HEADER`;

      const stream = client.query(copyFrom(query));
      const fileStream = fs.createReadStream("../courseData.csv");

      pipeline(fileStream, stream, (err) => {
        if (err) {
          console.error("Error inserting CSV:", err);
        } else {
          console.log("CSV data inserted successfully!");
        }
        client.release();
      });
    } else {
      console.log("courses table already exists");
    }
  } catch (error) {
    console.error("Error inserting CSV:", error);
    client.release();
  }
}
copyCSVToDB();
async function createUsersTable() {
  const usersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          firstName VARCHAR(50) NOT NULL,
          lastName VARCHAR(50) NOT NULL,
          phone VARCHAR(20),
          address TEXT
      );
  `;

  try {
    await pool.query(usersTableQuery);
    console.log("Users table ensured.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}
createUsersTable();

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// allow json stuff
app.use(express.json());

// allow cross origin resource sharing
app.use(cors());

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/", (req, res) => {
  res.json({ message: "test test test test" });
});

app.post("/api/login", async (req, res) => {
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

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

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

// Test DB Connection
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Connected to DB!", time: result.rows[0].now });
  } catch (error) {
    console.error("DB Connection Error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
