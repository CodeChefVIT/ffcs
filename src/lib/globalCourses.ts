import { fullCourseData } from "./type";

let globalCourses: fullCourseData[] = [];

export const setGlobalCourses = (courses: fullCourseData[]) => {
  globalCourses = courses;
};

export const getGlobalCourses = (): fullCourseData[] => {
  return globalCourses;
};
