import mongoose from "mongoose";

const courseScheme = new mongoose.Schema({
  courseId: { type: String, required: true },
  courseName: String,
  facultySlots: { type: [String] },
  facultyName: String,
  Venue: String,
});

const Course = mongoose.model("Course", courseScheme);

export default Course;