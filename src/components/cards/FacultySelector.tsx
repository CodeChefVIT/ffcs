'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ZButton } from '../ui/Buttons';

import { data as bundledData } from '@/data/faculty';
import { fullCourseData } from '@/lib/type';
import AlertModal from '../ui/AlertModal';
import { course_type_map } from '@/lib/course_codes_map';
import ComboBox, { MultiSelector } from '@/components/ui/ComboBox';

type SubjectEntry = {
  slot: string;
  faculty: string;
  venue?: string;
};

function generateCourseSlotsSingle({
  subjectData,
  selectedFaculties,
  selectedSlot,
  courseType,
}: {
  subjectData: SubjectEntry[];
  selectedFaculties: string[];
  selectedSlot: string;
  courseType: 'th' | 'lab';
}) {
  if (courseType === 'th') {
    return [
      {
        slotName: selectedSlot,
        slotFaculties: selectedFaculties.map(facultyName => {
          // try to get venue for this faculty and slot from subjectData
          const entry = subjectData.find(
            (e: SubjectEntry) => e.faculty === facultyName && e.slot === selectedSlot
          );
          return {
            facultyName,
            ...(entry && entry.venue ? { venue: entry.venue } : {}),
          };
        }),
      },
    ];
  }
  if (courseType === 'lab') {
    const labSlots = [
      ...new Set(
        subjectData
          .filter((entry: SubjectEntry) => selectedFaculties.includes(entry.faculty))
          .map((entry: SubjectEntry) => entry.slot)
      ),
    ];

    return labSlots.map(slotName => ({
      slotName,
      slotFaculties: subjectData
        .filter(
          (entry: SubjectEntry) =>
            entry.slot === slotName && selectedFaculties.includes(entry.faculty)
        )
        .map((entry: SubjectEntry) => ({
          facultyName: entry.faculty,
          ...(entry.venue ? { venue: entry.venue } : {}),
        })),
    }));
  }

  return [];
}

type FacultyData = {
  [school: string]: {
    [domain: string]: {
      [subject: string]: SubjectEntry[];
    };
  };
};

function generateCourseSlotsLabOnly({
  subjectData,
  selectedFaculties,
  labShift,
}: {
  subjectData: SubjectEntry[];
  selectedFaculties: string[];
  labShift: 'morning' | 'evening';
}) {
  const isMorningSlot = (slot: string) => {
    const parts = slot.split('+').map(s => parseInt(s.replace('L', ''), 10));
    return parts.every(num => num <= 30); // Define morning range
  };

  const isEveningSlot = (slot: string) => {
    const parts = slot.split('+').map(s => parseInt(s.replace('L', ''), 10));
    return parts.every(num => num > 30); // Define evening range
  };

  const isSlotInShift = labShift === 'morning' ? isMorningSlot : isEveningSlot;

  const labSlots = [
    ...new Set(
      subjectData
        .filter(entry => selectedFaculties.includes(entry.faculty) && isSlotInShift(entry.slot))
        .map(entry => entry.slot)
    ),
  ];

  return labSlots.map(slotName => ({
    slotName,
    slotFaculties: subjectData
      .filter(entry => entry.slot === slotName && selectedFaculties.includes(entry.faculty))
      .map(entry => ({
        facultyName: entry.faculty,
        ...(entry.venue ? { venue: entry.venue } : {}),
      })),
  }));
}

