'use client';
import React, { useState, useRef } from 'react';
import { useTimetable } from '../../lib/TimeTableContext';
import Popup from '../ui/Popup';
import { BasicToggleButton, ZButton } from '../ui/Buttons';
import Image from 'next/image';
import { generateTT } from '@/lib/utils';
import { fullCourseData } from '@/lib/type';
import { setGlobalCourses } from '@/lib/globalCourses';
import AlertModal from '../ui/AlertModal';
import FacultyPriorityModal from '../ui/FacultyPriorityModal';

type CourseCardProps = {
  selectedCourses: fullCourseData[];
  onDelete: (id: string) => void;
  onUpdate: (updatedCourses: fullCourseData[]) => void;
};

export default function CourseCard({ selectedCourses, onDelete, onUpdate }: CourseCardProps) {
  const { setTimetableData } = useTimetable();

  const draggedItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<fullCourseData | null>(null);
  const [courseToView, setCourseToView] = useState<fullCourseData | null>(null);

  const [allSubjectsMode, setAllSubjectsMode] = useState<'on' | 'off'>('on');

  const [showInfo, setShowInfo] = useState(false);
  const [deleteAllPopupOpen, setDeleteAllPopupOpen] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    color: 'red',
  });

  const handleDeleteAllCourses = () => {
    onUpdate([]);
    setGlobalCourses([]);
    setTimetableData(null);
  };

  const resetDragRefs = () => {
    draggedItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      const updatedCourses = selectedCourses.filter(c => c.id !== courseToDelete.id);
      onDelete(courseToDelete.id);
      onUpdate(updatedCourses);

      setGlobalCourses(updatedCourses);
      if (updatedCourses.length === 0) {
        setTimetableData(null);
      }
    }

    setDeletePopupOpen(false);
    setCourseToDelete(null);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedItemIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = () => {
    const draggedIdx = draggedItemIndex.current;
    const dragOverIdx = dragOverItemIndex.current;

    if (draggedIdx === null || dragOverIdx === null || draggedIdx === dragOverIdx) {
      resetDragRefs();
      return;
    }

    const updatedCourses = [...selectedCourses];
    const [draggedCourse] = updatedCourses.splice(draggedIdx, 1);
    updatedCourses.splice(dragOverIdx, 0, draggedCourse);
    onUpdate(updatedCourses);
    resetDragRefs();
  };

  const moveCourseUp = (index: number) => {
    if (index === 0) return;
    const updatedCourses = [...selectedCourses];
    [updatedCourses[index - 1], updatedCourses[index]] = [
      updatedCourses[index],
      updatedCourses[index - 1],
    ];
    onUpdate(updatedCourses);
  };

  const moveCourseDown = (index: number) => {
    if (index === selectedCourses.length - 1) return;
    const updatedCourses = [...selectedCourses];
    [updatedCourses[index + 1], updatedCourses[index]] = [
      updatedCourses[index],
      updatedCourses[index + 1],
    ];
    onUpdate(updatedCourses);
  };

  const handleGenerate = async () => {
    if (selectedCourses.length === 0) {
      setError('Please add at least one course to generate a timetable.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { result } = generateTT(selectedCourses, allSubjectsMode === 'on');

      if (!result || result.length === 0) {
        setTimetableData([]);
        setAlert({
          open: true,
          message:
            'No timetables were generated because there were clashes in all possible timetables. Please adjust your courses or mode.',
          color: 'red',
        });
      } else {
        setTimetableData(result);
        setGlobalCourses(selectedCourses);
        setAlert({
          open: false,
          message: '',
          color: 'red',
        });

        setTimeout(() => {
          const el = document.getElementById('timetable-view');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch {
      setError('Failed to generate timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <AlertModal
        open={alert.open}
        message={alert.message}
        color={alert.color}
        onClose={() => setAlert({ ...alert, open: false })}
      />

      <AlertModal
        open={showInfo}
        message={
          '**All Subjects Mode - ON**\nGenerated timetables strictly include all of the selected subjects.\n\n**All Subjects Mode - OFF**\nSubjects are prioritized based on their order. If a clash is detected then the subject with lower priority is excluded.\n\n**Course priority**\nCourses higher in the list have higher priority. Use the arrows or drag and drop to reorder them.'
        }
        color="yellow"
        onClose={() => setShowInfo(false)}
      />

      <div
        id="course-card"
        className="h-full flex flex-col bg-ffcs-card font-poppins rounded-[38px] border-3 border-black shadow-[5px_5px_0_0_black] text-black font-medium px-8 pt-7 pb-8"
      >
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-[35px] font-pangolin">Your Courses</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInfo(true)}
              aria-label="About All Subjects Mode and course priority"
              className="bg-ffcs-yellow border-2 border-black rounded-full shadow-hard-xs w-7 h-7 flex items-center justify-center cursor-pointer active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              type="button"
              title="About All Subjects Mode and course priority"
            >
              <Image src="/icons/qmark.svg" width={16} height={16} alt="" draggable={false} />
            </button>
            <span className="text-lg font-semibold">All Subjects Mode</span>
            <BasicToggleButton
              defaultState={allSubjectsMode}
              onToggle={() => setAllSubjectsMode(prev => (prev === 'on' ? 'off' : 'on'))}
            />
            <span className="sr-only">{allSubjectsMode === 'on' ? 'On' : 'Off'}</span>
          </div>
        </div>

        <div
          id="course-list"
          className="mt-6 space-y-4 max-h-[430px] overflow-y-auto pr-2 font-poppins w-full"
        >
          {selectedCourses.map((course, index) => (
            <div
              key={`${course.id}-${index}`}
              className="course-row bg-[#ffffff]/40 rounded-[22px] px-4 py-3 flex flex-row items-center gap-2.5 w-full text-[15px] text-black font-normal cursor-grab active:cursor-grabbing"
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
            >
              <div className="w-6 shrink-0 text-right font-inter">{index + 1}.</div>

              {/* Course Codes */}
              <div className="w-[82px] shrink-0 flex flex-col gap-1">
                <p key={course.courseCode}>{course.courseCode}</p>
                {course.courseType === 'both' && !course.courseCode.endsWith('E') && (
                  <p key={course.courseCodeLab + '_lab'}>{course.courseCodeLab}</p>
                )}
              </div>

              {/* Course name */}
              <div className="flex-1 min-w-0 flex flex-col gap-1 break-words">
                <p key={course.courseName} className="break-words leading-snug">
                  {course.courseName}
                </p>
                {course.courseType === 'both' && !course.courseCode.endsWith('E') && (
                  <p key={course.courseNameLab + '_lab'} className="break-words leading-snug">
                    {course.courseNameLab}
                  </p>
                )}
              </div>

              {/* Slots */}
              <div className="w-[96px] shrink-0 break-words leading-snug">
                {course.courseType == 'lab'
                  ? '(Lab)'
                  : course.courseSlots.map(slot => slot.slotName).join(', ')}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setCourseToView(course)}
                  onDragStart={e => e.stopPropagation()}
                  draggable={false}
                  aria-label={`View faculty priorities for ${course.courseCode}`}
                  aria-haspopup="dialog"
                  className="bg-[#FFFFFF]/50 hover:bg-[#8BD5FF] text-black rounded-lg transition cursor-pointer w-8 h-8 flex items-center justify-center flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  type="button"
                  title="View faculty priorities"
                >
                  <Image src="/icons/eye.svg" width={18} height={18} alt="" draggable={false} />
                </button>
                <button
                  onClick={() => {
                    setCourseToDelete(course);
                    setDeletePopupOpen(true);
                  }}
                  aria-label="Delete Course"
                  className="bg-[#FFFFFF]/50 hover:bg-[#F08585] text-black rounded-lg transition cursor-pointer w-8 h-8 flex items-center justify-center flex-shrink-0"
                  type="button"
                  title="Delete Course"
                >
                  <Image
                    src={'/icons/trash.svg'}
                    width={1}
                    height={1}
                    alt="delete"
                    className="w-[18px] h-[18px]"
                    unselectable="on"
                    draggable={false}
                    priority
                  />
                </button>

                <div className="flex flex-col items-center justify-center bg-[#FFFFFF]/50 rounded-lg overflow-hidden leading-none w-6 h-8 flex-shrink-0">
                  <button
                    onClick={() => moveCourseUp(index)}
                    aria-label="Move Course Up"
                    className="leading-none transition cursor-pointer w-6 h-3.5 flex items-center justify-center"
                    type="button"
                    title="Move Up"
                    disabled={index === 0}
                  >
                    <Image
                      src={index === 0 ? '/icons/chevron_up_gray.svg' : '/icons/chevron_up.svg'}
                      width={1}
                      height={1}
                      alt="up"
                      className="w-3 h-3"
                      unselectable="on"
                      draggable={false}
                      priority
                    />
                  </button>

                  <button
                    onClick={() => moveCourseDown(index)}
                    aria-label="Move Course Down"
                    className="leading-none transition cursor-pointer w-6 h-3.5 flex items-center justify-center"
                    type="button"
                    title="Move Down"
                    disabled={index === selectedCourses.length - 1}
                  >
                    <Image
                      src={
                        index === selectedCourses.length - 1
                          ? '/icons/chevron_down_gray.svg'
                          : '/icons/chevron_down.svg'
                      }
                      width={1}
                      height={1}
                      alt="down"
                      className="w-3 h-3"
                      unselectable="on"
                      draggable={false}
                      priority
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <ZButton
            type="regular"
            text="Remove all"
            image="/icons/trash.svg"
            color="red"
            onClick={() => setDeleteAllPopupOpen(true)}
          />
        </div>

        <div className="flex justify-center mt-auto pt-8">
          <ZButton
            type="large"
            text={loading ? 'Generating...' : 'Generate'}
            image="/icons/thunder.svg"
            color="blue"
            disabled={loading}
            onClick={handleGenerate}
          />
        </div>

        {error && (
          <div className="mt-6 text-center text-[#CC3312] font-semibold" role="alert">
            {error}
          </div>
        )}
      </div>

      {courseToView && (
        <FacultyPriorityModal
          course={courseToView}
          onClose={() => setCourseToView(null)}
          onSave={courseSlots => {
            onUpdate(
              selectedCourses.map(course =>
                course.id === courseToView.id ? { ...course, courseSlots } : course
              )
            );
            setCourseToView(null);
          }}
        />
      )}

      {deletePopupOpen && courseToDelete && (
        <Popup
          type="rem_course"
          dataBody={
            courseToDelete.courseName +
            (courseToDelete.courseNameLab ? ` & ${courseToDelete.courseNameLab}` : '')
          }
          action={confirmDeleteCourse}
          closeLink={() => {
            setDeletePopupOpen(false);
            setCourseToDelete(null);
          }}
        />
      )}

      {deleteAllPopupOpen && (
        <Popup
          type="rem_allcourse"
          dataBody=""
          action={() => {
            handleDeleteAllCourses();
            setDeleteAllPopupOpen(false);
          }}
          closeLink={() => setDeleteAllPopupOpen(false)}
        />
      )}
    </div>
  );
}
