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
  venue?: string;
  labVenue?: string;
  _id?: string;
};

export type fullCourseData = {
  id: string;
  courseType: 'th' | 'lab' | 'both';
  courseCode: string;
  courseName: string;
  courseCodeLab?: string;
  courseNameLab?: string;
  // The faculty data key (school, programme and batch) and domain the course was added under.
  // Courses saved before these were stored don't have them.
  school?: string;
  domain?: string;
  courseSlots: {
    slotName: string;
    slotFaculties: {
      facultyName: string;
      facultyLabSlot?: string;
      venue?: string;
      labVenues?: Record<string, string>;
    }[];
  }[];
};
