"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../css/circularCarousel.css";

const cards = [
  "Graphic Design",
  "Robotics Engineering",
  "Logo Creation",
  "Vinyl Art",
  "Virtual Reality Experiences",
];

const desc = ["Mission", "Vision", "Target"];

const imgs = [
  "/images/carl-heyerdahl-KE0nC8-58MQ-unsplash.jpg",
  "/images/alex-knight-2EJCSULRwC8-unsplash.jpg",
  "/images/nathan-dumlao-R_5bQWAf8p0-unsplash.jpg",
  "/images/nikita-kachanovsky-OVbeSXRk_9E-unsplash.jpg",
  "/images/uriel-soberanes-MxVkWPiJALs-unsplash.jpg",
];

const stacks = ["React", "Node.js", "Next.js", "MySQL", "Tailwind CSS", "JavaScript", "Python", "Django"];

export default function CircularCarousel() {
  const [centerIndex, setCenterIndex] = useState(2);
  const [cardWidth, setCardWidth] = useState(250);
  const [spacing, setSpacing] = useState(150);
  const [isMobile, setIsMobile] = useState(false);

  const sideCardsCount = Math.floor(cards.length / 2);

  useEffect(() => {
    function updateSizes() {
      const root = getComputedStyle(document.documentElement);
      const cardW = parseInt(root.getPropertyValue("--card-width")) || 250;
      const space = parseInt(root.getPropertyValue("--card-spacing")) || 150;
      setCardWidth(window.innerWidth < 640 ? 180 : cardW);
      setSpacing(window.innerWidth < 640 ? 100 : space);
      setIsMobile(window.innerWidth < 640);
    }

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  const getOffset = (index: number) => {
    let offset = index - centerIndex;
    if (offset > sideCardsCount) offset -= cards.length;
    if (offset < -sideCardsCount) offset += cards.length;
    return offset;
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const offset = getOffset(index);
    const rotationY = offset * 30;
    const translateX = offset * spacing;
    const scale = offset === 0 ? 1 : 0.7;
    const opacity = Math.abs(offset) > sideCardsCount ? 0 : 1 - Math.abs(offset) * 0.3;

    return {
      width: `${cardWidth}px`,
      height: "350px",
      backgroundImage: `url(${imgs[index % imgs.length]})`,
      transform: `
        translateX(${translateX}px)
        perspective(1000px)
        rotateY(${rotationY}deg)
        scale(${scale})
      `,
      opacity,
      zIndex: offset === 0 ? 10 : 5,
      boxShadow: offset === 0 ? "0 10px 25px rgba(0,0,0,0.7)" : "none",
      cursor: "pointer",
      position: "absolute",
      top: 0,
      left: isMobile ? "20%" : "35%",
      borderRadius: "10px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      textShadow: "0 0 5px rgba(0,0,0,0.8)",
      overflow: "hidden",
      transition: "all 0.5s ease",
      outline: "none",
    };
  };

  const moveLeft = () =>
    setCenterIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  const moveRight = () =>
    setCenterIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));

  return (
    <>
      <Navbar />

      <main>
        {/* Carousel Section */}
        <section className="carousel-section" aria-label="Circular carousel">
          <button onClick={moveLeft} aria-label="Previous" className="carousel-button left">
            ◀
          </button>

          <div className="carousel-container">
            {cards.map((card, i) => {
              const offset = getOffset(i);
              const isVisible = Math.abs(offset) <= sideCardsCount;

              return (
                <motion.div
                  key={i}
                  className="carousel-card"
                  style={getCardStyle(i)}
                  onClick={() => setCenterIndex(i)}
                  title={card}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setCenterIndex(i);
                  }}
                  animate={{
                    scale: offset === 0 ? 1 : 0.7,
                    opacity: isVisible ? 1 - Math.abs(offset) * 0.3 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <motion.div className="card-label" layout>
                    {card}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <button onClick={moveRight} aria-label="Next" className="carousel-button right">
            ▶
          </button>
        </section>

        {/* Description Cards Section */}
        <section className="desc-section" aria-label="Description cards">
          {desc.map((descItem, index) => (
            <div
              key={index}
              className="desc-card"
              style={{ backgroundImage: `url(${imgs[index % imgs.length]})` }}
            >
              {descItem}
            </div>
          ))}
        </section>

        {/* Tech Stack Section */}
        {/* <section className="stack-section" aria-label="Tech stack">
          <ul className="stack-list">
            {stacks.map((stack, index) => (
              <li
                key={index}
                className="stack-item"
                style={{
                  backgroundImage: `url(/images/stack-${index + 1}.png)`,
                }}
              >
                {stack}
              </li>
            ))}
          </ul>
        </section> */}
      </main>

      <footer aria-label="Page footer" className="footer">
        <p>© 2025 I-Mind. All rights reserved.</p>
      </footer>
    </>
  );
}
