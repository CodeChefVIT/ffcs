export type slot = {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
  slotName: string;
};

export type timetableDisplayData = {
  courseCode: string;
  courseName: string;
  slotName: string;
  facultyName: string;
  _id?: string;
};

export type fullCourseData = {
  id: string;
  courseType: "th" | "lab" | "both";
  courseCode: string;     // if th or lab
  courseName: string;     // if th or lab
  courseCodeLab?: string;      // if both
  courseNameLab?: string;      // if both
  courseSlots: {
    slotName: string;
    slotFaculties: {
      facultyName: string;
      facultyLabSlot?: string; // if both
    }[];
  }[];
}
