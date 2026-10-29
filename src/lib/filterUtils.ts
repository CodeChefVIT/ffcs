import { timetableDisplayData } from '@/lib/type';
import { getAllSlots, getSlot } from './slots';

// The timetable grid starts at 8:00 and every column is 10 minutes, so a slot's columns give its times.
const toMinutes = (col: number) => 480 + (col - 2) * 10;
const allSpans = getAllSlots().flatMap(name => getSlot(name));
// The times a class can start or end at, which the time range snaps to
export const START_TIMES = [...new Set(allSpans.map(s => toMinutes(s.colStart)))].sort(
  (a, b) => a - b
);
export const END_TIMES = [...new Set(allSpans.map(s => toMinutes(s.colEnd)))].sort((a, b) => a - b);

export interface FilterEvalResult {
  sameBuilding: boolean;
  morningOnly: boolean;
  eveningOnly: boolean;
  mixOnly: boolean;
  // Minutes from midnight of the first class start and the last class end
  start: number;
  end: number;
  labDays: number;
}

export function evaluateFilters(tt: timetableDisplayData[]): FilterEvalResult {
  const atomic = tt.flatMap(item => extractAtomicSlots(item.slotName));
  const buildings = tt
    .map(item => {
      const venue = (item.venue ?? '').trim().toUpperCase();
      // NIL explicitly means no physical location; missing venues remain unknown.
      if (venue === 'NIL') return null;
      return venue.match(/^[A-Z]+/)?.[0] ?? '';
    })
    .filter((building): building is string => building !== null);

  const sameBuilding =
    tt.length > 0 && buildings.every(building => building !== '') && new Set(buildings).size <= 1;

  // Theory-slot time classification: lab slots (L\d+) are excluded
  const theorySlots = atomic.filter(s => !/^L\d+$/i.test(s));
  const hasMorning = theorySlots.some(s => /1$/.test(s));
  const hasEvening = theorySlots.some(s => /2$/.test(s));

  // Lab rows sit under each day's theory row, three rows per day from row 4
  const spans = atomic.flatMap(s => getSlot(s));
  const labDays = new Set(
    spans.filter(s => /^L\d/.test(s.slotName)).map(s => Math.floor((s.rowStart - 4) / 3))
  ).size;

  return {
    sameBuilding,
    start: spans.length ? Math.min(...spans.map(s => toMinutes(s.colStart))) : START_TIMES[0],
    end: spans.length
      ? Math.max(...spans.map(s => toMinutes(s.colEnd)))
      : END_TIMES[END_TIMES.length - 1],
    labDays,
    morningOnly: hasMorning && !hasEvening,
    eveningOnly: !hasMorning && hasEvening,
    mixOnly: hasMorning && hasEvening,
  };
}

function extractAtomicSlots(slotName?: string): string[] {
  if (!slotName) return [];
  return slotName
    .split(/__|\+|,\s*/)
    .map(s => s.trim())
    .filter(Boolean);
}
