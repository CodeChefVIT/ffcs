import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  userName: string;
  userEmail: string;
  savedCourseData: {
    faculty: string;
    facultySlot: string[];
  }[][];
  favourites: {
    TTdata: {
      faculty: string;
      facultySlot: string[];
    }[];
    courseNames: string[];
  }[];
}

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    savedCourseData: {
      type: [[{ faculty: String, facultySlot: [String] }]],
      default: [],
    },
    favourites: {
      type: [
        {
          TTdata: [{ faculty: String, facultySlot: [String] }],
          courseNames: [String],
        },
      ],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;