function generateCourseSlotsBoth({
  data,
  selectedSchool,
  selectedDomain,
  selectedSubject,
  selectedSlot,
  selectedFaculties,
  courseCodeType,
}: {
  data: FacultyData;
  selectedSchool: string;
  selectedDomain: string;
  selectedSubject: string;
  selectedSlot: string;
  selectedFaculties: string[];
  courseCodeType: 'L' | 'P' | 'E' | undefined;
}) {
  const [courseCode] = selectedSubject.split(' - ');
  const baseCode = courseCode.slice(0, -1);

  let labData: SubjectEntry[] = [];

  if (courseCodeType === 'E') {
    labData = data[selectedSchool][selectedDomain][selectedSubject];
  } else {
    const labEntryKey = Object.keys(data[selectedSchool][selectedDomain]).find(key => {
      const code = key.split(' - ')[0];
      const type = getCourseType(code, data[selectedSchool][selectedDomain][key]);
      return code.slice(0, -1) === baseCode && (type === 'P' || type === 'E');
    });
    if (labEntryKey) {
      labData = data[selectedSchool][selectedDomain][labEntryKey];
    }
  }

  const isMorningTheory = selectedSlot.includes('1');
  const isEveningTheory = selectedSlot.includes('2');

  const isValidLabSlot = (slot: string): boolean => {
    const parts = slot.split('+').map(s => parseInt(s.replace('L', ''), 10));
    if (parts.some(isNaN)) return false;

    const allMorning = parts.every(num => num <= 30);
    const allEvening = parts.every(num => num >= 31);

    if (isMorningTheory) return allEvening;
    if (isEveningTheory) return allMorning;

    return false;
  };

  const slotFaculties = selectedFaculties.map(facultyName => {
    const labSlots = labData
      .filter(
        entry =>
          entry.faculty === facultyName && entry.slot.startsWith('L') && isValidLabSlot(entry.slot)
      )
      .map(entry => entry.slot);

    const theoryEntries = data[selectedSchool][selectedDomain][selectedSubject];
    const theoryEntry = theoryEntries.find(
      entry => entry.faculty === facultyName && entry.slot === selectedSlot
    );
    const venue = theoryEntry?.venue?.trim();

    const labVenues: Record<string, string> = {};

    for (const entry of labData) {
      if (entry.faculty === facultyName && labSlots.includes(entry.slot) && entry.venue?.trim()) {
        labVenues[entry.slot] = entry.venue.trim();
      }
    }

    return {
      facultyName,
      facultyLabSlot: labSlots.length > 0 ? labSlots.join(', ') : courseCode,
      ...(venue ? { venue } : {}),
      labVenues,
    };
  });

  return [
    {
      slotName: selectedSlot,
      slotFaculties,
    },
  ];
}

const visibleSubjects = (domainData: Record<string, SubjectEntry[]>) => {
  const allSubjects = Object.keys(domainData);
  return allSubjects.filter(subject => {
    const code = subject.split(' - ')[0];
    const type = getCourseType(code, domainData[subject]);
    if (type === 'P') {
      const theoryCode = code.slice(0, -1) + 'L';
      return !allSubjects.some(s => s.startsWith(theoryCode));
    }
    return true;
  });
};

// Subject options carry their domain so a search across domains can fill both fields.
const SUBJECT_KEY_SEPARATOR = '||';
const toSubjectKey = (domain: string, subject: string) =>
  `${domain}${SUBJECT_KEY_SEPARATOR}${subject}`;
const fromSubjectKey = (key: string) => key.split(SUBJECT_KEY_SEPARATOR) as [string, string];

const prettifyDomain = (domain: string) => {
  return domain
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .trim();
};

const getCourseType = (
  courseCode: string,
  entries?: SubjectEntry[]
): 'L' | 'P' | 'E' | undefined => {
  if (entries?.length && entries.every(entry => entry.slot === 'NIL')) return 'L';
  if (course_type_map[courseCode]) {
    return course_type_map[courseCode] as 'L' | 'P' | 'E';
  }
  const lastChar = courseCode.slice(-1).toUpperCase();
  if (['L', 'P', 'E'].includes(lastChar)) {
    return lastChar as 'L' | 'P' | 'E';
  }
  if (entries?.length) {
    const hasLab = entries.some(entry => /^L\d/.test(entry.slot));
    const hasTheory = entries.some(entry => !/^L\d/.test(entry.slot));
    return hasLab ? (hasTheory ? 'E' : 'P') : 'L';
  }
  return undefined;
};

