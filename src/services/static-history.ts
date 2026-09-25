export interface StaticHistoryEntry {
  id: string;
  kind: string;
  label: string;
  payload: string;
  fgColor: string;
  bgColor: string;
  createdAt: string;
}

const KEY = "inoqr-static-history";
const CAP = 24;

export function loadStaticHistory(): StaticHistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StaticHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(entries: StaticHistoryEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, CAP)));
  } catch {
    /* storage full or unavailable — history just won't persist */
  }
}

/** Record an exported static QR. Same kind+payload refreshes to the top. */
export function recordStaticEntry(entry: Omit<StaticHistoryEntry, "id" | "createdAt">): void {
  if (!entry.payload.trim()) return;
  const now = new Date().toISOString();
  const rest = loadStaticHistory().filter(
    (e) => !(e.kind === entry.kind && e.payload === entry.payload),
  );
  persist([{ ...entry, id: `static-${Date.now()}`, createdAt: now }, ...rest]);
}

export function removeStaticEntry(id: string): StaticHistoryEntry[] {
  const next = loadStaticHistory().filter((e) => e.id !== id);
  persist(next);
  return next;
}
