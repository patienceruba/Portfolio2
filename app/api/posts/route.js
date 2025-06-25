// app/api/server/route.js
import { createConnection } from "@/lib/dbcon.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();
    const sql = "SELECT * FROM hero";
    const [hero] = await db.query(sql) 

    return NextResponse.json(hero);
  } catch (error) {
    console.error("❌ DB connection error:", error);
    return NextResponse.json({ error: "DB connection failed" }, { status: 500 });
  }
}
