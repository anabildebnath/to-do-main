import pg from "pg";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;



export const dbClient = new pg.Client({
  connectionString: process.env.SUPABASE_STRING,
});

// console.log("hi");
// await dbClient.connect();

// const result = await dbClient.query("SELECT * from users");
// console.log("~~~ results, ", result.rows);

(async () => {
  try {
    // Connect to the database
    await dbClient.connect();
    console.log("Connected to the database successfully.");

    // Perform a query
    const result = await dbClient.query("SELECT * FROM users");

    // Log the results
    console.log("~~~ results:", result.rows);
  } catch (err) {
    // Handle any errors
    console.error("Error connecting to the database or executing query", err);
  } finally {
    // Ensure the client will close when you finish/error
    // await dbClient.end();
    // console.log("Database connection closed.");
  }
})();
