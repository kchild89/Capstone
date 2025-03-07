import { from as copyFrom } from "pg-copy-streams";
import { pipeline } from "stream";
import { pool } from "./initPool.js";
import fs from "fs";

export async function initCourses() {
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
