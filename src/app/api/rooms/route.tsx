import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  try {
    const sql = neon(DATABASE_URL);
    const rooms = await sql`select id, name, capacity from rooms where available = true order by name;`;
    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("DB query error:", err);
    return NextResponse.json({ error: "query_failed", details: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const id = body?.id;
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const sql = neon(DATABASE_URL);
    const result = await sql`
      UPDATE rooms
      SET available = false
      WHERE id = ${id}
      RETURNING id, name, capacity, available;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "room_not_found" }, { status: 404 });
    }

    return NextResponse.json({ room: result[0] });
  } catch (err) {
    console.error("DB update error:", err);
    return NextResponse.json({ error: "update_failed", details: String(err) }, { status: 500 });
  }
}