'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { fullCourseData } from '@/lib/type';
import { ZButton } from './Buttons';

type FacultyPriorityModalProps = {
  course: fullCourseData;
  onClose: () => void;
  onSave: (courseSlots: fullCourseData['courseSlots']) => void;
};

export default function FacultyPriorityModal({
  course,
  onClose,
  onSave,
}: FacultyPriorityModalProps) {
  const [draftSlots, setDraftSlots] = useState(() =>
    course.courseSlots.map(slot => ({ ...slot, slotFaculties: [...slot.slotFaculties] }))
  );
  const [announcement, setAnnouncement] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    // Native modal dialogs contain keyboard focus and make the background inert.
    dialog?.showModal();
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, []);

  const moveFaculty = (slotIndex: number, index: number, direction: -1 | 1) => {
    const slot = draftSlots[slotIndex];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slot.slotFaculties.length) return;

    const faculty = slot.slotFaculties[index];
    setDraftSlots(previous =>
      previous.map((currentSlot, currentIndex) => {
        if (currentIndex !== slotIndex) return currentSlot;
        const slotFaculties = [...currentSlot.slotFaculties];
        [slotFaculties[index], slotFaculties[targetIndex]] = [
          slotFaculties[targetIndex],
          slotFaculties[index],
        ];
        return { ...currentSlot, slotFaculties };
      })
    );
    setAnnouncement(
      `${faculty.facultyName} moved to priority ${targetIndex + 1} in slot ${slot.slotName}.`
    );
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-modal="true"
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-screen-sm max-h-[85vh] overflow-hidden rounded-3xl border-4 border-black bg-[#E2F2F9] p-0 text-black shadow-[10px_10px_0_0_black] backdrop:bg-[#425D5F]/75 backdrop:backdrop-blur-sm font-poppins"
    >
      <div className="flex max-h-[calc(85vh-8px)] flex-col">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b-4 border-black bg-[#8BD5FF] px-4 py-3">
          <h2 id={titleId} className="text-2xl font-pangolin">
            Faculty Priority
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close faculty priorities without saving"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-[#FF9A9A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <Image src="/icons/cross.svg" width={24} height={24} alt="" draggable={false} />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto p-6 space-y-4">
          <p className="font-semibold">
            {course.courseCode} - {course.courseName}
          </p>
          <p id={descriptionId} className="text-sm">
            Use the up and down buttons to reorder faculty within each slot. Click Save, then
            Generate again to apply your updated priorities.
          </p>
          {draftSlots.length === 0 && <p>No saved faculty preferences.</p>}
          {draftSlots.map((slot, slotIndex) => (
            <section key={slotIndex} className="overflow-hidden rounded-xl bg-white/40">
              <h3 className="bg-white/60 px-4 py-3 font-semibold">Slot: {slot.slotName}</h3>
              {slot.slotFaculties.length === 0 && <p className="p-4">No saved faculties.</p>}
              <ol className="divide-y divide-black/20 px-4">
                {slot.slotFaculties.map((faculty, index) => (
                  <li
                    key={course.courseSlots[slotIndex].slotFaculties.indexOf(faculty)}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0 break-words">
                      <span className="mr-3 font-semibold">{index + 1}.</span>
                      <span>{faculty.facultyName}</span>
                      {faculty.facultyLabSlot && (
                        <p className="mt-1 text-sm">Lab slots: {faculty.facultyLabSlot}</p>
                      )}
                      {faculty.venue && <p className="mt-1 text-sm">Venue: {faculty.venue}</p>}
                    </div>
                    <div className="flex shrink-0 flex-col rounded-lg bg-white/50">
                      {([-1, 1] as const).map(direction => {
                        const unavailable =
                          direction === -1 ? index === 0 : index === slot.slotFaculties.length - 1;
                        const name = direction === -1 ? 'up' : 'down';
                        return (
                          <button
                            key={direction}
                            type="button"
                            aria-label={`Move ${faculty.facultyName} ${name} in slot ${slot.slotName}`}
                            aria-disabled={unavailable}
                            onClick={() => moveFaculty(slotIndex, index, direction)}
                            className="flex h-9 w-10 items-center justify-center rounded-lg cursor-pointer aria-disabled:cursor-default focus-visible:outline-2 focus-visible:outline-black"
                          >
                            <Image
                              src={`/icons/chevron_${name}${unavailable ? '_gray' : ''}.svg`}
                              width={12}
                              height={12}
                              alt=""
                              draggable={false}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </p>
        <div className="flex shrink-0 flex-wrap justify-center gap-4 px-6 py-4">
          <ZButton type="regular" text="Cancel" color="red" onClick={onClose} />
          <ZButton type="regular" text="Save" color="green" onClick={() => onSave(draftSlots)} />
        </div>
      </div>
    </dialog>,
    document.body
  );
}
