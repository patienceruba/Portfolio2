"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import '../css/navbar.css'; 

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav_list = ["Home", "About", "Services", "Projects"];

  return (
    <nav className="nav-bar">
      <h1 className="logo">
        <Link href="/">I.Mind</Link>
      </h1>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {nav_list.map((item, index) => (
          <Link
            href={item === "Home" ? "/" : `/${item}`}
            key={index}
            className="nav-item"
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
