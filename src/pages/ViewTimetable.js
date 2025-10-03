import React from "react";
import TimetableView from "../components/TimetableView";

const ViewTimetable = () => {
  const demoData = { course: "BCA", semester: "5", section: "A" };

  return (
    <div>
      <h1>View Timetable</h1>
      <TimetableView data={demoData} />
    </div>
  );
};

export default ViewTimetable;
