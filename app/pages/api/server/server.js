// pages/api/server.js
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // DB connection logic here
  res.status(200).json({ message: "DB connected" });
}
