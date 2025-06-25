import { createConnection } from '@/lib/dbcon';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'; // Use env var in production

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if ((!username && !email) || !password) {
      return new Response(JSON.stringify({ error: "Username/email and password required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const conn = await createConnection();

    // Query user by username or email
    const [users] = await conn.execute(
      `SELECT user_id, username, email, password, is_active 
       FROM users 
       WHERE username = ? OR email = ?`,
      [username || '', email || '']
    );

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return new Response(JSON.stringify({ error: "User account not active" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
