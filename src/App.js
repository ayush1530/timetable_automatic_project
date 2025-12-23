import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import GenerateTimetable from "./pages/GenerateTimetable";
import ViewTimetable from "./pages/ViewTimetable";
import About from "./pages/About";
import Faculty from "./pages/Faculty";
import Subjects from "./pages/Subject";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<GenerateTimetable />} />
          <Route path="/view" element={<ViewTimetable />} />
          <Route path="/about" element={<About />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/subjects" element={<Subjects />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
