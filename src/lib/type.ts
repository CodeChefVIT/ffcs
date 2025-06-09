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

export type facultyData = {
  faculty: string;
  facultySlot: string[];
  subject?: string;
  _id?: string;
};