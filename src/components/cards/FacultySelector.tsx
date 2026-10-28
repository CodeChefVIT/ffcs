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
  selectedSchool,
  onSchoolChange,
  onMyVtopClick,
  myVtopBusy = false,
  vtopStatus,
}: {
  onConfirm: (course: fullCourseData) => void;
  dataOverride?: FacultyData;
  storageKey?: string;
  selectedSchool: string;
  onSchoolChange: (school: string) => void;
  onMyVtopClick: () => void;
  myVtopBusy?: boolean;
  vtopStatus?: React.ReactNode;
}) {
  const schools = Object.keys(data);
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

  const handleConfirm = () => {
    if (!selectedDomain) {
      setPopup({ showPopup: true, message: 'Please select a domain.' });
      return;
    }

    if (!selectedSubject) {
      setPopup({ showPopup: true, message: 'Please select a subject.' });
      return;
    }
    const courseCode = selectedSubject.split(' - ')[0];
    const courseCodeType = getCourseType(
      courseCode,
      data[selectedSchool]?.[selectedDomain]?.[selectedSubject]
    );

    if (!selectedLabShift && courseCodeType === 'P' && !courseCode.startsWith('BSTS')) {
      setPopup({ showPopup: true, message: 'Please select a lab slot.' });
      return;
    }
    if (
      selectedSlots.length === 0 &&
      (courseCodeType === 'L' || courseCodeType === 'E' || courseCode.startsWith('BSTS'))
    ) {
      setPopup({ showPopup: true, message: 'Please select a theory slot.' });
      return;
    }

    if (priorityList.length === 0) {
      setPopup({
        showPopup: true,
        message: 'Please select at least one faculty.',
      });
      return;
    } else {
      setPopup({ showPopup: true, message: 'Successfully added course' });
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
        return;
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
    const courseData: fullCourseData = {
      id,
      courseType: courseCodeType === 'E' ? 'both' : courseType,
      courseCode,
      courseName,
      ...(labSubject.length == 1 &&
        courseCodeType !== 'E' && {
          courseCodeLab,
          courseNameLab,
        }),
      courseSlots: courseSlots!,
    };

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

  const handleSchoolChange = (school: string) => {
    if (school === 'My VTOP') {
      onMyVtopClick();
      return;
    }
    onSchoolChange(school);
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
    if (typeof window === 'undefined') return;
    const isFirstSlot = previousSlots.current.length === 0;
    previousSlots.current = selectedSlots;
    if (!selectedSubject || (selectedSlots.length === 0 && !selectedLabShift)) return;

    try {
      const savedCoursesJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      const savedCourses: fullCourseData[] = savedCoursesJSON ? JSON.parse(savedCoursesJSON) : [];

      const course = savedCourses.find(c => c.id === selectedSubject);

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
    } catch (err) {
      console.error('Error restoring faculties from localStorage', err);
    }
  }, [LOCAL_STORAGE_KEY, selectedSubject, selectedSlots, selectedLabShift, labShiftOptions]);

  const [tooltipFacultyIndex, setTooltipFacultyIndex] = React.useState<number | null>(null);

  const schoolSubjectKeys = React.useMemo(
    () =>
      Object.entries(data[selectedSchool] ?? {}).flatMap(([domain, domainData]) =>
        visibleSubjects(domainData).map(subject => toSubjectKey(domain, subject))
      ),
    [data, selectedSchool]
  );

  return (
    <div>
      <div className="relative mb-20">
        <div className="font-poppins relative bg-[#A7D5D7] rounded-4xl border-3 border-black shadow-[4px_4px_0_0_black] mx-auto overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-4 pt-4 px-4 m-4 text-center">
            {/* <span className="font-semibold text-lg">Select School:</span> */}
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
              {schools.map(school => (
                <button
                  key={school}
                  onClick={() => handleSchoolChange(school)}
                  aria-pressed={selectedSchool === school}
                  aria-label={school}
                  disabled={school === 'My VTOP' && myVtopBusy}
                  className={`px-3 py-1 rounded-full text-sm font-bold border-2 shadow-[2px_2px_0_0_black] border-black cursor-pointer transition duration-100 active:shadow-[1px_1px_0_0_black] active:translate-x-[1px] active:translate-y-[1px] ${
                    school === 'My VTOP'
                      ? selectedSchool === school
                        ? 'bg-[#C4AFF3] ring-2 ring-[#7954BA] ring-offset-2'
                        : 'bg-[#E0D4FF]'
                      : selectedSchool === school
                        ? 'bg-[#FFEA79]'
                        : 'bg-white'
                  }`}
                >
                  {school === 'My VTOP' && myVtopBusy
                    ? 'Checking My VTOP...'
                    : school == 'MID_5YEAR'
                      ? 'SCOPE (MID)'
                      : school}
                </button>
              ))}
            </div>
            {selectedSchool === 'My VTOP' && vtopStatus}
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-4 m-4 px-4 pt-2">
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
                renderOption={key => fromSubjectKey(key)[1]}
                renderHint={key => {
                  const domain = fromSubjectKey(key)[0];
                  return domain === selectedDomain ? '' : prettifyDomain(domain);
                }}
              />
            </div>
            <ComboBox
              label="Select domain"
              value={selectedDomain}
              options={domains}
              onChange={handleDomainChange}
              renderOption={prettifyDomain}
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
          </div>

          <div className="w-full h-[2px] bg-black mt-6 mb-6" />

          <div className="grid grid-cols-2 gap-4 px-4 pb-4 h-full m-4">
            <div className="bg-[#FFFFFF]/40 rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#FFFFFF]/60 text-center text-[#000000]/80 p-4 font-semibold text-lg">
                Select Faculties
              </div>
              <div className="pt-4 pb-4 px-6 overflow-y-auto space-y-2 scrollbar-thin h-86">
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
                        <span className="text-[#000000] relative">{faculty}</span>
                        <label className="inline-flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFaculties.includes(faculty)}
                            onChange={() => toggleFaculty(faculty)}
                            className="peer hidden"
                            aria-label={`Select faculty ${faculty}`}
                            title={`Select faculty ${faculty}`}
                          />
                          <div className="w-7 h-7 rounded-md border-3 border-black flex items-center justify-center peer-checked:bg-[#C1FF83]">
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
              <div className="bg-[#FFFFFF]/40 rounded-xl overflow-hidden mb-4">
                <div className="bg-[#FFFFFF]/60 text-center text-[#000000]/80 p-4 font-semibold text-lg">
                  Faculty Priority
                </div>
                <div className="h-64 overflow-y-auto space-y-2 pb-4 pt-4 px-6 scrollbar-thin">
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
                          <span className="text-[#000000]">{faculty}</span>
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
                <div className="text-xs text-[#CC3312] p-3 text-center font-semibold">
                  *Use arrows or drag-drop to set faculty priority.
                </div>
              </div>

              <div className="flex flex-row justify-center gap-4">
                <ZButton
                  type="long"
                  text="Reset"
                  image="icons/reset.svg"
                  onClick={handleReset}
                  color="red"
                />
                <ZButton
                  type="long"
                  text="Confirm"
                  image="icons/check.svg"
                  onClick={handleConfirm}
                  color="green"
                />
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
