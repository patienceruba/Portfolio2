import { createConnection } from '@/lib/dbcon';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { first_name, last_name, username, phone_number, email, password } = body;

    // Basic validation
    if (!first_name || !last_name || !username || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect to DB
    const conn = await createConnection();

    // Check if username or email already exists
    const [existingUsers] = await conn.execute(
      'SELECT user_id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: "Username or email already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert new user with is_active default false
    await conn.execute(
      `INSERT INTO users 
        (first_name, last_name, username, phone_number, email, password, is_active, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, false, NOW(), NOW())`,
      [first_name, last_name, username, phone_number, email, hashedPassword]
    );

    return new Response(JSON.stringify({ success: true, message: "User registered successfully" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
