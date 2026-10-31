import { timetableDisplayData } from './type';
import { evaluateFilters, FilterEvalResult } from './filterUtils';

// All faculty combinations that share one slot layout
export type timetableGroup = {
  layoutKey: string;
  variants: timetableDisplayData[][];
};

// Same courses in the same slots => same layout, whoever teaches them
export function getLayoutKey(tt: timetableDisplayData[]): string {
  return tt
    .map(item => `${item.courseCode}|${item.slotName}`)
    .sort()
    .join(';');
}

// Layout plus faculty, used to drop exact duplicates inside a group
function getVariantKey(tt: timetableDisplayData[]): string {
  return tt
    .map(item => `${item.courseCode}|${item.slotName}|${item.facultyName}`)
    .sort()
    .join(';');
}

// Map keeps insertion order, so groups and variants stay in generation (priority) order
export function groupTimetablesByLayout(timetables: timetableDisplayData[][]): timetableGroup[] {
  const groups = new Map<string, timetableGroup>();
  const seenVariants = new Set<string>();
  for (const tt of timetables) {
    const variantKey = getVariantKey(tt);
    if (seenVariants.has(variantKey)) continue;
    seenVariants.add(variantKey);

    const key = getLayoutKey(tt);
    const existing = groups.get(key);
    if (existing) existing.variants.push(tt);
    else groups.set(key, { layoutKey: key, variants: [tt] });
  }
  return Array.from(groups.values());
}

// Keeps only the variants taught (in part) by the given faculty; drops groups left empty
export function filterGroupsByFaculty(
  groups: timetableGroup[],
  facultyName: string
): timetableGroup[] {
  if (!facultyName) return groups;
  return groups
    .map(group => ({
      ...group,
      variants: group.variants.filter(tt =>
        tt.some(item => (item.facultyName || 'Unknown') === facultyName)
      ),
    }))
    .filter(group => group.variants.length > 0);
}

// Time filters depend only on slots, so they are the same for every variant.
// Same Building depends on venue, so a group passes if any of its variants does.
export function evaluateGroupFilters(group: timetableGroup): FilterEvalResult {
  const results = group.variants.map(evaluateFilters);
  return {
    sameBuilding: results.some(r => r.sameBuilding),
    morningOnly: results[0].morningOnly,
    eveningOnly: results[0].eveningOnly,
    mixOnly: results[0].mixOnly,
    start: results[0].start,
    end: results[0].end,
    labDays: results[0].labDays,
  };
}
