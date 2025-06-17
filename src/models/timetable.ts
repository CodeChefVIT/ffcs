import mongoose, { Schema, Document } from "mongoose";

export interface ITimetable extends Document {
  title: string;
  owner: string;
  isPublic: boolean;
  shareId: string;
  slots: {
    slot: string;
    courseCode: string;
    courseName: string;
    facultyName: string;
  }[];
}

const timetableSchema = new Schema<ITimetable>(
  {
    title: { type: String, required: true },
    owner: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
    slots: [
      {
        slot: { type: String, required: true },
        courseCode: { type: String, required: true },
        courseName: { type: String, required: true },
        facultyName: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

timetableSchema.index({ owner: 1 });

export default mongoose.models.Timetable ||
  mongoose.model<ITimetable>("Timetable", timetableSchema);
