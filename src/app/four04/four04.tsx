import CourseCard from "@/components/ui/CourseCard";
import ViewTimetablePopup from "@/components/ui/popups/view_timetable_popup";
import { useState } from "react";

export default function View() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      404 Desktop
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setShowPopup(true)}
      >
        View Timetable
      </button>
      {showPopup && (
        <ViewTimetablePopup onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
