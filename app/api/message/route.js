import { createConnection } from "@/lib/dbcon";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const conn = await createConnection();

    await conn.execute(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );

    // Configure your SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,        // e.g. smtp.gmail.com
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,                      // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,     // your SMTP username
        pass: process.env.SMTP_PASS,     // your SMTP password or app password
      },
    });

    // Compose email options
    const mailOptions = {
      from: `"Contact Form" <${process.env.SMTP_USER}>`, // sender address
      to: process.env.NOTIFY_EMAIL,                       // your email to receive notifications
      subject: `New Contact Message: ${subject}`,
      text: `
You received a new contact message.

Name: ${name}
Email: ${email}
Subject: ${subject}
Message:
${message}
      `,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
