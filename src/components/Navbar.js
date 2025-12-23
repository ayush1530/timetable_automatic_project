import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="logo">Time Table Portal</h2>

      {/* Mobile menu button */}
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Navigation Links */}
      <div className={`nav-links ${open ? "active" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/subjects" onClick={() => setOpen(false)}>Subjects</Link>
        <Link to="/faculty" onClick={() => setOpen(false)}>Faculty</Link>
        <Link to="/generate" onClick={() => setOpen(false)}>Generate</Link>
        <Link to="/view" onClick={() => setOpen(false)}>View</Link>
      </div>
    </nav>
  );
}

export default Navbar;
