'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import Hero from '@/components/ui/Hero';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Accordion from '@/components/ui/Accordion';

import FacultySelector from '@/components/cards/FacultySelector';
import CourseCard from '@/components/cards/CourseCard';
import ViewTimeTable from '@/components/cards/ViewTimeTable';
import { TimetableProvider } from '@/lib/TimeTableContext';
import { fullCourseData } from '@/lib/type';
import { data as bundledData } from '@/data/faculty';
import { FacultyData } from '@/lib/vtopCatalogue';
import useVtopCatalogue from '@/hooks/useVtopCatalogue';
import VtopExtensionModal from '@/components/cards/VtopExtensionModal';
import SchoolPopup from '@/components/ui/SchoolPopup';

function Planner({
  facultyData,
  storageKey,
  school,
}: {
  facultyData: FacultyData;
  storageKey: string;
  school: string;
}) {
  const [selectedCourses, setSelectedCourses] = useState<fullCourseData[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const facultySelectorOnConfirm = (newCourse: fullCourseData) => {
    setSelectedCourses(prevCourses => {
      const existingIndex = prevCourses.findIndex(course => course.id === newCourse.id);

      if (existingIndex !== -1) {
        const existingCourse = prevCourses[existingIndex];

        const updatedSlots = newCourse.courseSlots.map(newSlot => {
          const existingSlot = existingCourse.courseSlots.find(
            slot => slot.slotName === newSlot.slotName
          );

          if (existingSlot) {
            return {
              ...existingSlot,
              slotFaculties: newSlot.slotFaculties,
            };
          } else {
            return newSlot;
          }
        });

        const preservedOldSlots = existingCourse.courseSlots.filter(
          oldSlot => !newCourse.courseSlots.some(newSlot => newSlot.slotName === oldSlot.slotName)
        );

        const mergedSlots = [...preservedOldSlots, ...updatedSlots];

        const updatedCourse = {
          ...existingCourse,
          courseSlots: mergedSlots,
        };

        const updatedCourses = [...prevCourses];
        updatedCourses[existingIndex] = updatedCourse;

        return updatedCourses;
      } else {
        return [...prevCourses, newCourse];
      }
    });
  };

  // The course whose pencil was pressed, if any.
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const editingCourse = selectedCourses.find(course => course.id === editingCourseId) ?? null;
  const [regenerateKey, setRegenerateKey] = useState(0);

  const cancelEdit = useCallback(() => setEditingCourseId(null), []);

  // Saving replaces the course's slots and faculties, keeping its place in Your Courses.
  const saveEdit = (editedCourse: fullCourseData) => {
    setSelectedCourses(prevCourses =>
      prevCourses.map(course => (course.id === editedCourse.id ? editedCourse : course))
    );
    setEditingCourseId(null);
    setRegenerateKey(key => key + 1);
  };

  // Deleting the course being edited, on its own or with Remove all, cancels the edit.
  const updateCourses = (updatedCourses: fullCourseData[]) => {
    setSelectedCourses(updatedCourses);
    if (editingCourseId && !updatedCourses.some(course => course.id === editingCourseId)) {
      setEditingCourseId(null);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(selectedCourses));
    } catch (e) {
      console.error('Failed to save courses to localStorage', e);
    }
  }, [selectedCourses, storageKey]);

  return (
    <TimetableProvider>
      <div className="relative z-10 w-full max-w-[1827px] px-8 mb-16 flex flex-col items-center gap-10 min-[1440px]:flex-row min-[1440px]:items-stretch min-[1440px]:gap-12 2xl:gap-[68px]">
        <div className="w-full max-w-[943px] min-[1440px]:flex-[943_1_0%]">
          <FacultySelector
            key={school}
            selectedSchool={school}
            dataOverride={facultyData}
            storageKey={storageKey}
            onConfirm={facultySelectorOnConfirm}
            courses={selectedCourses}
            editingCourse={editingCourse}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
          />
        </div>
        <div className="w-full max-w-[943px] min-[1440px]:max-w-[752px] min-[1440px]:min-w-[640px] min-[1440px]:flex-[752_1_0%]">
          <CourseCard
            selectedCourses={selectedCourses}
            onDelete={id => {
              setSelectedCourses(prev => prev.filter(c => c.id !== id));
              if (id === editingCourseId) setEditingCourseId(null);
            }}
            onUpdate={updateCourses}
            editingCourseId={editingCourseId}
            onEdit={course => setEditingCourseId(course.id)}
            regenerateKey={regenerateKey}
          />
        </div>
      </div>

      <div className="w-screen p-0 m-0">
        <ViewTimeTable />
      </div>
    </TimetableProvider>
  );
}

