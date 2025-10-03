import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">📅 Timetable Portal</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/generate">Generate</Link></li>
        <li><Link to="/view">View</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
