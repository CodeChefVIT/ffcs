export type slot = {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
  slotName: string;
};

export type tableFacingSlot = {
  slotName: string;
  showName: boolean;
};
export type IFacultyData = {
  faculty: string;
  facultySlot: string[];
  _id?: string;
  subject?: string;
};