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

  const { data: session } = useSession();
  const owner = session?.user?.email || null;

  const [filterFaculty, setFilterFaculty] = useState('');
  const [smartFilter, setSmartFilter] = useState<'none' | 'sameBuilding' | 'close' | 'noMix'>(
    'none'
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

  // Build list of indexes that match the selected smart filter
  const filteredBySmart = React.useMemo(() => {
    if (!allTimetables || allTimetables.length === 0) return [] as number[];
    if (smartFilter === 'none') return allTimetables.map((_, i) => i);

    const res: number[] = [];
    allTimetables.forEach((tt, idx) => {
      const result = evaluateFilters(tt);
      if (smartFilter === 'sameBuilding' && result.sameBuilding) res.push(idx);
      else if (smartFilter === 'close' && result.closeEnough) res.push(idx);
      else if (smartFilter === 'noMix' && result.noMix) res.push(idx);
    });
    return res;
  }, [allTimetables, smartFilter]);

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

  // When a smart filter is activated, navigate to the first matching timetable
  useEffect(() => {
    if (smartFilter === 'none') return;
    if (filteredBySmart.length > 0) {
      setSelectedIndex(filteredBySmart[0]);
    } else {
      setSelectedIndex(0);
    }
  }, [smartFilter, filteredBySmart]);

  // When a smart filter is active, the pagination should show only matching timetables.
  const displayList =
    smartFilter === 'none' || filteredBySmart.length === 0
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

  return (
    <div
      id="timetable-view"
      className="w-screen mt-12 bg-[#A7D5D7] font-poppins flex items-center justify-center flex-col border-black border-3"
    >
      <div className="flex flex-col h-full p-12 overflow-hidden">
        <div className="flex flex-row mb-4 justify-between w-full px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:gap-8 gap-4">
            <div className="text-5xl font-pangolin">Your Timetables</div>
            <div className="text-xl font-poppins pb-1">
              {timetableCount == 0
                ? '(Empty List)'
                : timetableCount == 1
                  ? '(1 timetable was generated)'
                  : `(${timetableCount} timetables were generated)`}
            </div>
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

        <div className="w-full max-w-[95vw] my-2">
          <div className="flex flex-wrap gap-3 items-center mb-3">
            <div className="text-sm font-poppins mr-2">Smart filters</div>
            {((smartMatches.same.length > 0 && smartMatches.same.length < timetableCount) ||
              smartFilter === 'sameBuilding') && (
              <button
                onClick={() =>
                  setSmartFilter(prev => (prev === 'sameBuilding' ? 'none' : 'sameBuilding'))
                }
                title="Show timetables with all classrooms in the same building"
                className={`${smartFilter === 'sameBuilding' ? 'bg-[#6CC0C5]' : 'bg-[#75E5EA]'} font-poppins border-2 border-black font-semibold text-sm px-3 py-1 rounded shadow-[3px_3px_0_0_black]`}
              >
                Same building ({smartMatches.same.length})
              </button>
            )}

            {((smartMatches.close.length > 0 && smartMatches.close.length < timetableCount) ||
              smartFilter === 'close') && (
              <button
                onClick={() => setSmartFilter(prev => (prev === 'close' ? 'none' : 'close'))}
                title="Show timetables where classrooms are close to each other"
                className={`${smartFilter === 'close' ? 'bg-[#6CC0C5]' : 'bg-[#75E5EA]'} font-poppins border-2 border-black font-semibold text-sm px-3 py-1 rounded shadow-[3px_3px_0_0_black]`}
              >
                Close ({smartMatches.close.length})
              </button>
            )}

            {((smartMatches.noMix.length > 0 && smartMatches.noMix.length < timetableCount) ||
              smartFilter === 'noMix') && (
              <button
                onClick={() => setSmartFilter(prev => (prev === 'noMix' ? 'none' : 'noMix'))}
                title="Show timetables without morning/evening mix"
                className={`${smartFilter === 'noMix' ? 'bg-[#6CC0C5]' : 'bg-[#75E5EA]'} font-poppins border-2 border-black font-semibold text-sm px-3 py-1 rounded shadow-[3px_3px_0_0_black]`}
              >
                No Mix (1/2) ({smartMatches.noMix.length})
              </button>
            )}

            <button
              onClick={() => setSmartFilter('none')}
              title="Clear smart filter"
              className="bg-[#F3F4F6] font-poppins border-2 border-black font-semibold text-sm px-3 py-1 rounded shadow-[3px_3px_0_0_black]"
            >
              Clear
            </button>
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
