"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import "../deletem.css";
import Link from "next/link";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

const MessagesPage: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("Checking authentication...");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const fetchMessages = async (): Promise<Message[]> => {
    try {
      const res = await fetch("/api/contact-messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      return data.messages || [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      fetchMessages().then((data) => {
        setMessages(data);
        setStatus(data.length ? "Messages loaded." : "No messages yet.");
      });
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/delete-message?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      const remaining = messages.length - 1;
      setStatus(remaining > 0 ? "Messages loaded." : "No messages yet.");
    } catch (err) {
      console.error("Delete error:", err);
      setStatus("Failed to delete message.");
    }
  };

  if (isAuthenticated === null) return <p>{status}</p>;
  if (isAuthenticated === false) return null; // Redirecting

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

        <main className="main-content messages-container">
          <h1>Contact Messages</h1>

          {messages.length > 0 ? (
            <ul className="messages-list">
              {messages.map((msg) => (
                <li key={msg.id} className="message-item">
                  <strong>{msg.name}</strong>
                  <p><strong>Subject:</strong> {msg.subject}</p>
                  <p><strong>Message:</strong> {msg.message}</p>

                  {msg.created_at && (
                    <small className="timestamp">
                      {new Date(msg.created_at).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                  )}

                  <div className="button-group">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="email-icon-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Reply to ${msg.email}`}
                      title={`Reply to ${msg.email}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M2 4h20v16H2V4zm2 2v1.382l8 4.618 8-4.618V6H4zm0 4.617V18h16v-7.383l-8 4.618-8-4.618z" />
                      </svg>
                    </a>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(msg.id)}
                      aria-label="Delete message"
                      title="Delete message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>{status}</p>
          )}
        </main>
      </div>
    </>
  );
};

export default MessagesPage;
