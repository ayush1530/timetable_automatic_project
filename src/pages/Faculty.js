import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Faculty.css";

function Faculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch faculty from backend on mount
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/faculty");
        setFacultyList(response.data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setFacultyList([]);
      }
    };
    fetchFaculty();
  }, []);

  const branchList = [...new Set(facultyList.map((f) => f.branch))];

  const startEdit = (faculty) => {
    setFacultyName(faculty.name);
    setFacultyEmail(faculty.email);
    setBranch(faculty.branch);
    setEditingId(faculty.id);
  };

  const deleteFaculty = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        await axios.delete(`http://localhost:5000/api/faculty/${id}`);
        const response = await axios.get("http://localhost:5000/api/faculty");
        setFacultyList(response.data);
        if (editingId === id) {
          cancelEdit();
        }
      } catch (error) {
        console.error("Error deleting faculty:", error);
        alert("Error deleting faculty!");
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFacultyName("");
    setFacultyEmail("");
    setBranch("");
  };

  const handleSubmit = async () => {
    if (!facultyName || !facultyEmail || !branch) {
      return alert("Please fill all fields");
    }

    try {
      if (editingId !== null) {
        // Update existing faculty
        await axios.put(`http://localhost:5000/api/faculty/${editingId}`, {
          name: facultyName,
          email: facultyEmail,
          branch,
        });
      } else {
        // Add new faculty
        await axios.post("http://localhost:5000/api/faculty", {
          name: facultyName,
          email: facultyEmail,
          branch,
        });
      }
      const response = await axios.get("http://localhost:5000/api/faculty");
      setFacultyList(response.data);
      setFacultyName("");
      setFacultyEmail("");
      setEditingId(null);
      document.querySelector('input[placeholder="Faculty Name"]').focus();
    } catch (error) {
      console.error("Error saving faculty:", error);
      alert("Error saving faculty!");
    }
  };

  const clearForm = () => {
    setFacultyName("");
    setFacultyEmail("");
    setBranch("");
    setEditingId(null);
    document.querySelector('input[placeholder="Faculty Name"]').focus();
  };

  return (
    <div className="page faculty-page">
      <h2>Add Faculty</h2>

      <div className="faculty-container">
        {/* Left side: Form */}
        <div className="faculty-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Faculty Name"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              className="form-input"
              autoFocus
            />
            <input
              type="email"
              placeholder="Faculty Email"
              value={facultyEmail}
              onChange={(e) => setFacultyEmail(e.target.value)}
              className="form-input"
            />
            <div className="combo-input">
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="custom-select small"
              >
                <option value="">Select Department</option>
                {branchList.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or type new Department"
                onChange={(e) => setBranch(e.target.value)}
                value={branch}
                className="combo-input-field"
              />
            </div>
            <div className="button-group">
              <button onClick={handleSubmit} className="add-btn">
                {editingId !== null ? "Update Faculty" : "Add Faculty"}
              </button>
              {editingId !== null && (
                <button onClick={cancelEdit} className="cancel-btn">
                  Cancel
                </button>
              )}
              <button onClick={clearForm} className="clear-btn">
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Faculty List */}
        <div className="faculty-list-section">
          <h3>Faculty List (Total: {facultyList.length})</h3>
          {facultyList.length > 0 ? (
            <ul className="faculty-list">
              {facultyList.map((f) => (
                <li key={f.id} className="faculty-item">
                  <span>
                    <strong>{f.name}</strong> - {f.email} ({f.branch})
                  </span>
                  <div className="action-buttons">
                    <button
                      onClick={() => startEdit(f)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFaculty(f.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No faculty added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Faculty;