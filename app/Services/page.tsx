"use client";
import React from "react";
import Navbar from "../components/Navbar";
import style from "../css/services.module.css";

const services = [
  {
    title: "Web Development",
    description:
      "Build fast, scalable, and secure web applications tailored to your business needs.",
    icon: "🌐",
    gradient: "linear-gradient(135deg, rgb(49, 50, 54), #764ba2)",
  },
  {
    title: "UI/UX Design",
    description:
      "Craft intuitive and beautiful interfaces that engage your users and increase conversion.",
    icon: "🎨",
    gradient: "linear-gradient(135deg, #f7971e, rgb(25, 31, 34))",
  },
  {
    title: "Cloud Solutions",
    description:
      "Leverage cloud technologies for scalable infrastructure and optimized workflows.",
    icon: "☁️",
    gradient: "linear-gradient(135deg, rgb(207, 209, 214), rgb(4, 20, 36))",
  },
  {
    title: "Data Analytics",
    description:
      "Turn data into actionable insights with powerful analytics and visualization.",
    icon: "📊",
    gradient: "linear-gradient(135deg, rgb(180, 97, 41), rgb(26, 24, 24))",
  },
  {
    title: "Cybersecurity",
    description:
      "Protect your digital assets with comprehensive security strategies and monitoring.",
    icon: "🛡️",
    gradient: "linear-gradient(135deg, rgb(61, 116, 170), #4ca1af)",
  },
];

const ServiceCard = ({ title, description, icon, gradient }: typeof services[0]) => {
  const cardStyle = { background: gradient };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    card.style.boxShadow = "0 20px 35px rgba(0, 0, 0, 0.3)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    card.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)";
  };

  return (
    <div
      className={style.serviceCard}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-label={`${title} service`}
    >
      <div className={style.serviceIcon} aria-hidden="true">
        {icon}
      </div>
      <h3 className={style.serviceTitle}>{title}</h3>
      <p className={style.serviceDescription}>{description}</p>
    </div>
  );
};

export default function Services() {
  return (
    <>
      <Navbar />
      <main className={style.servicesContainer} aria-label="Services Section">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </main>
      <footer className="footer" aria-label="Page footer">
        <p>© 2025 I-Mind. All rights reserved.</p>
      </footer>
    </>
  );
}
