import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Subject.css";

function Subjects() {
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [sem, setSem] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [weeklyClasses, setWeeklyClasses] = useState("");
  const [theoryClasses, setTheoryClasses] = useState("");
  const [practicalClasses, setPracticalClasses] = useState("");
  const [type, setType] = useState(""); // Theory, Practical, or Both
  const [data, setData] = useState([]);
  const [selectedBranchSectionSem, setSelectedBranchSectionSem] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/subjects");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        alert(`Error fetching subjects: ${err.response?.data?.message || err.message}`);
      }
    };
    fetchData();
  }, []);

  const startEdit = (subject) => {
    setBranch(subject.branch);
    setSection(subject.section);
    setSem(subject.sem);
    setSubjectName(subject.subject_name);
    setSubjectCode(subject.subject_code);
    setType(subject.type);
    setEditingId(subject.id);

    // For Both, fetch paired subject to set theoryClasses and practicalClasses
    if (subject.type === "Both") {
      const pairedSubject = data.find(
        (s) =>
          s.branch === subject.branch &&
          s.section === subject.section &&
          s.sem === subject.sem &&
          s.subject_name === subject.subject_name &&
          s.subject_code === subject.subject_code &&
          s.id !== subject.id
      );
      if (pairedSubject) {
        const theoryRecord = subject.type === "Theory" ? subject : pairedSubject;
        const practicalRecord = subject.type === "Practical" ? subject : pairedSubject;
        setTheoryClasses(theoryRecord.weekly_classes.toString());
        setPracticalClasses(practicalRecord.weekly_classes.toString());
      } else {
        // Fallback: assume same classes for both
        setTheoryClasses(subject.weekly_classes.toString());
        setPracticalClasses(subject.weekly_classes.toString());
      }
    } else {
      setWeeklyClasses(subject.weekly_classes.toString());
      setTheoryClasses("");
      setPracticalClasses("");
    }
  };

  const deleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`http://localhost:5000/api/subjects/${id}`);
        const response = await axios.get("http://localhost:5000/api/subjects");
        setData(response.data);
        setSelectedBranchSectionSem("");
        alert("Subject deleted successfully!");
      } catch (err) {
        console.error("Error deleting subject:", err);
        alert(`Error deleting subject: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSubjectName("");
    setSubjectCode("");
    setWeeklyClasses("");
    setTheoryClasses("");
    setPracticalClasses("");
    setType("");
    setBranch("");
    setSection("");
    setSem("");
  };

  const handleSubmit = async () => {
    if (!branch || !section || !sem || !subjectName || !subjectCode || !type) {
      alert("Please fill all fields!");
      return;
    }
    if (type === "Both") {
      if (!theoryClasses || !practicalClasses) {
        alert("Please specify classes per week for both Theory and Practical!");
        return;
      }
      const theoryNum = parseInt(theoryClasses);
      const practicalNum = parseInt(practicalClasses);
      if (isNaN(theoryNum) || theoryNum <= 0 || isNaN(practicalNum) || practicalNum <= 0) {
        alert("Classes per week must be positive numbers!");
        return;
      }
    } else {
      if (!weeklyClasses) {
        alert("Please specify classes per week!");
        return;
      }
      const numClasses = parseInt(weeklyClasses);
      if (isNaN(numClasses) || numClasses <= 0) {
        alert("Classes per week must be a positive number!");
        return;
      }
    }

    try {
      if (editingId) {
        // Update existing subject
        await axios.put(`http://localhost:5000/api/subjects/${editingId}`, {
          branch,
          section,
          sem,
          subjectName,
          type,
          subjectCode,
          theoryClasses: type === "Both" ? parseInt(theoryClasses) : null,
          practicalClasses: type === "Both" ? parseInt(practicalClasses) : null,
          weeklyClasses: type !== "Both" ? parseInt(weeklyClasses) : null,
        });
        setBranch("");
        setSection("");
        setSem("");
      } else {
        // Add new subject(s)
        await axios.post("http://localhost:5000/api/subjects", {
          branch,
          section,
          sem,
          subjectName,
          type,
          subjectCode,
          theoryClasses: type === "Both" ? parseInt(theoryClasses) : null,
          practicalClasses: type === "Both" ? parseInt(practicalClasses) : null,
          weeklyClasses: type !== "Both" ? parseInt(weeklyClasses) : null,
        });
        // Keep branch, section, sem for multiple adds
      }
      const response = await axios.get("http://localhost:5000/api/subjects");
      setData(response.data);
      setEditingId(null);
      setSubjectName("");
      setSubjectCode("");
      setWeeklyClasses("");
      setTheoryClasses("");
      setPracticalClasses("");
      setType("");
      alert("Subject saved successfully!");
    } catch (err) {
      console.error("Error saving subject:", err);
      alert(`Error saving subject: ${err.response?.data?.message || err.message}`);
    }
  };

  const resetBranchSection = () => {
    setBranch("");
    setSection("");
    setSem("");
    setSubjectName("");
    setSubjectCode("");
    setWeeklyClasses("");
    setTheoryClasses("");
    setPracticalClasses("");
    setType("");
    setEditingId(null);
  };

  const handleTypeChange = (selectedType) => {
    // Toggle: if clicking the same type, uncheck it; otherwise, set new type
    setType(type === selectedType ? "" : selectedType);
    // Clear classes when type changes
    setWeeklyClasses("");
    setTheoryClasses("");
    setPracticalClasses("");
  };

  const branchSectionSemList = [
    ...new Set(data.map((doc) => `${doc.branch} - ${doc.section} - ${doc.sem}`)),
  ];
  const branchList = [...new Set(data.map((doc) => doc.branch))];
  const sectionList = [...new Set(data.map((doc) => doc.section))];
  const semList = [...new Set(data.map((doc) => doc.sem).filter(Boolean))];

  const currentSubjects = selectedBranchSectionSem
    ? data.filter(
        (doc) => `${doc.branch} - ${doc.section} - ${doc.sem}` === selectedBranchSectionSem
      )
    : [];

  return (
    <div className="page subject-page">
      <h2>📘 Add Subjects (Branch, Section & Sem Wise)</h2>

      <div className="subject-container">
        {/* Left side: Subject Display */}
        <div className="view-section">
          <h3>📚 View Subjects</h3>
          {branchSectionSemList.length > 0 ? (
            <>
              <select
                value={selectedBranchSectionSem}
                onChange={(e) => setSelectedBranchSectionSem(e.target.value)}
                className="custom-select"
              >
                <option value="">Select Branch, Section & Sem</option>
                {branchSectionSemList.map((key, index) => (
                  <option key={index} value={key}>
                    {key}
                  </option>
                ))}
              </select>

              {selectedBranchSectionSem && (
                <div className="subject-box">
                  <h4>{selectedBranchSectionSem}</h4>
                  <ul>
                    {currentSubjects.map((sub) => (
                      <li key={sub.id}>
                        <span>
                          {sub.subject_name} ({sub.type}, Code: {sub.subject_code}, Classes/Week: {sub.weekly_classes})
                        </span>
                        <div className="action-buttons">
                          <button onClick={() => startEdit(sub)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => deleteSubject(sub.id)} className="delete-btn">
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p>No subjects added yet.</p>
          )}
        </div>

        {/* Right side: Form */}
        <div className="subject-form">
          <div className="dropdowns">
            <div className="combo-input">
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="custom-select small"
              >
                <option value="">Select Branch</option>
                {branchList.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or type new Branch"
                onChange={(e) => setBranch(e.target.value)}
                value={branch}
                className="combo-input-field"
              />
            </div>

            <div className="combo-input">
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="custom-select small"
              >
                <option value="">Select Section</option>
                {sectionList.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or type new Section"
                onChange={(e) => setSection(e.target.value)}
                value={section}
                className="combo-input-field"
              />
            </div>

            <div className="combo-input">
              <select
                value={sem}
                onChange={(e) => setSem(e.target.value)}
                className="custom-select small"
              >
                <option value="">Select Sem</option>
                {semList.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or type new Sem"
                onChange={(e) => setSem(e.target.value)}
                value={sem}
                className="combo-input-field"
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="subject-input"
          />

          <input
            type="text"
            placeholder="Subject Code (e.g., CS101)"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            className="subject-input"
          />

          {type === "Both" ? (
            <div className="classes-group">
              <input
                type="number"
                placeholder="Theory Classes per Week"
                value={theoryClasses}
                onChange={(e) => setTheoryClasses(e.target.value)}
                className="subject-input"
                min="1"
              />
              <input
                type="number"
                placeholder="Practical Classes per Week"
                value={practicalClasses}
                onChange={(e) => setPracticalClasses(e.target.value)}
                className="subject-input"
                min="1"
              />
            </div>
          ) : (
            <input
              type="number"
              placeholder="Classes per Week"
              value={weeklyClasses}
              onChange={(e) => setWeeklyClasses(e.target.value)}
              className="subject-input"
              min="1"
              disabled={type === ""}
            />
          )}

          <p className="instruction-note">First click boxes and then enter classes</p>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={type === "Theory"}
                onChange={() => handleTypeChange("Theory")}
              />
              <span>Theory</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={type === "Practical"}
                onChange={() => handleTypeChange("Practical")}
              />
              <span>Practical</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={type === "Both"}
                onChange={() => handleTypeChange("Both")}
              />
              <span>Both</span>
            </label>
          </div>

          <div className="button-group">
            <button onClick={handleSubmit}>
              {editingId ? "Update Subject" : "Add Subject"}
            </button>
            {editingId && (
              <button onClick={cancelEdit} className="reset">
                Cancel
              </button>
            )}
            <button onClick={resetBranchSection} className="reset">
              Clear & New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subjects;