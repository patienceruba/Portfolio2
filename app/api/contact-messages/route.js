import { createConnection } from "@/lib/dbcon";

export async function GET() {
  try {
    const conn = await createConnection();

    const [messages] = await conn.execute(`
      SELECT id, name, email, subject, message, created_at 
      FROM contact_messages 
      ORDER BY created_at DESC
    `);

    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
