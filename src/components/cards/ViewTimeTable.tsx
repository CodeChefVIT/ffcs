'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';

import CompoundTable from '@/components//ui/CompoundTable';
import { ZButton } from '@/components/ui/Buttons';
import { useTimetable } from '@/lib/TimeTableContext';
import Image from 'next/image';
import Popup from '@/components/ui/Popup';
import AlertModal from '@/components/ui/AlertModal';
import LoadingPopup from '@/components/ui/LoadingPopup';
import { getCurrentDateTime } from '@/lib/utils';
import { evaluateFilters } from '@/lib/filterUtils';
import { generateShareId } from '@/lib/shareIDgenerate';
import { exportToPDF } from '@/lib/exportToPDF';
import ComboBox from '../ui/ComboBox';
import { timetableDisplayData } from '@/lib/type';

interface Slot {
  slot: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
}

interface SavedTimetable {
  slots: Slot[];
  shareId?: string;
  isShared?: boolean;
}

type SmartFilterCheckboxProps = {
  label: string;
  checked: boolean;
  disabled: boolean;
  onClick: () => void;
  title?: string;
};

function SmartFilterCheckbox({
  label,
  checked,
  disabled,
  onClick,
  title,
}: SmartFilterCheckboxProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      aria-disabled={disabled}
      className={`flex items-center gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center shrink-0 border-2 rounded-sm transition-colors ${
          disabled
            ? 'bg-gray-200 border-gray-400'
            : checked
              ? 'bg-[#C1FF83] border-black'
              : 'bg-white border-black'
        }`}
      >
        {checked && !disabled && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1E1E1E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span
        className={`font-poppins font-semibold text-sm leading-none ${disabled ? 'text-gray-400' : 'text-black'}`}
      >
        {label}
      </span>
    </button>
  );
}