type ShiftKey = 'morning' | 'evening';
export default function FacultySelector({
  onConfirm,
  dataOverride: data = bundledData,
  storageKey = 'selectedCourses',
  selectedSchool: chosenSchool,
  courses = [],
  editingCourse = null,
  onSaveEdit,
  onCancelEdit,
}: {
  onConfirm: (course: fullCourseData) => void;
  dataOverride?: FacultyData;
  storageKey?: string;
  selectedSchool: string;
  // The courses already added, used to re-tick a course's faculties.
  courses?: fullCourseData[];
  // The course whose pencil was pressed. The box fills with it and Confirm saves over it.
  editingCourse?: fullCourseData | null;
  onSaveEdit?: (course: fullCourseData) => void;
  onCancelEdit?: () => void;
}) {
  // While editing, the box uses the school the course was added under, not the navbar's.
  const [editSchool, setEditSchool] = useState<string | null>(null);
  const selectedSchool = editingCourse && editSchool ? editSchool : chosenSchool;
  const [selectedLabShift, setSelectedLabShift] = useState<'' | ShiftKey>('');
  const [labShiftOptions, setLabShiftOptions] = useState<Record<ShiftKey, string[]>>({
    morning: [],
    evening: [],
  });
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [priorityList, setPriorityList] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [faculties, setFaculties] = useState<string[]>([]);
  const [popup, setPopup] = useState({ showPopup: false, message: '' });

  const LOCAL_STORAGE_KEY = storageKey;

  const handleReset = () => {
    setSelectedDomain('');
    setSelectedSubject('');
    setSelectedSlots([]);
    setSubjects([]);
    setSlots([]);
    setFaculties([]);
    setSelectedFaculties([]);
    setPriorityList([]);
    setSelectedLabShift('');
    setLabShiftOptions({ morning: [], evening: [] });
  };

  // Builds the course from the box, or shows what's missing and returns null.
  const buildCourse = (): fullCourseData | null => {
    if (!selectedDomain) {
      setPopup({ showPopup: true, message: 'Please select a domain.' });
      return null;
    }

    if (!selectedSubject) {
      setPopup({ showPopup: true, message: 'Please select a subject.' });
      return null;
    }
    const courseCode = selectedSubject.split(' - ')[0];
    const courseCodeType = getCourseType(
      courseCode,
      data[selectedSchool]?.[selectedDomain]?.[selectedSubject]
    );

    if (!selectedLabShift && courseCodeType === 'P' && !courseCode.startsWith('BSTS')) {
      setPopup({ showPopup: true, message: 'Please select a lab slot.' });
      return null;
    }
    if (
      selectedSlots.length === 0 &&
      (courseCodeType === 'L' || courseCodeType === 'E' || courseCode.startsWith('BSTS'))
    ) {
      setPopup({ showPopup: true, message: 'Please select a theory slot.' });
      return null;
    }

    if (priorityList.length === 0) {
      setPopup({
        showPopup: true,
        message: 'Please select at least one faculty.',
      });
      return null;
    }

    const id = selectedSubject;

    const labSubject = Object.keys(data[selectedSchool][selectedDomain]).filter(subject => {
      const subjectCode = subject.split(' - ')[0];
      const subjectType = getCourseType(subjectCode, data[selectedSchool][selectedDomain][subject]);
      return (
        subjectCode.slice(0, -1) === courseCode.slice(0, -1) &&
        (subjectType === 'P' || subjectType === 'E') &&
        subjectCode !== courseCode &&
        !courseCode.startsWith('BSTS')
      );
    });

    const courseType: 'both' | 'th' | 'lab' =
      labSubject.length === 1 && courseCodeType !== 'E'
        ? 'both'
        : courseCodeType === 'P' && !courseCode.startsWith('BSTS')
          ? 'lab'
          : 'th';

    const courseName = selectedSubject.split(' - ')[1];

    let courseCodeLab;
    let courseNameLab;
    let courseSlots;
    if (courseCodeType === 'E') {
      courseCodeLab = '';
      courseNameLab = '';
    } else {
      courseCodeLab = labSubject.length == 1 ? labSubject[0].split(' - ')[0] : '';
      courseNameLab = labSubject.length == 1 ? labSubject[0].split(' - ')[1] : '';
    }
    if (selectedLabShift) {
      courseSlots = generateCourseSlotsLabOnly({
        subjectData: data[selectedSchool][selectedDomain][selectedSubject],
        selectedFaculties: priorityList,
        labShift: selectedLabShift,
      });
    } else {
      // One course slot per picked theory slot, each with the picked faculties who teach in it.
      const subjectData = data[selectedSchool][selectedDomain][selectedSubject];
      const facultiesInSlot = (slot: string) =>
        priorityList.filter(name =>
          subjectData.some(
            entry =>
              entry.slot === slot &&
              (courseCode.startsWith('BSTS')
                ? `${entry.faculty} (${entry.venue})`
                : entry.faculty) === name
          )
        );
      const emptySlot = selectedSlots.find(slot => facultiesInSlot(slot).length === 0);
      if (emptySlot) {
        setPopup({
          showPopup: true,
          message: `Please select a faculty for slot ${emptySlot}.`,
        });
        return null;
      }
      if (courseType == 'both' || courseCodeType === 'E') {
        courseSlots = selectedSlots.flatMap(slot =>
          generateCourseSlotsBoth({
            data,
            selectedSchool,
            selectedDomain,
            selectedSubject,
            selectedSlot: slot,
            selectedFaculties: facultiesInSlot(slot),
            courseCodeType,
          })
        );
      } else if (courseType == 'th') {
        courseSlots = selectedSlots.flatMap(slot =>
          generateCourseSlotsSingle({
            subjectData,
            selectedFaculties: facultiesInSlot(slot),
            selectedSlot: slot,
            courseType: 'th',
          })
        );
      } else {
        courseSlots = generateCourseSlotsSingle({
          subjectData: data[selectedSchool][selectedDomain][selectedSubject],
          selectedFaculties: priorityList,
          selectedSlot: '',
          courseType: 'lab',
        });
      }
    }
    return {
      id,
      courseType: courseCodeType === 'E' ? 'both' : courseType,
      courseCode,
      courseName,
      ...(labSubject.length == 1 &&
        courseCodeType !== 'E' && {
          courseCodeLab,
          courseNameLab,
        }),
      school: selectedSchool,
      domain: selectedDomain,
      courseSlots: courseSlots!,
    };
  };

  const handleConfirm = () => {
    const courseData = buildCourse();
    if (!courseData) return;
    const id = courseData.id;

    if (editingCourse) {
      // Saving replaces the course as it is in the box, in the same place in Your Courses.
      setPopup({ showPopup: true, message: `Saved changes to ${courseData.courseCode}` });
      onSaveEdit?.(courseData);
      return;
    }
    setPopup({ showPopup: true, message: 'Successfully added course' });

    try {
      if (typeof window !== 'undefined') {
        const savedCoursesJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
        const savedCourses: fullCourseData[] = savedCoursesJSON ? JSON.parse(savedCoursesJSON) : [];

        const exists = savedCourses.some(c => c.id === id);
        const newCourses = exists
          ? savedCourses.map(course => (course.id === id ? courseData : course))
          : [...savedCourses, courseData];

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCourses));
      }
    } catch (error) {
      console.warn('Failed to update localStorage for selectedCourses', error);
    }
    onConfirm(courseData);
  };

  const toggleFaculty = (name: string) => {
    setSelectedFaculties(prev => {
      const updated = prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name];

      setPriorityList(prevPriority => {
        const updatedPriority = updated.map(faculty =>
          prevPriority.includes(faculty) ? faculty : faculty
        );
        return updatedPriority;
      });

      return updated;
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...priorityList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setPriorityList(newList);
  };

  const moveDown = (index: number) => {
    if (index === priorityList.length - 1) return;
    const newList = [...priorityList];
    [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    setPriorityList(newList);
  };

  useEffect(() => {
    const schoolData = data[selectedSchool];
    if (!schoolData) return;

    setDomains(Object.keys(schoolData));

    if (selectedDomain) {
      const domainData = schoolData[selectedDomain];
      if (!domainData) return;

      setSubjects(visibleSubjects(domainData));

      if (selectedSubject) {
        const subjectData = domainData[selectedSubject];
        if (!subjectData) return;
        const courseCode = selectedSubject.split(' - ')[0];
        const courseType = getCourseType(courseCode, subjectData);

        if (courseType === 'P' && !courseCode.startsWith('BSTS')) {
          const allLabSlots = [...new Set(subjectData.map(entry => entry.slot))];

          const morningLabSlots = allLabSlots.filter(slot => {
            const parts = slot.split('+').map(s => parseInt(s.replace('L', ''), 10));
            return parts.every(num => num <= 30);
          });

          const eveningLabSlots = allLabSlots.filter(slot => {
            const parts = slot.split('+').map(s => parseInt(s.replace('L', ''), 10));
            return parts.every(num => num >= 31);
          });
          setLabShiftOptions({
            morning: morningLabSlots,
            evening: eveningLabSlots,
          });

          if (selectedLabShift) {
            const slotsForShift =
              selectedLabShift === 'morning' ? morningLabSlots : eveningLabSlots;
            setSlots(slotsForShift);
          }

          return;
        } else {
          const rawSlots = subjectData.map(entry => entry.slot);
          const filteredSlots = rawSlots.filter(slot => !slot.startsWith('L'));
          const uniqueSlots = [...new Set(filteredSlots)];
          setSlots(uniqueSlots);
        }

        // For lab courses the lab shift effect below owns the faculty list.
        if (selectedLabShift) return;

        const facultiesForSlots = [
          ...new Set(
            subjectData
              .filter(entry => selectedSlots.includes(entry.slot))
              .map(entry =>
                courseCode.startsWith('BSTS') ? `${entry.faculty} (${entry.venue})` : entry.faculty
              )
          ),
        ];

        // Adding or removing a slot keeps the picks that are still on offer.
        setSelectedFaculties(prev => prev.filter(f => facultiesForSlots.includes(f)));
        setPriorityList(prev => prev.filter(f => facultiesForSlots.includes(f)));
        setFaculties(facultiesForSlots);
      }
    }
  }, [data, selectedSchool, selectedDomain, selectedSubject, selectedSlots, selectedLabShift]);

  useEffect(() => {
    if (!selectedSubject || !selectedLabShift) return;

    const labSlots = labShiftOptions[selectedLabShift];
    if (!labSlots || labSlots.length === 0) return;

    const subjectData = data[selectedSchool]?.[selectedDomain]?.[selectedSubject];
    if (!subjectData) return;

    const facultiesInSelectedShift = subjectData
      .filter(entry => labSlots.includes(entry.slot))
      .map(entry => entry.faculty);

    setFaculties([...new Set(facultiesInSelectedShift)]);
  }, [data, selectedLabShift, labShiftOptions, selectedSubject, selectedDomain, selectedSchool]);

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    setSelectedSubject('');
    setSelectedSlots([]);
    setSubjects([]);
    setSlots([]);
    setFaculties([]);
    setSelectedFaculties([]);
    setPriorityList([]);
    setSelectedLabShift('');
    setLabShiftOptions({ morning: [], evening: [] });
  };

  const handleSubjectPick = (key: string) => {
    if (!key) return handleSubjectChange('');
    const [domain, subject] = fromSubjectKey(key);
    if (domain !== selectedDomain) handleDomainChange(domain);
    handleSubjectChange(subject);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedSlots([]);
    setFaculties([]);
    setSelectedFaculties([]);
    setPriorityList([]);
    setSelectedLabShift('');
    setLabShiftOptions({ morning: [], evening: [] });
  };

  const handleSlotChange = (slots: string[]) => {
    setSelectedSlots(slots);
    setSelectedLabShift('');
    setLabShiftOptions({ morning: [], evening: [] });
  };

  // Saved picks are restored when the first slot is picked, so an unticked faculty stays unticked.
  const previousSlots = useRef<string[]>([]);

  useEffect(() => {
    const isFirstSlot = previousSlots.current.length === 0;
    previousSlots.current = selectedSlots;
    if (!selectedSubject || (selectedSlots.length === 0 && !selectedLabShift)) return;

    const course = courses.find(c => c.id === selectedSubject);
    if (!course) return;

    const matchingSlots = course.courseSlots.filter(slot => {
      if (selectedLabShift) {
        const shiftSlots = labShiftOptions[selectedLabShift] || [];
        return shiftSlots.includes(slot.slotName);
      }
      return isFirstSlot && selectedSlots.includes(slot.slotName);
    });
    if (matchingSlots.length > 0) {
      const allFaculties = matchingSlots.flatMap(slot =>
        slot.slotFaculties.map(f => f.facultyName)
      );

      const uniqueFaculties = Array.from(new Set(allFaculties));

      setSelectedFaculties(prev => Array.from(new Set([...prev, ...uniqueFaculties])));
      setPriorityList(prev => Array.from(new Set([...prev, ...uniqueFaculties])));
    }
  }, [courses, selectedSubject, selectedSlots, selectedLabShift, labShiftOptions]);

  // A pressed pencil fills the box with its course. Saving or cancelling the edit clears it.
  const wasEditing = useRef(false);
  useEffect(() => {
    if (!editingCourse) {
      if (wasEditing.current) {
        wasEditing.current = false;
        setEditSchool(null);
        setSelectedDomain('');
        setSelectedSubject('');
        setSelectedSlots([]);
        setSubjects([]);
        setSlots([]);
        setFaculties([]);
        setSelectedFaculties([]);
        setPriorityList([]);
        setSelectedLabShift('');
        setLabShiftOptions({ morning: [], evening: [] });
      }
      return;
    }
    wasEditing.current = true;

    // Use where the course was added. Courses saved before that was stored are looked up in
    // the navbar's school first, then in every school.
    const hasSubject = (school: string, domain: string) =>
      !!data[school]?.[domain]?.[editingCourse.id];
    let origin: { school: string; domain: string } | null = null;
    if (
      editingCourse.school &&
      editingCourse.domain &&
      hasSubject(editingCourse.school, editingCourse.domain)
    ) {
      origin = { school: editingCourse.school, domain: editingCourse.domain };
    } else {
      const schools = [chosenSchool, ...Object.keys(data).filter(s => s !== chosenSchool)];
      for (const school of schools) {
        const domain = Object.keys(data[school] ?? {}).find(d => hasSubject(school, d));
        if (domain) {
          origin = { school, domain };
          break;
        }
      }
    }
    if (!origin) {
      setPopup({
        showPopup: true,
        message: `${editingCourse.courseCode} isn't in the faculty data any more, so it can't be edited.`,
      });
      onCancelEdit?.();
      return;
    }

    // Faculties keep their priority order: each slot lists them in the order they were ranked.
    const facultyNames = [
      ...new Set(
        editingCourse.courseSlots.flatMap(slot => slot.slotFaculties.map(f => f.facultyName))
      ),
    ];
    setEditSchool(origin.school);
    setSelectedDomain(origin.domain);
    setSelectedSubject(editingCourse.id);
    if (editingCourse.courseType === 'lab') {
      const firstLab = parseInt(
        editingCourse.courseSlots[0]?.slotName.split('+')[0].replace('L', '') ?? '',
        10
      );
      setSelectedSlots([]);
      setSelectedLabShift(firstLab <= 30 ? 'morning' : 'evening');
    } else {
      setSelectedSlots(editingCourse.courseSlots.map(slot => slot.slotName));
      setSelectedLabShift('');
    }
    setSelectedFaculties(facultyNames);
    setPriorityList(facultyNames);
  }, [editingCourse, data, chosenSchool, onCancelEdit]);

  const [tooltipFacultyIndex, setTooltipFacultyIndex] = React.useState<number | null>(null);

  const schoolSubjectKeys = React.useMemo(
    () =>
      Object.entries(data[selectedSchool] ?? {}).flatMap(([domain, domainData]) =>
        visibleSubjects(domainData).map(subject => toSubjectKey(domain, subject))
      ),
    [data, selectedSchool]
  );

  return (
    <div className="h-full">
      <div className="relative h-full">
        <div className="absolute -top-8 left-8 z-10 flex items-end gap-3 font-poppins">
          {editingCourse && (
            <div className="flex min-w-[276px] items-center justify-center rounded-2xl border-2 border-black bg-ffcs-yellow px-[22px] py-2 text-lg font-semibold shadow-[3px_3px_0_0_black]">
              Editing {editingCourse.courseCode}
            </div>
          )}
          {selectedSchool === 'My VTOP' && (
            <div className="flex h-10 items-center rounded-2xl border-3 border-black bg-ffcs-violet px-5 text-base font-semibold shadow-hard">
              My VTOP
            </div>
          )}
        </div>
        <div className="font-poppins relative h-full flex flex-col bg-ffcs-card rounded-[38px] border-3 border-black shadow-[5px_5px_0_0_black] overflow-hidden">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 px-9 pt-7 pb-7">
            <ComboBox
              label="Select domain"
              value={selectedDomain}
              options={domains}
              onChange={handleDomainChange}
              renderOption={prettifyDomain}
              disabled={!!editingCourse}
            />
            {getCourseType(
              selectedSubject.split(' - ')[0],
              data[selectedSchool]?.[selectedDomain]?.[selectedSubject]
            ) === 'P' && !selectedSubject.split(' - ')[0].startsWith('BSTS') ? (
              <ComboBox
                key={`lab-${selectedDomain}-${selectedSubject}`}
                label="Select lab shift"
                value={selectedLabShift}
                onChange={e => {
                  if (e === 'morning' || e === 'evening') {
                    setSelectedLabShift(e);
                  } else {
                    setSelectedLabShift('');
                  }
                }}
                options={['morning', 'evening'].filter(
                  shift => labShiftOptions[shift as keyof typeof labShiftOptions]?.length > 0
                )}
              />
            ) : (
              <MultiSelector
                key={`slot-${selectedDomain}-${selectedSubject}`}
                label="Select slots"
                values={selectedSlots}
                options={[...slots].sort((a, b) => a.localeCompare(b))}
                onChange={handleSlotChange}
              />
            )}
            <div className="col-span-2">
              <ComboBox
                label="Select or search subject"
                value={selectedSubject ? toSubjectKey(selectedDomain, selectedSubject) : ''}
                options={
                  selectedDomain
                    ? subjects.map(subject => toSubjectKey(selectedDomain, subject))
                    : schoolSubjectKeys
                }
                searchOptions={schoolSubjectKeys}
                onChange={handleSubjectPick}
                disabled={!!editingCourse}
                renderOption={key => fromSubjectKey(key)[1]}
                renderHint={key => {
                  const domain = fromSubjectKey(key)[0];
                  return domain === selectedDomain ? '' : prettifyDomain(domain);
                }}
              />
            </div>
          </div>

          <div className="w-full h-[3px] bg-black" />

          <div className="grid grid-cols-2 gap-6 px-8 py-9 flex-1">
            <div className="bg-[#FBFDFC]/40 rounded-3xl overflow-hidden flex flex-col">
              <div className="bg-[#FFFFFF]/60 text-center text-[#000000]/80 h-[66px] flex items-center justify-center font-medium text-[26px]">
                Select Faculties
              </div>
              <div className="pt-4 pb-4 px-6 overflow-y-auto space-y-2 scrollbar-thin h-[367px]">
                {faculties.map((faculty: string, index: number) => {
                  let labTooltip = '';

                  if (selectedDomain && selectedSubject && data[selectedSchool]?.[selectedDomain]) {
                    const courseCode = selectedSubject.split(' - ')[0];
                    const baseCode = courseCode.slice(0, -1);
                    const domainData = data[selectedSchool][selectedDomain];

                    const labSubjectKey = Object.keys(domainData).find(subject => {
                      const subjectCode = subject.split(' - ')[0];
                      const subjectType = getCourseType(subjectCode);
                      return (
                        subjectCode.slice(0, -1) === baseCode &&
                        (subjectType === 'P' || subjectType === 'E')
                      );
                    });

                    if (labSubjectKey) {
                      const labEntries = domainData[labSubjectKey].filter(
                        (entry: SubjectEntry) => entry.faculty === faculty
                      );
                      let shiftSlots = [];
                      if (selectedLabShift === 'morning') {
                        shiftSlots = labEntries
                          .map(entry => entry.slot)
                          .filter(slot =>
                            slot.split('+').every(s => parseInt(s.replace('L', ''), 10) <= 30)
                          );
                      } else if (selectedLabShift === 'evening') {
                        shiftSlots = labEntries
                          .map(entry => entry.slot)
                          .filter(slot =>
                            slot.split('+').every(s => parseInt(s.replace('L', ''), 10) >= 31)
                          );
                      } else {
                        const isMorningSelected = selectedSlots.some(s => s.endsWith('1'));
                        const isEveningSelected = selectedSlots.some(s => s.endsWith('2'));

                        shiftSlots = labEntries
                          .map(entry => entry.slot)
                          .filter(slot => {
                            const parts = slot.split('+');
                            return parts.every(s => {
                              const num = parseInt(s.replace('L', ''), 10);
                              return isMorningSelected
                                ? num >= 31
                                : isEveningSelected
                                  ? num <= 30
                                  : false;
                            });
                          });
                      }

                      if (shiftSlots.length > 0) {
                        labTooltip = `${shiftSlots.join(', ')}`;
                      }
                    }
                  }
                  return (
                    <div key={index} className="relative">
                      <div
                        className="flex items-center justify-between py-1 px-2 relative cursor-pointer"
                        tabIndex={labTooltip ? 0 : -1}
                        aria-label={labTooltip || undefined}
                        onMouseEnter={() => labTooltip && setTooltipFacultyIndex(index)}
                        onMouseLeave={() => labTooltip && setTooltipFacultyIndex(null)}
                        onFocus={() => labTooltip && setTooltipFacultyIndex(index)}
                        onBlur={() => labTooltip && setTooltipFacultyIndex(null)}
                        onClick={() => toggleFaculty(faculty)}
                      >
                        {labTooltip && tooltipFacultyIndex === index && (
                          <div
                            className="z-50 absolute flex right-0 items-center pr-12"
                            style={{ pointerEvents: 'none' }}
                          >
                            <div
                              className={`
                              px-2 py-1
                              shadow-lg border border-gray-300
                              rounded-md min-w-max max-w-xs
                              whitespace-pre-line text-xs
                              font-inter bg-white
                              text-gray-900 pointer-events-none
                              `}
                              role="tooltip"
                            >
                              {labTooltip}
                            </div>
                          </div>
                        )}
                        <span className="text-[#000000] text-[19px] relative">{faculty}</span>
                        <label className="inline-flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFaculties.includes(faculty)}
                            onChange={() => toggleFaculty(faculty)}
                            className="peer hidden"
                            aria-label={`Select faculty ${faculty}`}
                            title={`Select faculty ${faculty}`}
                          />
                          <div className="w-8 h-8 rounded-lg border-[2.5px] border-black bg-white flex items-center justify-center peer-checked:bg-[#C1FF83]">
                            <Image
                              src={
                                selectedFaculties.includes(faculty)
                                  ? '/icons/check.svg'
                                  : '/icons/blank.svg'
                              }
                              alt={
                                selectedFaculties.includes(faculty)
                                  ? `Selected ${faculty}`
                                  : `Not selected ${faculty}`
                              }
                              className="w-7 h-7"
                              width={32}
                              height={32}
                              unselectable="on"
                              draggable={false}
                              priority
                            />
                          </div>
                        </label>
                      </div>
                      <div
                        className="w-full mt-1 bg-black"
                        style={{ height: `${1 / window.devicePixelRatio}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col h-full justify-between">
              <div className="bg-[#FBFDFC]/40 rounded-3xl overflow-hidden mb-4">
                <div className="bg-[#FFFFFF]/60 text-center text-[#000000]/80 h-[66px] flex items-center justify-center font-medium text-[26px]">
                  Faculty Priority
                </div>
                <div className="h-[268px] overflow-y-auto space-y-3 pb-4 pt-4 px-6 scrollbar-thin">
                  {priorityList.map((faculty, index) => (
                    <div
                      key={index}
                      className="group cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={e => e.dataTransfer.setData('text/plain', index.toString())}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        const fromIndex = Number(e.dataTransfer.getData('text/plain'));
                        if (fromIndex === index) return;

                        const updatedList = [...priorityList];
                        const [movedItem] = updatedList.splice(fromIndex, 1);
                        updatedList.splice(index, 0, movedItem);
                        setPriorityList(updatedList);
                      }}
                    >
                      <div className="flex justify-between items-center px-2">
                        <div>
                          <span className="text-[#000000] mr-5 font-inter font-semibold">
                            {index + 1}.
                          </span>
                          <span className="text-[#000000] text-[19px]">{faculty}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 bg-[#FFFFFF]/50 px-2 py-1 rounded-lg">
                          <button
                            onClick={() => moveUp(index)}
                            className="text-sm text-black cursor-pointer"
                            aria-label={`Move ${faculty} up in priority`}
                            title={`Move ${faculty} up in priority`}
                          >
                            <Image
                              src={
                                index !== 0 ? '/icons/chevron_up.svg' : '/icons/chevron_up_gray.svg'
                              }
                              width={120}
                              height={80}
                              alt="up"
                              className="w-3 h-3"
                              unselectable="on"
                              draggable={false}
                              priority
                            />
                          </button>
                          <button
                            onClick={() => moveDown(index)}
                            className="text-sm text-black cursor-pointer"
                            aria-label={`Move ${faculty} down in priority`}
                            title={`Move ${faculty} down in priority`}
                          >
                            <Image
                              width={120}
                              height={80}
                              src={
                                index !== priorityList.length - 1
                                  ? '/icons/chevron_down.svg'
                                  : '/icons/chevron_down_gray.svg'
                              }
                              alt="down"
                              className="w-3 h-3"
                              unselectable="on"
                              draggable={false}
                              priority
                            />
                          </button>
                        </div>
                      </div>
                      <div
                        className="w-full mt-1 bg-black"
                        style={{ height: `${1 / window.devicePixelRatio}px` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-[#CC3312] px-3 pt-1 pb-3 text-center">
                  *Use arrows or drag-drop to set faculty priority.
                </div>
              </div>

              <div className="flex flex-row flex-wrap justify-center gap-x-3 gap-y-3 md:gap-x-4">
                {editingCourse ? (
                  <>
                    <ZButton
                      type="wide"
                      text="Cancel"
                      onClick={() => onCancelEdit?.()}
                      color="red"
                    />
                    <ZButton
                      type="wide"
                      // "Save changes" doesn't fit beside Cancel in the narrower columns.
                      text={
                        <>
                          <span className="min-[1680px]:hidden">Save</span>
                          <span className="hidden min-[1680px]:inline">Save changes</span>
                        </>
                      }
                      image="icons/check.svg"
                      onClick={handleConfirm}
                      color="green"
                    />
                  </>
                ) : (
                  <>
                    <ZButton
                      type="wide"
                      text="Reset"
                      image="icons/reset.svg"
                      onClick={handleReset}
                      color="red"
                    />
                    <ZButton
                      type="wide"
                      text="Confirm"
                      image="icons/check.svg"
                      onClick={handleConfirm}
                      color="green"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertModal
        open={popup.showPopup}
        message={popup.message}
        onClose={() => {
          setPopup({ showPopup: false, message: '' });
        }}
        color={''}
      />
    </div>
  );
}
