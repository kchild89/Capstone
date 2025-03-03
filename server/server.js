// server/server.js

const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.RENDER ? process.env.DATABASE_URL_INTERNAL : process.env.DATABASE_URL_EXTERNAL,
  ssl: {
    rejectUnauthorized: false,
  },
});


const PORT = process.env.PORT || 3001;

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
