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
          username VARCHAR(50),
          email VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          firstName VARCHAR(50),
          lastName VARCHAR(50),
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

  // Function to create a new user (only email and password are required)
  async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    function getUsernameFromEmail(email) {
      if (!email) return null; // Prevents errors if email is undefined
      const match = email.match(/^([^@]+)/);
      return match ? match[1] : null;
    }

    const username = getUsernameFromEmail(email);
    const query = `
    INSERT INTO users (email, password, username)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    try {
      const result = await pool.query(query, [email, hashedPassword, username]);
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
    console.log("User not found, creating new user...");
    user = await createUser(email, password);
  }

  // Compare passwords using bcrypt (for both new and existing users)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // Generate JWT token
  const payload = {
    userId: user.id, // or whatever your user identifier is
    email: user.email, // Use email instead of username
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

  // Send the token to the client
  console.log("successful login");
  res.json({
    msg: user ? "Login successful" : "User created and logged in",
    token: token,
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
