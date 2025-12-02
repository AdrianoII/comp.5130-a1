import { neon } from "@neondatabase/serverless";

export default async function handler(req: any, res: any) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "DATABASE_URL not set" });
  }

  try {
    const sql = neon(process.env.DATABASE_URL as string);
    const rooms = await sql`select name, capacity from rooms where available = true order by name;`;
    return res.status(200).json({ rooms });
  } catch (err) {
    console.error("DB query error:", err);
    return res.status(500).json({ error: "query_failed", details: String(err) });
  }
}