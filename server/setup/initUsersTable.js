import { pool } from "./initPool.js";

export async function createUsersTable() {
  const usersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          firstName VARCHAR(50) NOT NULL,
          lastName VARCHAR(50) NOT NULL,
          phone VARCHAR(20),
          address TEXT,
          courses TEXT[]
      );
  `;

  try {
    await pool.query(usersTableQuery);
    console.log("Users table ensured.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}
