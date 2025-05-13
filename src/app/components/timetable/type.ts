type IFacultyData = {
  faculty: string;
  facultySlot: string[];
  _id?: string;
};

type slot = {
  rowStart: number;
  rowEnd: number;
  col: number;
};
type ITimeTable = slot[];
