const pad = (n: number) => String(n).padStart(2, "0");

function valid(y: number, m: number, d: number): boolean {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** 구글시트 접수일 글자를 YYYY-MM-DD 로 바꿉니다. 못 읽으면 null */
export function parseYmd(raw: string, nowYear = new Date().getFullYear()): string | null {
  const t = (raw ?? "").trim();
  if (!t) return null;

  let y = 0;
  let mo = 0;
  let d = 0;
  let m: RegExpMatchArray | null;

  if ((m = t.match(/(\d{4})\s*[-./년]\s*(\d{1,2})\s*[-./월]\s*(\d{1,2})/))) {
    y = +m[1]; mo = +m[2]; d = +m[3];
  } else if ((m = t.match(/^(\d{2})\s*[-./]\s*(\d{1,2})\s*[-./]\s*(\d{1,2})/))) {
    y = 2000 + +m[1]; mo = +m[2]; d = +m[3];
  } else if ((m = t.match(/(\d{1,2})\s*[-./월]\s*(\d{1,2})/))) {
    y = nowYear; mo = +m[1]; d = +m[2];
  } else {
    return null;
  }
  return valid(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : null;
}

export function todayYmd(): string {
  const n = new Date();
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
}

export function nowHm(): string {
  const n = new Date();
  return `${pad(n.getHours())}:${pad(n.getMinutes())}`;
}

export function daysBetween(fromYmd: string, toYmd: string): number {
  const [a, b, c] = fromYmd.split("-").map(Number);
  const [x, y, z] = toYmd.split("-").map(Number);
  return Math.round((Date.UTC(x, y - 1, z) - Date.UTC(a, b - 1, c)) / 86400000);
}

export function ymd(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}
