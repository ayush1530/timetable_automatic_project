import React, { useState } from "react";
import TimetableForm from "../components/TimetableForm";
import TimetableView from "../components/TimetableView";

const GenerateTimetable = () => {
  const [timetableData, setTimetableData] = useState(null);

  const handleGenerate = (formData) => {
    setTimetableData(formData); // future me API se data fetch karenge
  };

  return (
    <div>
      <TimetableForm onGenerate={handleGenerate} />
      <TimetableView data={timetableData} />
    </div>
  );
};

export default GenerateTimetable;
