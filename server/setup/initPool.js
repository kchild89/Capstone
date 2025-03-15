import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.RENDER === "true"
      ? process.env.DATABASE_URL_EXTERNAL // Use EXTERNAL since you're connecting from local
      : process.env.DATABASE_URL_INTERNAL, // Internal only works if backend is deployed
  ssl: {
    rejectUnauthorized: false,
  },
});
