"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";
import "../css/dashboard.css";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_ad?: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Auth check with conditional render to prevent flash
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/login");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch contact messages only once after auth confirmed
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact-messages");
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data.messages || []);
        setStatus("✅ Messages loaded");
      } catch (error) {
        console.error("❌ Fetch error:", error);
        setStatus("❌ Failed to load messages");
      }
    };

    fetchMessages();
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (isAuthenticated === false) {
    return null; // Redirecting, don't render content
  }
  console.log(status)
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-logo">Portfolio Admin</div>
          <nav>
            <ul>
              <li><Link href="/admin">Overview</Link></li>
              <li><Link href="/admin/projects">Projects</Link></li>
              <li><Link href="/admin/messages">Messages</Link></li>
              <li><Link href="/admin/skills">Skills</Link></li>
              <li><Link href="/admin/testimonials">Testimonials</Link></li>
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    router.push("/login");
                  }}
                  className="logout-btn"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <header className="header">
            <h1>Welcome, Patience!</h1>
          </header>

          <section className="stats">
            <div className="stat-card">
              <h2>6</h2>
              <p>Total Projects</p>
            </div>
            <div className="stat-card">
              <Link href="/admin/messages">
                <h2>{messages.length}</h2>
              </Link>
              <p>Messages Received</p>
            </div>
            <div className="stat-card">
              <h2>10</h2>
              <p>Skills Listed</p>
            </div>
            <div className="stat-card">
              <h2>3</h2>
              <p>Testimonials</p>
            </div>
          </section>

          <section className="recent-tasks">
            <h2>Recent Messages</h2>
            <ul>
              {messages.length > 0 ? (
                messages.slice(0, 3).map((msg) => (
                  <li key={msg.id}>
                    <strong>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline", color: "#4f46e5" }}
                        className="email"
                      >
                        {msg.name} ({msg.email})
                      </a>
                    </strong>
                    : {`${msg.subject} — "${msg.message.slice(0, 60)}..."`}
                  </li>
                ))
              ) : (
                <li>No messages yet.</li>
              )}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
