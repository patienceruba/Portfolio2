import React, { useState, useEffect } from "react";
import style from "../css/contact.module.css";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
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
      <main className={style.pageContainer}>
        <section className={style.card}>
          <header className={style.cardHeader}>
            <h1 className={style.cardTitle}>Contact Us</h1>
            {/* <p className={style.cardSubtitle}>
              Have questions or want to work with us? Fill out the form below
              and we’ll get back to you promptly.
            </p> */}
          </header>

          <form onSubmit={handleSubmit} noValidate className={style.form}>
            <div className={style.fullnameEmail}>
              <div>
                <label htmlFor="name" className={style.label}>
                  Name <sup>*</sup>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className={`${style.input} ${errors.name ? style.inputError : ""}`}
                  disabled={loading}
                />
                {errors.name && <span className={style.errorText}>{errors.name}</span>}
              </div>

              <div>
                <label htmlFor="email" className={style.label}>
                  Email <sup>*</sup>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`${style.input} ${errors.email ? style.inputError : ""}`}
                  disabled={loading}
                />
                {errors.email && <span className={style.errorText}>{errors.email}</span>}
              </div>
            </div>

            {/* Subject */}
            <label htmlFor="subject" className={style.label}>
              Subject <sup>*</sup>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              className={`${style.input} ${errors.subject ? style.inputError : ""}`}
              disabled={loading}
            />
            {errors.subject && <span className={style.errorText}>{errors.subject}</span>}

            {/* Message */}
            <label htmlFor="message" className={style.label}>
              Message <sup>*</sup>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className={`${style.textarea} ${errors.message ? style.inputError : ""}`}
              disabled={loading}
            />
            {errors.message && <span className={style.errorText}>{errors.message}</span>}

            <button
              type="submit"
              className={`${style.button} ${loading ? style.buttonDisabled : ""}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </main>

      {showToast && (
        <div className={style.toast} role="alert">
          ✅ Message sent successfully!
        </div>
      )}
    </>
  );
}
