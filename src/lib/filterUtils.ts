import { timetableDisplayData } from '@/lib/type';

export interface FilterEvalResult {
  sameBuilding: boolean;
  morningOnly: boolean;
  eveningOnly: boolean;
  mixOnly: boolean;
}

export function evaluateFilters(tt: timetableDisplayData[]): FilterEvalResult {
  const atomic = tt.flatMap(item => extractAtomicSlots(item.slotName));
  const venues = tt.map(item => item.venue).filter(Boolean) as string[];

  // sameBuilding: all venues share the same building prefix
  let sameBuilding = false;
  if (venues.length > 0) {
    const buildings = venues
      .map(v => (v || '').toString().match(/^[A-Za-z]+/)?.[0] || '')
      .filter(Boolean);
    if (buildings.length > 0) {
      const set = new Set(buildings.map(b => b.toUpperCase()));
      if (set.size === 1) sameBuilding = true;
    }
  }

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
