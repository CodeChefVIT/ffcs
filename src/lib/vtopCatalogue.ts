export type FacultyEntry = { slot: string; faculty: string; venue: string };
export type FacultyData = Record<string, Record<string, Record<string, FacultyEntry[]>>>;
export type VtopCatalogue = {
  schemaVersion: 1;
  source: 'vtop';
  catalogueId: string;
  capturedAt: string;
  term: string;
  categories: Record<string, Record<string, FacultyEntry[]>>;
};
export const VTOP_CACHE_KEY = 'ffcs:vtop:catalogue:v1';
export const VTOP_CHANNEL = 'ffcs-vtop-v1';

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

// Validate at the website boundary and copy only course fields into browser storage.
export function parseVtopCatalogue(value: unknown): VtopCatalogue {
  if (
    !record(value) ||
    value.schemaVersion !== 1 ||
    value.source !== 'vtop' ||
    typeof value.catalogueId !== 'string' ||
    !/^[a-f0-9]{64}$/.test(value.catalogueId) ||
    typeof value.capturedAt !== 'string' ||
    !Number.isFinite(Date.parse(value.capturedAt)) ||
    typeof value.term !== 'string' ||
    value.term.length > 200 ||
    !record(value.categories)
  ) {
    throw new Error('The extension returned an invalid course catalogue. Sync again in VTOP.');
  }
  const categories: VtopCatalogue['categories'] = Object.create(null);
  const groups = Object.entries(value.categories);
  if (!groups.length || groups.length > 100) throw new Error('Invalid VTOP categories.');
  let count = 0;
  const slotPattern =
    /^(?:NIL|(?:L\d{1,2}|[A-K][12]|T[A-K]{1,2}[12]|V\d{1,2})(?:\+(?:L\d{1,2}|[A-K][12]|T[A-K]{1,2}[12]|V\d{1,2}))*)$/;
  for (const [category, subjects] of groups) {
    if (!category || category.length > 200 || !record(subjects))
      throw new Error('Invalid VTOP category.');
    const group: Record<string, FacultyEntry[]> = Object.create(null);
    for (const [subject, entries] of Object.entries(subjects)) {
      if (
        ++count > 5000 ||
        subject.length > 500 ||
        !/^[A-Z]{2,8}\d{3,5}[A-Z]? - .+$/i.test(subject) ||
        !Array.isArray(entries) ||
        !entries.length ||
        entries.length > 3000
      )
        throw new Error('Invalid VTOP course.');
      group[subject] = entries.map((entry: unknown) => {
        if (
          !record(entry) ||
          typeof entry.slot !== 'string' ||
          !slotPattern.test(entry.slot) ||
          typeof entry.faculty !== 'string' ||
          !entry.faculty ||
          entry.faculty.length > 200 ||
          typeof entry.venue !== 'string' ||
          entry.venue.length > 200
        )
          throw new Error('Invalid VTOP course slots.');
        return { slot: entry.slot, faculty: entry.faculty, venue: entry.venue };
      });
    }
    categories[category] = group;
  }
  if (!count) throw new Error('No VTOP courses were captured.');
  return {
    schemaVersion: 1,
    source: 'vtop',
    catalogueId: value.catalogueId,
    capturedAt: value.capturedAt,
    term: value.term,
    categories,
  };
}

export type VtopStatus = {
  running?: boolean;
  completed?: number;
  total?: number;
  stage?: 'categories' | 'courses';
  capturedAt?: string | null;
  error?: string;
};
type ExtensionResponse = VtopStatus & {
  ok: boolean;
  error?: string;
  dataset?: unknown;
  capturedAt?: string | null;
};
export function requestVtopExtension(
  type: 'GET_DATA' | 'GET_STATUS' | 'CLEAR_DATA'
): Promise<ExtensionResponse> {
  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('message', receive);
    };
    const receive = (event: MessageEvent) => {
      const response = event.data;
      if (
        event.source !== window ||
        event.origin !== window.location.origin ||
        response?.channel !== VTOP_CHANNEL ||
        response.direction !== 'response' ||
        response.requestId !== requestId
      )
        return;
      cleanup();
      if (response.ok) resolve(response);
      else reject(new Error(response.error || 'Could not connect to the VTOP extension.'));
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(
        new Error(
          'Install the extension, then refresh this page and VTOP. Use the same browser profile.'
        )
      );
    }, 3000);
    window.addEventListener('message', receive);
    window.postMessage(
      { channel: VTOP_CHANNEL, direction: 'request', requestId, type },
      window.location.origin
    );
  });
}
