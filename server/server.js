// server/server.js

const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

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
