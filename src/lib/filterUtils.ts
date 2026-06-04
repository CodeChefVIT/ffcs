import { timetableDisplayData } from '@/lib/type';

export const CLOSE_ROOM_RANGE = 30;
export const MORNING_LAB_MAX = 30;
export const EVENING_LAB_MIN = 31;

export interface FilterEvalResult {
  sameBuilding: boolean;
  closeEnough: boolean;
  noMix: boolean;
}

export function evaluateFilters(tt: timetableDisplayData[]): FilterEvalResult {
  const atomic = tt.flatMap(item => extractAtomicSlots(item.slotName));
  const venues = tt.map(item => item.venue).filter(Boolean) as string[];

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

  let closeEnough = false;
  if (venues.length > 0) {
    const nums = venues
      .map(v => {
        const m = v.match(/(\d+)/);
        return m ? parseInt(m[0], 10) : NaN;
      })
      .filter(n => !isNaN(n));
    if (nums.length > 0) {
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      closeEnough = max - min <= CLOSE_ROOM_RANGE;
    }
  }

  const hasMorning = atomic.some(s => slotIsMorning(s));
  const hasEvening = atomic.some(s => slotIsEvening(s));
  const noMix = !(hasMorning && hasEvening);

  return { sameBuilding, closeEnough, noMix };
}

function extractAtomicSlots(slotName?: string) {
  if (!slotName) return [] as string[];
  return slotName
    .split(/__|\+|,\s*/)
    .map(s => s.trim())
    .filter(Boolean);
}

function slotIsMorning(slot: string) {
  if (!slot) return false;
  if (/\d$/.test(slot)) {
    return /1$/.test(slot);
  }
  const m = slot.match(/L(\d+)/i);
  if (m) {
    const n = parseInt(m[1], 10);
    return !isNaN(n) && n <= MORNING_LAB_MAX;
  }
  return false;
}

function slotIsEvening(slot: string) {
  if (!slot) return false;
  if (/\d$/.test(slot)) {
    return /2$/.test(slot);
  }
  const m = slot.match(/L(\d+)/i);
  if (m) {
    const n = parseInt(m[1], 10);
    return !isNaN(n) && n >= EVENING_LAB_MIN;
  }
  return false;
}
