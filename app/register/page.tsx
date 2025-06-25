"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "../css/register.css";

interface RegisterForm {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
}

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.first_name.trim()) newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())) {
      newErrors.email = "Invalid email address";
    }

    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof RegisterForm]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      setSubmitted(true);
      setForm({
        first_name: "",
        last_name: "",
        username: "",
        phone_number: "",
        email: "",
        password: "",
        confirm_password: "",
      });
    } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("Unknown error");
        }
      }

     finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submitted) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setSubmitted(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <>
      <main className="pageContainer">
        <section className="card">
          <header className="cardHeader">
            <h1 className="cardTitle">Register</h1>
          </header>

          <form onSubmit={handleSubmit} noValidate className="form">
            {/* First Name */}
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              className={`input ${errors.first_name ? "inputError" : ""}`}
              disabled={loading}
              placeholder="firstname"
            />
            {errors.first_name && <span className="errorText">{errors.first_name}</span>}

            {/* Last Name */}
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              className={`input ${errors.last_name ? "inputError" : ""}`}
              disabled={loading}
              placeholder="lastname"
            />
            {errors.last_name && <span className="errorText">{errors.last_name}</span>}

            {/* Username */}
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className={`input ${errors.username ? "inputError" : ""}`}
              disabled={loading}
              placeholder="username"
            />
            {errors.username && <span className="errorText">{errors.username}</span>}

            {/* Phone Number */}
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={handleChange}
              className={`input ${errors.phone_number ? "inputError" : ""}`}
              disabled={loading}
              placeholder="phone number"
            />
            {errors.phone_number && <span className="errorText">{errors.phone_number}</span>}

            {/* Email */}
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`input ${errors.email ? "inputError" : ""}`}
              disabled={loading}
              placeholder="email"
            />
            {errors.email && <span className="errorText">{errors.email}</span>}

            {/* Password */}
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`input ${errors.password ? "inputError" : ""}`}
              disabled={loading}
              placeholder="password"
            />
            {errors.password && <span className="errorText">{errors.password}</span>}

            {/* Confirm Password */}
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              value={form.confirm_password}
              onChange={handleChange}
              className={`input ${errors.confirm_password ? "inputError" : ""}`}
              disabled={loading}
              placeholder="re-enter password"
            />
            {errors.confirm_password && (
              <span className="errorText">{errors.confirm_password}</span>
            )}

            <button
              type="submit"
              className={`button ${loading ? "buttonDisabled" : ""}`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </section>
      </main>

      {showToast && (
        <div className="toast" role="alert">
          ✅ Registration successful!
        </div>
      )}
    </>
  );
}
