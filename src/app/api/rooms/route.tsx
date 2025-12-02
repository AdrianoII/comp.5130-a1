import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  try {
    const sql = neon(DATABASE_URL);
    const rooms = await sql`select name, capacity from rooms where available = true order by name;`;
    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("DB query error:", err);
    return NextResponse.json({ error: "query_failed", details: String(err) }, { status: 500 });
  }
}