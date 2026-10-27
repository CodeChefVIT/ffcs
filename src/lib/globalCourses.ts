import { fullCourseData } from './type';

let globalCourses: fullCourseData[] = [];

export const setGlobalCourses = (courses: fullCourseData[]) => {
  globalCourses = courses;
};

export const getGlobalCourses = (): fullCourseData[] => {
  if (globalCourses && globalCourses.length > 0) {
    return globalCourses;
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('selectedCourses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          globalCourses = parsed;
          return globalCourses;
        }
      }
    } catch (e) {
      console.error('Failed to read selectedCourses from localStorage in getGlobalCourses:', e);
    }
  }

  return globalCourses;
};
