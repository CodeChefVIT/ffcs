import { timetableDisplayData } from '@/lib/type';

export interface FilterEvalResult {
  sameBuilding: boolean;
  morningOnly: boolean;
  eveningOnly: boolean;
  mixOnly: boolean;
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

  return {
    sameBuilding,
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
