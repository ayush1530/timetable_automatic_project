import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Automated Timetable Portal</h1>
        <p>
          Easily generate, view, and manage your institute’s timetable with just a few clicks.
        </p>
        <div className="hero-buttons">
          <a href="/generate" className="btn">Generate Timetable</a>
          <a href="/view" className="btn secondary">View Timetable</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <span className="icon">🕒</span>
            <h3>Auto Timetable</h3>
            <p>Generate timetables automatically with minimal input.</p>
          </div>
          <div className="feature-card">
            <span className="icon">👩‍🏫</span>
            <h3>Faculty Management</h3>
            <p>Add and manage faculty details (HOD access only).</p>
          </div>
          <div className="feature-card">
            <span className="icon">📅</span>
            <h3>Substitute Allocation</h3>
            <p>Assign substitutes when a teacher is absent.</p>
          </div>
          <div className="feature-card">
            <span className="icon">📊</span>
            <h3>Class-wise View</h3>
            <p>View timetable department, semester, and class-wise.</p>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-grid">
          <a href="/add-subject" className="link-card">➕ Add Subjects</a>
          <a href="/add-faculty" className="link-card">👨‍🏫 Add Faculty</a>
          <a href="/generate" className="link-card">⚡ Generate Timetable</a>
          <a href="/view" className="link-card">📖 View Timetable</a>
        </div>
      </section>
    </div>
  );
}

export default Home;
