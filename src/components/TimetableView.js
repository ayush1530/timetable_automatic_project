import React from "react";
import "./Timetable.css";

const TimetableView = ({ data }) => {
  if (!data) {
    return <p>No timetable generated yet.</p>;
  }

  return (
    <div className="timetable">
      <h2>{data.course} - Sem {data.semester} ({data.section})</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>9:00 - 10:00</th>
            <th>10:00 - 11:00</th>
            <th>11:00 - 12:00</th>
            <th>12:00 - 1:00</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mon</td>
            <td>Maths</td>
            <td>DBMS</td>
            <td>Break</td>
            <td>OS</td>
          </tr>
          <tr>
            <td>Tue</td>
            <td>Python</td>
            <td>DBMS</td>
            <td>Break</td>
            <td>CN</td>
          </tr>
          {/* Baaki days add kar sakte ho */}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableView;
