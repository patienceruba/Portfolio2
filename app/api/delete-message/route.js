import { createConnection } from "@/lib/dbcon";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const conn = await createConnection();
    const [result] = await conn.execute("DELETE FROM contact_messages WHERE id = ?", [id]);

    return new Response(JSON.stringify({ success: true, deleted: result.affectedRows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
