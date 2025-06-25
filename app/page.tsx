"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Link from "next/link";
import styles from "./css/style.module.css";
import About from "./components/About";

interface Hero {
  title: string;
  description: string;
}
interface Card {
  title: string;
  description: string;
}

export default function Home() {
  const [hero, setHero] = useState<Hero[]>([]);
  const [status, setStatus] = useState("Checking...");
  const [cards, setCard] = useState<Card[]>([]);

  const imgs = [
    "/images/carl-heyerdahl-KE0nC8-58MQ-unsplash.jpg",
    "/images/alex-knight-2EJCSULRwC8-unsplash.jpg",
    "/images/nathan-dumlao-R_5bQWAf8p0-unsplash.jpg",
    "/images/nikita-kachanovsky-OVbeSXRk_9E-unsplash.jpg",
    "/images/uriel-soberanes-MxVkWPiJALs-unsplash.jpg",
  ];

  const images = [
    "/images/nikita-kachanovsky-OVbeSXRk_9E-unsplash.jpg",
    "/images/lauren-mancke-aOC7TSLb1o8-unsplash.jpg",
    "/images/alejandro-escamilla-tAKXap853rY-unsplash.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500); // duration matches CSS transition
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const heroTextRef = useRef<HTMLParagraphElement>(null);

  const eventHandler = () => {
    if (heroTextRef.current) {
      heroTextRef.current.style.boxShadow = "0 0 10px cyan";
      setTimeout(() => {
        if (heroTextRef.current) heroTextRef.current.style.boxShadow = "";
      }, 2000);
    }
  };

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch("/api/posts/");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setHero(data);
        setStatus("✅ Data loaded");
      } catch (error) {
        console.error("❌ Fetch error:", error);
        setStatus("❌ Failed to load data");
      }
    }
    fetchHero();
  }, []);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("/api/cards/");
        if (!res.ok) throw new Error("Failed to fetch cards");
        const data = await res.json();
        setCard(Array.isArray(data) ? data : data.posts ?? []);
        setStatus("✅ Data loaded");
      } catch (error) {
        console.error("❌ Fetch error:", error);
        setStatus("❌ Failed to load data");
      }
    }
    fetchCards();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.mainContainer}>
        {/* Hero Section */}
        <motion.section
          className={`${styles.hero} ${fade ? styles.fadeIn : styles.fadeOut}`}
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          aria-label="Hero section with rotating background images"
        >
          {hero.map((heros, index) => (
            <div key={index}>
              <h1>{heros.title}</h1>
              <p
                className={styles.heroText}
                onMouseOver={eventHandler}
                ref={heroTextRef}
              >
                {heros.description.split(" ").slice(0, 20).join(" ") + "..."}
              </p>
              <Link href={`/more?index=${index}`} className={styles.heroBtn}>
                Learn More
              </Link>
            </div>
          ))}
        </motion.section>

        {/* Cards Section */}
        <motion.section
          className={styles.cards}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.3 }}
          aria-label="Cards listing section"
        >
          {cards.map((card, index) => (
            <article
              key={index}
              className={styles.card}
              style={{ backgroundImage: `url(${imgs[index % imgs.length]})` }}
              tabIndex={0}
              aria-label={`${card.title} card`}
            >
              <div className={styles.cardOverlay} />
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <Link href={`/cMore?index=${index}`} className={styles.heroBtn}>
                View More
              </Link>
            </article>
          ))}
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.6 }}
          aria-label="About section"
        >
          <About />
        </motion.section>

        {/* Footer Section */}
        <motion.footer
          className={styles.footer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          aria-label="Page footer"
        >
          <p>&copy; 2025 I-Mind. All rights reserved.</p>
        </motion.footer>
      </main>
    </>
  );
}