export default function View() {
  const vtop = useVtopCatalogue();
  // The school saved on this device, or '' when none is saved yet.
  const [savedSchool, setSavedSchool] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const saved = localStorage.getItem('school');
      return saved && Object.keys(bundledData).includes(saved) ? saved : '';
    } catch {
      return '';
    }
  });
  const [vtopOn, setVtopOn] = useState(false);
  const [showSchoolPopup, setShowSchoolPopup] = useState(!savedSchool);
  const school = vtopOn ? 'My VTOP' : savedSchool || 'SCOPE';
  const personal = vtopOn ? vtop.catalogue : null;
  const selectVtop = async () => {
    if (await vtop.select()) setVtopOn(true);
  };

  const vtopStatus = (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <span>
        {vtop.catalogue
          ? new Set(Object.values(vtop.catalogue.categories).flatMap(group => Object.keys(group)))
              .size
          : 0}{' '}
        courses saved in this browser
      </span>
      <button
        className="underline cursor-pointer"
        disabled={vtop.busy}
        onClick={() => void selectVtop()}
      >
        Refresh My VTOP
      </button>
      <button
        className="underline cursor-pointer"
        disabled={vtop.busy}
        onClick={() => void vtop.clear()}
      >
        Delete VTOP data
      </button>
    </div>
  );

  useEffect(() => {
    if (vtopOn && !vtop.catalogue) setVtopOn(false);
  }, [vtopOn, vtop.catalogue]);
  useEffect(() => {
    if (vtop.readySelection && vtop.modal === 'progress') setVtopOn(true);
  }, [vtop.readySelection, vtop.modal]);
  const facultyData = useMemo<FacultyData>(
    () => ({ ...bundledData, 'My VTOP': personal?.categories || {} }),
    [personal]
  );
  const storageKey = personal ? `selectedCourses:vtop:${personal.catalogueId}` : 'selectedCourses';
  return (
    <div className="flex flex-col min-h-screen relative w-full items-center justify-center overflow-x-hidden">
      <div className="absolute mt-4 inset-0 -z-10 bg-[#CEE4E5]">
        <Image
          src="/art/bg_dots.svg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-top object-contain w-full h-full"
          draggable={false}
          unselectable="on"
        />
      </div>

      <Navbar
        page="landing"
        school={savedSchool || 'SCOPE'}
        vtopOn={vtopOn}
        onSchoolClick={() => setShowSchoolPopup(true)}
      />

      <Hero />

      <div className="w-full flex flex-col items-center pt-12" id="start">
        <Planner
          key={`${storageKey}:${personal?.capturedAt || ''}`}
          school={school}
          facultyData={facultyData}
          storageKey={storageKey}
        />
      </div>
      {showSchoolPopup && (
        <SchoolPopup
          schools={Object.keys(bundledData)}
          school={savedSchool}
          vtopOn={vtopOn}
          vtopBusy={vtop.busy}
          vtopStatus={vtopStatus}
          onVtopChange={on => (on ? void selectVtop() : setVtopOn(false))}
          onConfirm={picked => {
            if (picked) {
              try {
                localStorage.setItem('school', picked);
              } catch {
                // Storage is blocked, so the pick lasts only for this visit.
              }
              setSavedSchool(picked);
            }
            setShowSchoolPopup(false);
          }}
          onClose={() => setShowSchoolPopup(false)}
        />
      )}
      <VtopExtensionModal {...vtop} onReady={() => setVtopOn(true)} />
      <div className="mt-12" />
      <Accordion />

      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-12 m-32">
        <Image
          src="/art/graphic.svg"
          alt="graphic"
          width={0}
          height={0}
          className="w-full h-auto"
          priority
          draggable={false}
          unselectable="on"
        />
      </div>

      <Footer />
    </div>
  );
}
