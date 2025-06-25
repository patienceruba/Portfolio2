"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../css/login.css";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState<{ type: string; text: string }>({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Add proper typing here for input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add typing here for form submit event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("authToken", data.token);

      setMessage({ type: "success", text: "Login successful!" });

      setTimeout(() => {
        router.push("/admin");
      }, 1000);

    } catch (err) {
      if (err instanceof Error) {
        setMessage({ type: "error", text: err.message });
      } else {
        setMessage({ type: "error", text: "Unknown error" });
      }
    }
    finally {
      setLoading(false);
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  return (
    <div className="login-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-large" role="status" aria-label="Loading" />
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {message.text && (
        <div
          className={`toast-popup ${
            message.type === "success" ? "toast-success" : "toast-error"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
