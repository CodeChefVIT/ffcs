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
import { evaluateFilters, START_TIMES, END_TIMES } from '@/lib/filterUtils';
import { generateShareId } from '@/lib/shareIDgenerate';
import { exportToPDF } from '@/lib/exportToPDF';
import ComboBox from '../ui/ComboBox';
import { timetableDisplayData } from '@/lib/type';
import {
  groupTimetablesByLayout,
  filterGroupsByFaculty,
  evaluateGroupFilters,
} from '@/lib/groupTimetables';
import FacultyVariantArrows from '@/components/ui/FacultyVariantArrows';

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

type SmartFilterPillProps = {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  title?: string;
};

const filterLabels = {
  sameBuilding: 'Same building',
  morningOnly: 'Morning theory',
  eveningOnly: 'Evening theory',
  mixOnly: 'Mixed theory',
  fewestLabDays: 'Fewest lab days',
};

const filterLabelClass = 'mb-1.5 text-[11px] font-bold uppercase text-ffcs-muted';

const DAY_START = START_TIMES[0];
const DAY_END = END_TIMES[END_TIMES.length - 1];
const formatTime = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`;
};
const nearest = (times: number[], value: number) =>
  times.reduce((best, t) => (Math.abs(t - value) < Math.abs(best - value) ? t : best));
const thumbClass =
  'absolute top-0 -left-3 w-[calc(100%+1.5rem)] h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[2.5px] [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[2.5px] [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:cursor-pointer';

// Two handles on one bar: the left one snaps to class start times, the right one to end times
function TimeRangeBar({
  value: [from, to],
  onChange,
}: {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const percent = (minutes: number) => ((minutes - DAY_START) / (DAY_END - DAY_START)) * 100;
  // Labels too close to fit side by side become one label between the handles
  const together = percent(to) - percent(from) < 30;
  return (
    <div>
      <div className="relative h-6 mx-3">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3.5 rounded-full border-[2.5px] border-black bg-white/70" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3.5 border-y-[2.5px] border-black bg-[#FFEA79]"
          style={{ left: `${percent(from)}%`, right: `${100 - percent(to)}%` }}
        />
        <input
          type="range"
          aria-label="Earliest class"
          min={DAY_START}
          max={DAY_END}
          step={10}
          value={from}
          onChange={e =>
            onChange([
              nearest(
                START_TIMES.filter(t => t < to),
                Number(e.target.value)
              ),
              to,
            ])
          }
          className={thumbClass}
        />
        <input
          type="range"
          aria-label="Latest class"
          min={DAY_START}
          max={DAY_END}
          step={10}
          value={to}
          onChange={e =>
            onChange([
              from,
              nearest(
                END_TIMES.filter(t => t > from),
                Number(e.target.value)
              ),
            ])
          }
          className={thumbClass}
        />
      </div>
      <div className="relative h-5 mx-3 mt-1 text-sm font-medium">
        {together ? (
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${Math.min(80, Math.max(20, (percent(from) + percent(to)) / 2))}%` }}
          >
            {formatTime(from)} – {formatTime(to)}
          </span>
        ) : (
          <>
            <span
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${Math.max(8, percent(from))}%` }}
            >
              {formatTime(from)}
            </span>
            <span
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${Math.min(92, percent(to))}%` }}
            >
              {formatTime(to)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// Hover/focus tooltip wrapper shared by the smart-filter controls
function WithTooltip({
  text,
  children,
  className = 'inline-flex items-center',
}: {
  text?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => text && setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => text && setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {text && show && (
        <div
          className="z-50 absolute top-full left-1/2 -translate-x-1/2 mt-2"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="px-2 py-1 shadow-lg border border-gray-300 rounded-md min-w-max max-w-xs whitespace-pre-line text-xs font-inter bg-white text-gray-900 pointer-events-none"
            role="tooltip"
          >
            {text}
          </div>
        </div>
      )}
    </div>
  );
}

function SmartFilterCheckbox({
  label,
  checked,
  disabled,
  onClick,
  title,
}: SmartFilterCheckboxProps) {
  return (
    <WithTooltip text={title}>
      <button
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled}
        aria-pressed={checked}
        className={`flex items-center gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center shrink-0 border-[2.5px] rounded-md transition-colors ${
            disabled && checked
              ? 'bg-[#B8E07A] border-gray-500'
              : disabled
                ? 'bg-gray-200 border-gray-400'
                : checked
                  ? 'bg-[#C1FF83] border-black'
                  : 'bg-white border-black'
          }`}
        >
          {checked && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={disabled ? '#888' : '#1E1E1E'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span
          className={`font-poppins font-medium text-sm leading-none whitespace-nowrap ${
            disabled && !checked ? 'text-gray-400' : disabled ? 'text-gray-500' : 'text-black'
          }`}
        >
          {label}
        </span>
      </button>
    </WithTooltip>
  );
}

// Single-select segment used for the mutually-exclusive time-period group
function SmartFilterPill({ label, selected, disabled, onClick, title }: SmartFilterPillProps) {
  const stateCls =
    selected && !disabled
      ? 'bg-ffcs-yellow font-semibold text-black'
      : selected && disabled
        ? 'bg-ffcs-yellow/60 font-semibold text-gray-600 cursor-not-allowed'
        : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-ffcs-muted cursor-pointer hover:bg-ffcs-yellow hover:text-black';
  return (
    <WithTooltip text={title} className="flex">
      <button
        onClick={disabled ? undefined : onClick}
        aria-pressed={selected}
        aria-disabled={disabled}
        className={`flex-1 px-2 rounded-[9.5px] font-poppins font-medium text-sm leading-none transition ${stateCls}`}
      >
        {label}
      </button>
    </WithTooltip>
  );
}

export default function ViewTimeTable() {
  const { timetableData } = useTimetable();
  const originalTimetableData = React.useMemo(
    () => (timetableData ? timetableData : []),
    [timetableData]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  // Off = every generated timetable is its own tab, exactly like before
  const [groupBySlot, setGroupBySlot] = useState(false);
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
  const [showFilters, setShowFilters] = useState(false);

  const { data: session } = useSession();
  const owner = session?.user?.email || null;

  const [filterFaculty, setFilterFaculty] = useState('');
  const [activeFilters, setActiveFilters] = useState<
    Set<'sameBuilding' | 'morningOnly' | 'eveningOnly' | 'mixOnly' | 'fewestLabDays'>
  >(new Set());
  // Classes must start and end inside this range; the full day means the filter is off
  const [timeRange, setTimeRange] = useState<[number, number]>([DAY_START, DAY_END]);
  const rangeOn = timeRange[0] !== DAY_START || timeRange[1] !== DAY_END;
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

  // One entry per tab. Group by Slot on: one per slot layout, faculty combinations in `variants`.
  // Off: every timetable is its own entry with a single variant, so behaviour matches before.
  const allTimetables = React.useMemo(() => {
    const groups = groupBySlot
      ? groupTimetablesByLayout(originalTimetableData)
      : originalTimetableData.map(tt => ({ layoutKey: '', variants: [tt] }));
    return filterGroupsByFaculty(groups, filterFaculty);
  }, [originalTimetableData, filterFaculty, groupBySlot]);

  // Precompute per-filter match lists
  const smartMatches = React.useMemo(() => {
    const same: number[] = [];
    const morningOnly: number[] = [];
    const eveningOnly: number[] = [];
    const mixOnly: number[] = [];

    if (!allTimetables || allTimetables.length === 0)
      return { same, morningOnly, eveningOnly, mixOnly };

    allTimetables.forEach((group, idx) => {
      const r = evaluateGroupFilters(group);
      if (r.sameBuilding) same.push(idx);
      if (r.morningOnly) morningOnly.push(idx);
      if (r.eveningOnly) eveningOnly.push(idx);
      if (r.mixOnly) mixOnly.push(idx);
    });

    return { same, morningOnly, eveningOnly, mixOnly };
  }, [allTimetables]);

  // Filters forced on because every timetable already satisfies them
  const forcedFilters = React.useMemo(() => {
    const forced = new Set<
      'sameBuilding' | 'morningOnly' | 'eveningOnly' | 'mixOnly' | 'fewestLabDays'
    >();
    if (!allTimetables || allTimetables.length === 0) return forced;
    const total = allTimetables.length;
    if (smartMatches.same.length === total) forced.add('sameBuilding');
    if (smartMatches.morningOnly.length === total) forced.add('morningOnly');
    if (smartMatches.eveningOnly.length === total) forced.add('eveningOnly');
    if (smartMatches.mixOnly.length === total) forced.add('mixOnly');
    return forced;
  }, [allTimetables, smartMatches]);

  // Union of user-selected and forced filters — drives all filtering logic
  const effectiveActiveFilters = React.useMemo(() => {
    const result = new Set(activeFilters);
    forcedFilters.forEach(f => result.add(f));
    return result;
  }, [activeFilters, forcedFilters]);

  // Indexes matching ALL effective smart filters (AND logic)
  const filteredBySmart = React.useMemo(() => {
    if (!allTimetables || allTimetables.length === 0) return [] as number[];
    if (effectiveActiveFilters.size === 0 && !rangeOn) return allTimetables.map((_, i) => i);

    const matches = allTimetables.reduce((res, group, idx) => {
      const r = evaluateGroupFilters(group);
      const passes =
        (!effectiveActiveFilters.has('sameBuilding') || r.sameBuilding) &&
        (!effectiveActiveFilters.has('morningOnly') || r.morningOnly) &&
        (!effectiveActiveFilters.has('eveningOnly') || r.eveningOnly) &&
        (!effectiveActiveFilters.has('mixOnly') || r.mixOnly) &&
        r.start >= timeRange[0] &&
        r.end <= timeRange[1];
      if (passes) res.push(idx);
      return res;
    }, [] as number[]);
    // Fewest lab days only reorders; the sort is stable, so ties keep generation order
    if (!effectiveActiveFilters.has('fewestLabDays')) return matches;
    const labDays = (idx: number) => evaluateGroupFilters(allTimetables[idx]).labDays;
    return matches.sort((a, b) => labDays(a) - labDays(b));
  }, [allTimetables, effectiveActiveFilters, rangeOn, timeRange]);

  const filtersOn = effectiveActiveFilters.size > 0 || rangeOn;

  const filterWouldMatch = React.useMemo(() => {
    const currentSet = new Set(filteredBySmart);
    const check = (idxs: number[]) =>
      !filtersOn ? idxs.length > 0 : idxs.some(i => currentSet.has(i));

    // Time filters (morning/evening/mix) are mutually exclusive. Check them against the
    // sameBuilding-only filtered set so that switching between them stays possible.
    const nonTimeSet = new Set(
      !allTimetables
        ? []
        : allTimetables.reduce((res, group, idx) => {
            const r = evaluateGroupFilters(group);
            if (
              (!effectiveActiveFilters.has('sameBuilding') || r.sameBuilding) &&
              r.start >= timeRange[0] &&
              r.end <= timeRange[1]
            )
              res.push(idx);
            return res;
          }, [] as number[])
    );
    const checkTime = (idxs: number[]) => idxs.some(i => nonTimeSet.has(i));
    return {
      sameBuilding: check(smartMatches.same),
      morningOnly: checkTime(smartMatches.morningOnly),
      eveningOnly: checkTime(smartMatches.eveningOnly),
      mixOnly: checkTime(smartMatches.mixOnly),
    };
  }, [allTimetables, filteredBySmart, smartMatches, effectiveActiveFilters, filtersOn, timeRange]);

  // When active filters change, navigate to the first matching timetable
  useEffect(() => {
    if (!filtersOn) return;
    if (filteredBySmart.length > 0) {
      setSelectedIndex(filteredBySmart[0]);
    } else {
      setSelectedIndex(0);
    }
  }, [filtersOn, filteredBySmart]);

  // When a smart filter is active, the pagination should show only matching timetables.
  const displayList = filtersOn ? filteredBySmart : allTimetables.map((_, i) => i);

  const displayCount = displayList.length;
  // position (1-based) of the currently selected timetable within the display list
  const displayPosition =
    displayList.indexOf(selectedIndex) === -1 ? 1 : displayList.indexOf(selectedIndex) + 1;

  const timetableNumber = displayPosition;
  const timetableCount = displayCount;
  const selectedGroup = displayList.length > 0 ? allTimetables[selectedIndex] : undefined;
  // With Same Building on, only offer the combinations that really are in one building
  const visibleVariants = React.useMemo(() => {
    if (!selectedGroup) return [] as timetableDisplayData[][];
    if (!effectiveActiveFilters.has('sameBuilding')) return selectedGroup.variants;
    const inOneBuilding = selectedGroup.variants.filter(tt => evaluateFilters(tt).sameBuilding);
    return inOneBuilding.length > 0 ? inOneBuilding : selectedGroup.variants;
  }, [selectedGroup, effectiveActiveFilters]);
  const selectedData = visibleVariants[selectedVariant] || visibleVariants[0] || [];
  const visibleIndexes = getVisibleIndexes(timetableNumber, timetableCount);

  console.log('selectedData', selectedData);
  const convertedData = selectedData.map(
    (item: {
      courseCode?: string;
      courseName?: string;
      slotName?: string;
      facultyName?: string;
    }) => ({
      code: item.courseCode || '00000000',
      subject: item.courseName || '',
      slot: item.slotName || 'NIL',
      name: item.facultyName || 'Unknown',
    })
  );

  // A new tab, a new filter, a new generation or a toggle starts at faculty combination 1
  useEffect(() => {
    setSelectedVariant(0);
  }, [selectedIndex, filterFaculty, effectiveActiveFilters, timeRange, timetableData, groupBySlot]);

  // Turning Group by Slot on or off changes what each tab is, so go back to tab 1
  useEffect(() => {
    setSelectedIndex(0);
  }, [groupBySlot]);

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
      onClick: async () => {
        if (!selectedData || selectedData.length === 0) {
          showAlert('No Timetables generated');
          return;
        }
        try {
          await exportToPDF();
        } catch (err: unknown) {
          console.error('PDF export failed:', err);
          const message =
            err instanceof Error ? err.message : 'Failed to export PDF. Please try again.';
          showAlert(message);
        }
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

  function toggleSameBuilding() {
    if (forcedFilters.has('sameBuilding')) return;
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has('sameBuilding')) next.delete('sameBuilding');
      else next.add('sameBuilding');
      return next;
    });
  }

  // === Smart filter disabled states and tooltips ===
  const isSameBuildingForced = forcedFilters.has('sameBuilding');
  const isSameBuildingNoMatch =
    !isSameBuildingForced &&
    !effectiveActiveFilters.has('sameBuilding') &&
    !filterWouldMatch.sameBuilding;
  const sameBuildingDisabled = isSameBuildingForced || isSameBuildingNoMatch;
  const sameBuildingTitle = isSameBuildingForced
    ? 'All generated timetables are already in the same building'
    : isSameBuildingNoMatch
      ? 'No timetables would match this filter'
      : 'Show timetables with all classrooms in the same building';

  const isMorningOnlyForced = forcedFilters.has('morningOnly');
  const isMorningOnlyNoMatch = !filterWouldMatch.morningOnly;
  const morningOnlyDisabled = isMorningOnlyForced || isMorningOnlyNoMatch;
  const morningOnlyTitle = isMorningOnlyForced
    ? 'All generated timetables already have only morning theory slots'
    : effectiveActiveFilters.has('morningOnly')
      ? 'Showing morning theory only — click to clear'
      : isMorningOnlyNoMatch
        ? 'No timetables have only morning theory slots'
        : effectiveActiveFilters.has('eveningOnly') || effectiveActiveFilters.has('mixOnly')
          ? 'Show only morning theory timetables — click to switch'
          : 'Show timetables with only morning theory slots';

  const isEveningOnlyForced = forcedFilters.has('eveningOnly');
  const isEveningOnlyNoMatch = !filterWouldMatch.eveningOnly;
  const eveningOnlyDisabled = isEveningOnlyForced || isEveningOnlyNoMatch;
  const eveningOnlyTitle = isEveningOnlyForced
    ? 'All generated timetables already have only evening theory slots'
    : effectiveActiveFilters.has('eveningOnly')
      ? 'Showing evening theory only — click to clear'
      : isEveningOnlyNoMatch
        ? 'No timetables have only evening theory slots'
        : effectiveActiveFilters.has('morningOnly') || effectiveActiveFilters.has('mixOnly')
          ? 'Show only evening theory timetables — click to switch'
          : 'Show timetables with only evening theory slots';

  const isMixOnlyForced = forcedFilters.has('mixOnly');
  const isMixOnlyNoMatch = !filterWouldMatch.mixOnly;
  const mixOnlyDisabled = isMixOnlyForced || isMixOnlyNoMatch;
  const mixOnlyTitle = isMixOnlyForced
    ? 'All generated timetables already have both morning and evening theory slots'
    : effectiveActiveFilters.has('mixOnly')
      ? 'Showing mixed morning/evening only — click to clear'
      : isMixOnlyNoMatch
        ? 'No timetables have mixed morning/evening theory slots'
        : effectiveActiveFilters.has('morningOnly') || effectiveActiveFilters.has('eveningOnly')
          ? 'Show mixed morning/evening timetables — click to switch'
          : 'Show timetables with both morning and evening theory slots';

  // Filters the student turned on; forced ones can't be removed, so they get no tag
  const filterTags = [
    ...(Object.keys(filterLabels) as (keyof typeof filterLabels)[])
      .filter(key => activeFilters.has(key) && !forcedFilters.has(key))
      .map(key => ({
        label: filterLabels[key],
        remove: () =>
          setActiveFilters(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          }),
      })),
    ...(rangeOn
      ? [
          {
            label: `${formatTime(timeRange[0])} – ${formatTime(timeRange[1])}`,
            remove: () => setTimeRange([DAY_START, DAY_END]),
          },
        ]
      : []),
    ...(filterFaculty ? [{ label: filterFaculty, remove: () => setFilterFaculty('') }] : []),
  ];

  function clearFilters() {
    setActiveFilters(new Set());
    setTimeRange([DAY_START, DAY_END]);
    setFilterFaculty('');
  }

  function toggleFewestLabDays() {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has('fewestLabDays')) next.delete('fewestLabDays');
      else next.add('fewestLabDays');
      return next;
    });
  }

  // === Time group: single-select; click the active one to deselect ===
  const timeForced = isMorningOnlyForced || isEveningOnlyForced || isMixOnlyForced;

  function toggleTime(key: 'morningOnly' | 'eveningOnly' | 'mixOnly') {
    if (timeForced) return;
    setActiveFilters(prev => {
      const next = new Set(prev);
      const wasActive = next.has(key);
      next.delete('morningOnly');
      next.delete('eveningOnly');
      next.delete('mixOnly');
      if (!wasActive) next.add(key);
      return next;
    });
  }

  return (
    <div
      id="timetable-view"
      className="w-screen mt-12 bg-[#A7D5D7] font-poppins flex items-center justify-center flex-col border-black border-3"
    >
      <div className="flex flex-col h-full p-12 overflow-hidden">
        <div className="flex flex-row flex-wrap gap-4 mb-4 justify-between w-full px-2 items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="text-5xl font-pangolin">Your Timetables</div>
            <div className="flex flex-wrap gap-2">
              {filterTags.map(tag => (
                <span
                  key={tag.label}
                  className="flex items-center gap-1.5 h-7 pl-2.5 pr-1.5 rounded-lg border-2 border-black bg-ffcs-yellow text-sm font-medium"
                >
                  {tag.label}
                  <button
                    type="button"
                    aria-label={`Remove ${tag.label}`}
                    onClick={tag.remove}
                    className="cursor-pointer"
                  >
                    <Image src="/icons/cross.svg" alt="" width={14} height={14} draggable={false} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <div className="flex gap-5 items-center">
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowFilterInfo(prev => !prev)}
                  aria-label="Smart filter info"
                  className="w-8 h-8 rounded-full bg-[#FFEA79] border-2 border-black shadow-[2px_2px_0px_0px_black] flex items-center justify-center font-jakarta font-medium text-sm leading-none select-none"
                >
                  ?
                </button>
                {showFilterInfo && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterInfo(false)} />
                    <div className="absolute top-full right-0 mt-2 z-20 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_black] p-4 w-72 font-poppins">
                      <p className="font-semibold text-xs text-black mb-3">Smart Filters</p>
                      <div className="flex flex-col gap-3">
                        <div>
                          <p className="font-semibold text-xs text-black">Group by Slot</p>
                          <p className=" text-xs text-gray-500 mt-0.5">
                            Timetables with the same slots but different faculty become one tab. Use
                            the arrows in the side panel to switch faculty.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-black">Same Building</p>
                          <p className=" text-xs text-gray-500 mt-0.5">
                            All classes share the same building prefix — no cross-campus walking
                            between lectures.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-black">Time period</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Pick one: Morning (theory slots end in 1), Evening (end in 2), or Mixed
                            (both). Click the active one again to clear it.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-black">Class time</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Only timetables whose theory and lab classes all start and end inside
                            the range.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-black">Fewest lab days</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Puts timetables with labs on fewer days first. Nothing is hidden.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilters(prev => !prev)}
                  aria-expanded={showFilters}
                  className={`flex items-center gap-2.5 h-12 px-5 rounded-xl border-3 border-black shadow-hard font-semibold cursor-pointer transition duration-100 active:shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] ${
                    showFilters ? 'bg-ffcs-blue-pressed' : 'bg-ffcs-blue'
                  }`}
                >
                  Filters
                  {filterTags.length > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">
                      {filterTags.length}
                    </span>
                  )}
                </button>
                {showFilters && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                    <div className="absolute top-full right-0 mt-3 z-20 w-[420px] max-w-[calc(100vw-8rem)] bg-ffcs-card border-3 border-black rounded-3xl shadow-hard p-5 flex flex-col gap-4">
                      <div className="font-semibold">Filters</div>
                      <div>
                        <div className={filterLabelClass}>Theory time</div>
                        <div className="grid grid-cols-3 h-10.5 p-1 gap-1 bg-white/70 rounded-2xl border-[2.5px] border-black">
                          <SmartFilterPill
                            label="Morning"
                            selected={effectiveActiveFilters.has('morningOnly')}
                            disabled={morningOnlyDisabled}
                            onClick={() => toggleTime('morningOnly')}
                            title={morningOnlyTitle}
                          />
                          <SmartFilterPill
                            label="Evening"
                            selected={effectiveActiveFilters.has('eveningOnly')}
                            disabled={eveningOnlyDisabled}
                            onClick={() => toggleTime('eveningOnly')}
                            title={eveningOnlyTitle}
                          />
                          <SmartFilterPill
                            label="Mixed"
                            selected={effectiveActiveFilters.has('mixOnly')}
                            disabled={mixOnlyDisabled}
                            onClick={() => toggleTime('mixOnly')}
                            title={mixOnlyTitle}
                          />
                        </div>
                      </div>
                      <div>
                        <div className={filterLabelClass}>Class time</div>
                        <TimeRangeBar value={timeRange} onChange={setTimeRange} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <SmartFilterCheckbox
                          label="Same Building"
                          checked={effectiveActiveFilters.has('sameBuilding')}
                          disabled={sameBuildingDisabled}
                          onClick={toggleSameBuilding}
                          title={sameBuildingTitle}
                        />
                        <SmartFilterCheckbox
                          label="Fewest lab days"
                          checked={activeFilters.has('fewestLabDays')}
                          disabled={false}
                          onClick={toggleFewestLabDays}
                          title="Show timetables with labs on fewer days first"
                        />
                        <SmartFilterCheckbox
                          label="Group by Slot"
                          checked={groupBySlot}
                          disabled={false}
                          onClick={() => setGroupBySlot(prev => !prev)}
                          title={
                            groupBySlot
                              ? 'Showing one timetable per slot layout — click to show every faculty combination as its own timetable'
                              : 'Show one timetable per slot layout and switch faculty with the arrows'
                          }
                        />
                      </div>
                      <div>
                        <ComboBox
                          label="Filter by Faculty"
                          value={filterFaculty}
                          options={facultyList}
                          onChange={setFilterFaculty}
                        />
                      </div>
                      <div className="flex justify-end">
                        <ZButton
                          type="regular"
                          text="Clear all"
                          color="red"
                          disabled={filterTags.length === 0}
                          onClick={clearFilters}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[95vw] my-2">
          <div className="text-xl font-poppins mb-3 px-2">
            {timetableCount === 0
              ? '(Empty List)'
              : timetableCount === 1
                ? '(1 timetable was generated)'
                : `(${timetableCount} timetables were generated)`}
          </div>

          <CompoundTable
            data={convertedData}
            large={true}
            sidePanelFooter={
              visibleVariants.length > 1 ? (
                <FacultyVariantArrows
                  count={visibleVariants.length}
                  selected={selectedVariant}
                  onSelect={setSelectedVariant}
                />
              ) : undefined
            }
          />
        </div>

        <div className="flex flex-row items-center justify-between px-2 pt-4 gap-8">
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
