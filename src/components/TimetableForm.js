import React, { useState } from "react";

const TimetableForm = ({ onGenerate }) => {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (course && semester && section) {
      onGenerate({ course, semester, section });
    } else {
      alert("Please select all fields!");
    }
  };

  return (
    <form className="timetable-form" onSubmit={handleSubmit}>
      <h2>Generate Timetable</h2>

      <label>Course:</label>
      <select value={course} onChange={(e) => setCourse(e.target.value)}>
        <option value="">Select Course</option>
        <option value="BCA">BCA</option>
        <option value="BBA">BBA</option>
        <option value="MCA">MCA</option>
      </select>

      <label>Semester:</label>
      <select value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="">Select Semester</option>
        <option value="1">1st Sem</option>
        <option value="2">2nd Sem</option>
        <option value="3">3rd Sem</option>
        <option value="4">4th Sem</option>
        <option value="5">5th Sem</option>
        <option value="6">6th Sem</option>
      </select>

      <label>Section:</label>
      <select value={section} onChange={(e) => setSection(e.target.value)}>
        <option value="">Select Section</option>
        <option value="A">Section A</option>
        <option value="B">Section B</option>
      </select>

      <button type="submit">Generate</button>
    </form>
  );
};

export default TimetableForm;
