// app/more/ClientMorePage.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Post {
  title: string;
  description: string;
  message: string;
}

export default function ClientMorePage() {
  const [status, setStatus] = useState("Checking...");
  const [more, setMore] = useState<Post[]>([]);

  const searchParams = useSearchParams();
  const indexParam = parseInt(searchParams.get("index") ?? "0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/posts/");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        setMore(Array.isArray(data) ? data : data.posts ?? []);
        setStatus("✅ Data loaded");
      } catch (error) {
        console.error("❌ Fetch error:", error);
        setStatus("❌ Failed to load data");
      }
    };

    fetchData();
  }, []);

  const selectedPost = more[indexParam];

  return (
    <>
      <Navbar />
      <main
        className="more-container"
        style={{
          backgroundImage: `url("/images/carl-heyerdahl-KE0nC8-58MQ-unsplash.jpg")`,
          minWidth: "90%",
          minHeight: "500px",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {status !== "✅ Data loaded" ? (
          <p className="status-text">{status}</p>
        ) : selectedPost ? (
          <div className="post-card">
            <h2 className="post-title" style={{ textAlign: "center" }}>
              {selectedPost.title}
            </h2>
            <p className="post-description">{selectedPost.description}</p>
            <br />
            <hr />
            <small>Message: {selectedPost.message}</small>
          </div>
        ) : (
          <p>No content found at this index.</p>
        )}
      </main>
    </>
  );
}
