import pg from "pg";

export const dbClient = new pg.Client({
  connectionString:
    "postgresql://postgres:Anabil_2023@db.qgphiubbfnunppcnpudx.supabase.co:5432/postgres",
});
console.log("hi");
await dbClient.connect();

const result = await dbClient.query("SELECT * from users");
console.log("~~~ results, ", result.rows);
