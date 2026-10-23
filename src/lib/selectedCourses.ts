import { fullCourseData, timetableDisplayData } from './type';

// Narrows the full course list down to the slot and faculty picked in one timetable,
// so the PDF report lists only what is on screen.
export function getSelectedCourses(
  courses: fullCourseData[],
  selected: timetableDisplayData[]
): fullCourseData[] {
  return courses
    .map(course => ({
      ...course,
      courseSlots: course.courseSlots
        .map(slot => ({
          ...slot,
          slotFaculties: slot.slotFaculties.flatMap(faculty => {
            const index = selected.findIndex(
              item =>
                item.courseCode === course.courseCode &&
                item.slotName === slot.slotName &&
                item.facultyName === faculty.facultyName
            );
            if (index === -1) return [];
            // A theory+lab course is split into a theory row followed by its lab row
            if (course.courseType === 'both') {
              const lab = selected[index + 1];
              return lab ? [{ ...faculty, facultyLabSlot: lab.slotName }] : [];
            }
            return [faculty];
          }),
        }))
        .filter(slot => slot.slotFaculties.length > 0),
    }))
    .filter(course => course.courseSlots.length > 0);
}
