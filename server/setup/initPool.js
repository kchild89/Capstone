import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Pool } = pg;

// Ensure RENDER is checked correctly as a string
const isRender = process.env.RENDER === "true";

export const pool = new Pool({
  connectionString: isRender
    ? process.env.DATABASE_URL_INTERNAL // Use internal DB on Render
    : process.env.DATABASE_URL || process.env.DATABASE_URL_EXTERNAL, // Use local DB
  ssl: isRender ? { rejectUnauthorized: false } : false, // Required for Render DB
});
