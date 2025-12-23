import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GenerateTimetable.css";

function GenerateTimetable() {
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [sem, setSem] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectData, setSubjectData] = useState({});
  const [facultyData, setFacultyData] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [timetableData, setTimetableData] = useState({});
  const [selectedKey, setSelectedKey] = useState("");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subRes = await axios.get("http://localhost:5000/api/subjects");
        setSubjects(subRes.data);

        const facRes = await axios.get("http://localhost:5000/api/faculty");
        setFacultyData(facRes.data);

        const ttRes = await axios.get("http://localhost:5000/api/timetables");
        setTimetables(ttRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const grouped = {};
    subjects.forEach((sub) => {
      const key = `${sub.branch} - ${sub.section} - ${sub.sem}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(sub.subject_name);
    });
    setSubjectData(grouped);
  }, [subjects]);

  useEffect(() => {
    const groupedTT = {};
    timetables.forEach((tt) => {
      const key = `${tt.branch} - ${tt.section} - ${tt.sem}`;
      groupedTT[key] = { ...tt.timetable, branch: tt.branch };
    });
    setTimetableData(groupedTT);
  }, [timetables]);

  useEffect(() => {
    setSection("");
    setSem("");
    setSelectedKey("");
  }, [branch]);

  useEffect(() => {
    setSem("");
    setSelectedKey("");
  }, [section]);

  useEffect(() => {
    if (branch && section && sem) {
      const key = `${branch} - ${section} - ${sem}`;
      setSelectedKey(key);
    } else {
      setSelectedKey("");
    }
  }, [branch, section, sem]);

  const branchList = [...new Set(subjects.map((s) => s.branch))];
  const currentSections = branch
    ? [...new Set(subjects.filter((s) => s.branch === branch).map((s) => s.section))]
    : [];
  const currentSems =
    branch && section
      ? [
          ...new Set(
            subjects.filter((s) => s.branch === branch && s.section === section).map((s) => s.sem)
          ),
        ]
      : [];

  const filteredFaculties = facultyData.filter((faculty) => faculty.branch === "SOET");

  const generateTimetable = async () => {
    if (!selectedKey || !subjectData[selectedKey] || subjectData[selectedKey].length === 0) {
      alert("No subjects available for this selection!");
      return;
    }

    if (filteredFaculties.length === 0) {
      alert("No faculty available for the SOET department! Add faculty first.");
      return;
    }

    const subjectsList = subjectData[selectedKey];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const periodsPerDay = 6;

    const timetable = days.map((_, dayIndex) =>
      Array.from({ length: periodsPerDay }, (_, periodIndex) => {
        const subjectIndex = (dayIndex * periodsPerDay + periodIndex) % subjectsList.length;
        const subject = subjectsList[subjectIndex];
        const randomFaculty =
          filteredFaculties[Math.floor(Math.random() * filteredFaculties.length)];
        return { subject, faculty: randomFaculty.name };
      })
    );

    const timetableObj = { days, timetable };

    try {
      await axios.post("http://localhost:5000/api/timetables", {
        branch,
        section,
        sem,
        timetable: timetableObj,
      });
      const ttRes = await axios.get("http://localhost:5000/api/timetables");
      setTimetables(ttRes.data);
    } catch (err) {
      console.error("Error saving timetable:", err);
      alert("Error generating/saving timetable!");
    }
  };

  const currentSubjects = selectedKey && subjectData[selectedKey] ? subjectData[selectedKey] : [];
  const currentTimetable =
    selectedKey && timetableData[selectedKey] ? timetableData[selectedKey] : null;

  return (
    <div className="timetable-page">
      <h2 className="page-title">🕒 Generate Time Table</h2>

      {/* Top Filters */}
      <div className="dropdowns-container">
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="dropdown">
          <option value="">Select Branch</option>
          {branchList.map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="dropdown"
          disabled={!branch}
        >
          <option value="">Select Section</option>
          {currentSections.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sem}
          onChange={(e) => setSem(e.target.value)}
          className="dropdown"
          disabled={!branch || !section}
        >
          <option value="">Select Sem</option>
          {currentSems.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Faculty List */}
        <div className="side-box">
          <h3>👨‍🏫 Faculty (SOET)</h3>
          {filteredFaculties.length > 0 ? (
            <ul>
              {filteredFaculties.map((f, i) => (
                <li key={i}>
                  <strong>{f.name}</strong>
                  <br />
                  <small>{f.email}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No faculty found</p>
          )}
        </div>

        {/* Subjects */}
        <div className="middle-box">
          <h3>📘 Subjects</h3>
          {selectedKey && currentSubjects.length > 0 ? (
            <ul>
              {currentSubjects.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p>Select branch, section, and sem</p>
          )}

          {selectedKey && currentSubjects.length > 0 && (
            <button onClick={generateTimetable} className="generate-btn">
              {currentTimetable ? "🔁 Regenerate Timetable" : "⚙️ Generate Timetable"}
            </button>
          )}
        </div>

        {/* Timetable */}
        <div className="timetable-box">
          <h3>🗓️ Generated Timetable</h3>
          {currentTimetable ? (
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  {Array.from({ length: currentTimetable.timetable[0].length }, (_, i) => (
                    <th key={i}>Period {i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTimetable.days.map((day, d) => (
                  <tr key={d}>
                    <td>{day}</td>
                    {currentTimetable.timetable[d].map((p, i) => (
                      <td key={i}>
                        <strong>{p.subject}</strong>
                        <br />
                        <small>{p.faculty}</small>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No timetable generated</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateTimetable;
