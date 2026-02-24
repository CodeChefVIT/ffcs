import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const timetableSchema = new Schema(
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
        facultyName: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

timetableSchema.index({ owner: 1 });

export type ITimetable = InferSchemaType<typeof timetableSchema>;

const Timetable: Model<ITimetable> =
  mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', timetableSchema);

export default Timetable;