export default function ViewTimeTable() {
  const { timetableData } = useTimetable();
  const originalTimetableData = React.useMemo(
    () => (timetableData ? timetableData : []),
    [timetableData]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [saveTTName, setSaveTTName] = useState<string>('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showFilterInfo, setShowFilterInfo] = useState(false);

  const { data: session } = useSession();
  const owner = session?.user?.email || null;

  const [filterFaculty, setFilterFaculty] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<'sameBuilding' | 'close' | 'noMix'>>(
    new Set()
  );
  const facultyList = React.useMemo(
    () =>
      Array.from(
        new Set(
          originalTimetableData
            .flat()
            .map((item: { facultyName?: string }) => item.facultyName || 'Unknown')
        )
      ).sort((a, b) => a.localeCompare(b)),
    [originalTimetableData]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [filterFaculty]);

  const allTimetables = React.useMemo(() => {
    if (filterFaculty && filterFaculty !== '') {
      return originalTimetableData.filter((tt: timetableDisplayData[]) =>
        tt.some(
          (item: { facultyName?: string }) => (item.facultyName || 'Unknown') === filterFaculty
        )
      );
    }
    return originalTimetableData;
  }, [originalTimetableData, filterFaculty]);

  // Build list of indexes that match ALL active smart filters (AND logic)
  const filteredBySmart = React.useMemo(() => {
    if (!allTimetables || allTimetables.length === 0) return [] as number[];
    if (activeFilters.size === 0) return allTimetables.map((_, i) => i);

    return allTimetables.reduce((res, tt, idx) => {
      const result = evaluateFilters(tt);
      const passes =
        (!activeFilters.has('sameBuilding') || result.sameBuilding) &&
        (!activeFilters.has('close') || result.closeEnough) &&
        (!activeFilters.has('noMix') || result.noMix);
      if (passes) res.push(idx);
      return res;
    }, [] as number[]);
  }, [allTimetables, activeFilters]);

  // Precompute matches for each smart filter so we can decide whether buttons will have effect
  const smartMatches = React.useMemo(() => {
    const same: number[] = [];
    const close: number[] = [];
    const noMix: number[] = [];

    if (!allTimetables || allTimetables.length === 0) return { same, close, noMix };

    allTimetables.forEach((tt, idx) => {
      const result = evaluateFilters(tt);
      if (result.sameBuilding) same.push(idx);
      if (result.closeEnough) close.push(idx);
      if (result.noMix) noMix.push(idx);
    });

    return { same, close, noMix };
  }, [allTimetables]);

  // When active filters change, navigate to the first matching timetable
  useEffect(() => {
    if (activeFilters.size === 0) return;
    if (filteredBySmart.length > 0) {
      setSelectedIndex(filteredBySmart[0]);
    } else {
      setSelectedIndex(0);
    }
  }, [activeFilters, filteredBySmart]);

  // When a smart filter is active, the pagination should show only matching timetables.
  const displayList =
    activeFilters.size === 0 || filteredBySmart.length === 0
      ? allTimetables.map((_, i) => i)
      : filteredBySmart;

  const displayCount = displayList.length;
  // position (1-based) of the currently selected timetable within the display list
  const displayPosition =
    displayList.indexOf(selectedIndex) === -1 ? 1 : displayList.indexOf(selectedIndex) + 1;

  const timetableNumber = displayPosition;
  const timetableCount = displayCount;
  const selectedData = allTimetables[selectedIndex] || [];
  const visibleIndexes = getVisibleIndexes(timetableNumber, timetableCount);

  const convertedData = selectedData.map(
    (item: { courseCode?: string; slotName?: string; facultyName?: string; venue?: string }) => ({
      code: item.courseCode || '00000000',
      slot: item.slotName || 'NIL',
      name: item.facultyName || 'Unknown',
      venue: item.venue || '',
    })
  );

  useEffect(() => {
    setSelectedIndex(0);
    setFilterFaculty('');
  }, [timetableData]);

  useEffect(() => {
    if (!timetableData || timetableData.length === 0) return;

    timetableData.forEach(timetable => {
      if (!(timetable as { shareId?: string }).shareId) {
        (timetable as { shareId?: string }).shareId = generateShareId();
      }
    });
  }, [timetableData]);
  useEffect(() => {
    if (!owner) return;

    const savedKey = 'savedTimetables';
    const localSaved = getSavedTimetables(savedKey);

    axios
      .get(`/api/timetables?owner=${encodeURIComponent(owner)}`)
      .then(res => {
        const dbTimetables = res.data;
        if (!Array.isArray(dbTimetables)) return;

        dbTimetables.forEach(dbTT => {
          const newRecord = {
            slots: dbTT.slots || [],
            shareId: dbTT.shareId || 'unknown',
            isShared: dbTT.isPublic || false,
          };

          const alreadyExists = localSaved.some(localTT => {
            return (
              localTT.shareId === newRecord.shareId || slotsMatch(localTT.slots, newRecord.slots)
            );
          });

          if (!alreadyExists) {
            localSaved.push(newRecord);
          }
        });

        localStorage.setItem(savedKey, JSON.stringify(localSaved));
      })
      .catch(err => {
        console.error('Failed to fetch saved timetables from DB:', err);
      });
  }, [owner]);

  function getSavedTimetables(key: string): SavedTimetable[] {
    if (typeof window === 'undefined') return [];
    try {
      const str = localStorage.getItem(key);
      return str && Array.isArray(JSON.parse(str)) ? (JSON.parse(str) as SavedTimetable[]) : [];
    } catch {
      return [];
    }
  }
  function saveTimetableToLocal(key: string, record: SavedTimetable) {
    if (typeof window === 'undefined') return;
    try {
      const arr = getSavedTimetables(key);
      arr.push(record);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch {}
  }

  function getSavedCourses(): { courseCode: string; courseName: string }[] {
    if (typeof window === 'undefined') return [];
    try {
      const str = localStorage.getItem('savedCourses');
      return str ? (JSON.parse(str) as { courseCode: string; courseName: string }[]) : [];
    } catch {
      return [];
    }
  }

  function saveCourseToLocal(course: { courseCode: string; courseName: string }) {
    if (typeof window === 'undefined') return;
    try {
      const arr = getSavedCourses();
      const exists = arr.some(c => c.courseCode === course.courseCode);
      if (!exists) {
        arr.push(course);
        localStorage.setItem('savedCourses', JSON.stringify(arr));
      }
    } catch {}
  }

  function slotsMatch(a: Slot[], b: Slot[]): boolean {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  async function handleSave(ttName?: string) {
    if (!selectedData || selectedData.length === 0) {
      showAlert('No timetable to save.');
      return;
    }

    const slots = selectedData.map(
      (item: {
        slotName?: string;
        courseCode?: string;
        courseName?: string;
        facultyName?: string;
      }) => ({
        slot: item.slotName || 'NIL',
        courseCode: item.courseCode || '00000000',
        courseName: item.courseName || 'Unknown',
        facultyName: item.facultyName || 'Unknown',
      })
    );

    const savedKey = 'savedTimetables';
    const savedList = getSavedTimetables(savedKey);

    for (const rec of savedList) {
      if (slotsMatch(rec.slots, slots)) {
        const existingId = rec.shareId || 'N/A';

        axios
          .get(`/api/shared-timetable/${existingId}`)
          .then(res => {
            const json = res.data;
            const title = json?.timetable?.title || "Didn't get from backend";
            showAlert(
              `You have already saved this timetable Named (${title}) with ShareID: ${existingId} `
            );
          })
          .catch(() => {
            showAlert(`You have already saved this timetable with ID: ${existingId}`);
          });
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await axios.post('/api/save-timetable', {
        title: ttName || `Saved Timetable`,
        slots,
        owner: owner,
      });

      if (res.data.success) {
        const returnedId = res.data.timetable?.shareId;
        if (returnedId) {
          saveTimetableToLocal(savedKey, { slots, shareId: returnedId });

          slots.forEach(s => {
            saveCourseToLocal({
              courseCode: s.courseCode,
              courseName: s.courseName,
            });
          });

          showAlert('Timetable saved!');
        } else {
          showAlert('Failed to save timetable.');
        }
      } else {
        showAlert('Failed to save timetable.');
      }
    } catch {
      showAlert('Error saving timetable.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleShare() {
    if (!selectedData || selectedData.length === 0) {
      showAlert('No timetable to share.');
      return;
    }
    setIsSharing(true);
    const slots = selectedData.map(item => ({
      slot: item.slotName || 'NIL',
      courseCode: item.courseCode || '00000000',
      courseName: item.courseName || 'Unknown',
      facultyName: item.facultyName || 'Unknown',
    }));

    const savedKey = 'savedTimetables';
    const savedList = getSavedTimetables(savedKey);

    for (const rec of savedList) {
      if (slotsMatch(rec.slots, slots)) {
        const existingId = rec.shareId || 'N/A';
        axios
          .get(`/api/shared-timetable/${existingId}`)
          .then(res => {
            const json = res.data;
            const title = json?.timetable?.title || "Didn't get from backend";
            showAlert(
              `You have already saved this timetable with Name:- ${title} . Please check visibility settings on Saved Timetables page after copying link`
            );
          })
          .finally(() => {
            setIsSharing(false);
          });
        setShareLink(`${window.location.origin}/share/${existingId}`);
        setShowSharePopup(true);
        return;
      }
    }

    try {
      const res = await axios.post('/api/save-timetable', {
        title: saveTTName || getCurrentDateTime(),
        slots,
        owner: owner,
        isPublic: true,
      });

      const newShareId = res?.data?.timetable?.shareId;
      if (newShareId) {
        saveTimetableToLocal(savedKey, {
          slots,
          shareId: newShareId,
          isShared: true,
        });

        slots.forEach(s => {
          saveCourseToLocal({
            courseCode: s.courseCode,
            courseName: s.courseName,
          });
        });

        setShareLink(`${window.location.origin}/share/${newShareId}`);
        setShowSharePopup(true);
      } else {
        showAlert('Failed to generate share link.');
      }
    } catch {
      showAlert('Error sharing timetable.');
    } finally {
      setIsSharing(false);
    }
  }

  function withLoginCheck(action: () => void, skipCheck = false) {
    return () => {
      if (!owner && !skipCheck) {
        setShowLoginPopup(true);
        return;
      }
      action();
    };
  }

  const actionButtons = [
    {
      label: 'Share',
      color: 'yellow',
      icon: '/icons/send.svg',
      onClick: withLoginCheck(handleShare),
    },
    {
      label: 'Download',
      color: 'green',
      icon: '/icons/download.svg',
      onClick: () => {
        if (!selectedData || selectedData.length === 0) {
          showAlert('No Timetables generated');
          return;
        }
        exportToPDF();
      },
    },
    {
      label: 'Save',
      color: 'purple',
      icon: '/icons/save.svg',
      onClick: withLoginCheck(() => {
        if (!selectedData || selectedData.length === 0) {
          showAlert('No timetable to save.');
          return;
        }
        setSaveTTName(getCurrentDateTime());
        setShowSavePopup(true);
      }),
    },
  ];

  function showAlert(msg: string) {
    setAlertMsg(msg);
    setAlertOpen(true);
  }

  function toggleFilter(key: 'sameBuilding' | 'close' | 'noMix') {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        if (key === 'sameBuilding') next.delete('close');
      } else {
        next.add(key);
        if (key === 'close') next.add('sameBuilding');
      }
      return next;
    });
  }

  return (
    <div
      id="timetable-view"
      className="w-screen mt-12 bg-[#A7D5D7] font-poppins flex items-center justify-center flex-col border-black border-3"
    >
      <div className="flex flex-col h-full p-12 overflow-hidden">
        <div className="flex flex-row mb-4 justify-between w-full px-4 items-center">
          <div className="text-5xl font-pangolin">Your Timetables</div>

          <div className="flex items-center gap-6">
            <div className="flex gap-5 items-center">
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowFilterInfo(prev => !prev)}
                  aria-label="Smart filter info"
                  className="w-8 h-8 rounded-full bg-[#FFEA79] border-2 border-black shadow-[2px_2px_0px_0px_black] flex items-center justify-center font-[var(--font-plus-jakarta-sans)] font-medium text-sm leading-none select-none"
                >
                  ?
                </button>
                {showFilterInfo && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterInfo(false)} />
                    <div className="absolute top-full left-0 mt-2 z-20 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_black] p-4 w-72 font-poppins">
                      <p className="font-semibold text-xs text-black mb-3">Smart Filters</p>
                      <div className="flex flex-col gap-3">
                        <div>
                          <p className="font-semibold text-xs text-black">Same Building</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            All classes are in the same building, no cross-campus walking between
                            lectures.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-black">Close</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Classrooms are close to each other, minimal travel between back-to-back
                            classes.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-black">No Mix</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            No mixing of morning and evening theory slots, keeps your schedule on
                            one half of the day.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <SmartFilterCheckbox
                label="Same Building"
                checked={activeFilters.has('sameBuilding')}
                disabled={smartMatches.same.length === 0}
                onClick={() => toggleFilter('sameBuilding')}
                title="Show timetables with all classrooms in the same building"
              />
              <SmartFilterCheckbox
                label="Close"
                checked={activeFilters.has('close')}
                disabled={smartMatches.close.length === 0}
                onClick={() => toggleFilter('close')}
                title="Show timetables where classrooms are close to each other"
              />
              <SmartFilterCheckbox
                label="No Mix"
                checked={activeFilters.has('noMix')}
                disabled={smartMatches.noMix.length === 0}
                onClick={() => toggleFilter('noMix')}
                title="Show timetables without morning/evening mix"
              />
            </div>

            <div className="w-[400px]">
              <ComboBox
                label="Filter by Faculty"
                value={filterFaculty}
                options={facultyList}
                onChange={setFilterFaculty}
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[95vw] my-2">
          <div className="text-xl font-poppins mb-3">
            {timetableCount === 0
              ? '(Empty List)'
              : timetableCount === 1
                ? '(1 timetable was generated)'
                : `(${timetableCount} timetables were generated)`}
          </div>

          <CompoundTable data={convertedData} large={true} />
        </div>

        <div className="flex flex-row items-center justify-between px-16 pt-4 gap-8">
          <div className="w-auto">
            <div className="w-full flex justify-center">
              <button
                onClick={() => {
                  if (timetableNumber !== 1) setSelectedIndex(displayList[0] ?? 0);
                }}
                title="Go to first timetable"
                aria-label="Go to first timetable"
                disabled={timetableNumber === 1}
                className={`font-poppins border-2 border-black font-semibold flex items-center justify-center text-center transition duration-100 h-12 w-12 rounded-l-xl shadow-[4px_4px_0_0_black] bg-[#75E5EA]
      ${
        timetableNumber === 1
          ? 'cursor-default'
          : 'active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]'
      }`}
              >
                <span style={{ pointerEvents: 'none', display: 'flex' }}>
                  <Image
                    src="/icons/start.svg"
                    alt="Go to first timetable"
                    width={32}
                    height={32}
                    unselectable="on"
                    draggable={false}
                    priority
                  />
                </span>
              </button>

              <div className="flex flex-row">
                {visibleIndexes.map(index => {
                  const globalIndex = displayList[index - 1];
                  if (timetableNumber === index) {
                    return (
                      <div
                        key={index}
                        className="bg-[#6CC0C5] font-poppins border-2 border-black font-bold text-lg flex items-center justify-center text-center h-12 w-12 shadow-[4px_4px_0_0_black]"
                      >
                        {index}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(globalIndex)}
                      className="bg-[#75E5EA] font-poppins border-2 border-black font-bold text-lg flex items-center justify-center text-center transition duration-100 h-12 w-12 shadow-[4px_4px_0_0_black] active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      {index}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  if (timetableNumber !== timetableCount)
                    setSelectedIndex(displayList[displayCount - 1] ?? selectedIndex);
                }}
                title="Go to last timetable"
                aria-label="Go to last timetable"
                disabled={timetableNumber === timetableCount}
                className={`font-poppins border-2 border-black font-semibold flex items-center justify-center text-center transition duration-100 h-12 w-12 rounded-r-xl shadow-[4px_4px_0_0_black] bg-[#75E5EA]
      ${
        timetableNumber === timetableCount
          ? 'cursor-default'
          : 'active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]'
      }`}
              >
                <span style={{ pointerEvents: 'none', display: 'flex' }}>
                  <Image
                    src="/icons/end.svg"
                    alt="Go to last timetable"
                    width={32}
                    height={32}
                    unselectable="on"
                    draggable={false}
                    priority
                  />
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {selectedData && selectedData.length > 0
              ? actionButtons.map((btn, idx) => (
                  <div key={idx}>
                    <ZButton
                      type="long"
                      text={btn.label}
                      image={btn.icon}
                      color={btn.color || 'blue'}
                      onClick={btn.onClick}
                    />
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>

      {showSharePopup && (
        <Popup
          type="share_tt"
          dataBody={shareLink}
          closeLink={() => setShowSharePopup(false)}
          isLoading={isSharing}
        />
      )}

      {showLoginPopup && (
        <Popup
          type="login"
          action={() => signIn('google', { callbackUrl: '/', redirect: true })}
          closeLink={() => setShowLoginPopup(false)}
        />
      )}

      {showSavePopup && (
        <Popup
          type="save_tt"
          dataBody={saveTTName}
          closeLink={() => setShowSavePopup(false)}
          action={() => {
            if (!saveTTName.trim()) {
              alert('Please enter a timetable name.');
              return;
            }
            setShowSavePopup(false);
            handleSave(saveTTName.trim());
          }}
          onInputChange={setSaveTTName}
        />
      )}

      <AlertModal
        open={alertOpen}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
        color="yellow"
      />

      {isSaving && <LoadingPopup isLoading={isSaving} />}
    </div>
  );
}

function getVisibleIndexes(selected: number, total: number) {
  const maxVisible = 5;
  const shift = 2;
  const start = Math.max(1, Math.min(selected - shift, total - maxVisible + 1));
  const end = Math.min(total, start + maxVisible - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
