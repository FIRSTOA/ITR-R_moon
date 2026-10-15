export type WorkStatus = "예정" | "진행중" | "완료";
export type CheckItem = { text: string; done: boolean };

export type Work = {
  id: number;
  as_no: string | null;
  work_date: string;
  start_time: string | null;
  end_time: string | null;
  status: WorkStatus;
  category: string | null;
  work_type: string | null;
  grade: string | null;
  company: string | null;
  assignee: string | null;
  summary: string | null;
  checklist: CheckItem[];
  work_minutes: number | null;
  bottleneck: string | null;
  completed_at: string | null;
};

export const STATUS_LIST: WorkStatus[] = ["예정", "진행중", "완료"];
export const STATUS_ICON: Record<WorkStatus, string> = { 예정: "⏳", 진행중: "▶", 완료: "✅" };

export function normalizeChecklist(v: unknown): CheckItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      const o = x as { text?: unknown; done?: unknown };
      return { text: String(o?.text ?? "").trim(), done: Boolean(o?.done) };
    })
    .filter((x) => x.text !== "");
}

export function toWork(r: Record<string, unknown>): Work {
  const str = (k: string): string | null => {
    const v = r[k];
    return v === null || v === undefined || v === "" ? null : String(v);
  };
  const st = str("status");
  return {
    id: Number(r.id),
    as_no: str("as_no"),
    work_date: str("work_date") ?? "",
    start_time: str("start_time"),
    end_time: str("end_time"),
    status: st === "진행중" || st === "완료" ? st : "예정",
    category: str("category"),
    work_type: str("work_type"),
    grade: str("grade"),
    company: str("company"),
    assignee: str("assignee"),
    summary: str("summary"),
    checklist: normalizeChecklist(r.checklist),
    work_minutes: r.work_minutes === null || r.work_minutes === undefined ? null : Number(r.work_minutes),
    bottleneck: str("bottleneck"),
    completed_at: str("completed_at"),
  };
}

/** [▶ 진행중] [13:30 ~ 14:30][효율성 / 내근B등급] 상호 ➔ 담당자 / 정리 */
export function workLine(w: Work): string {
  const time = w.start_time ? `[${w.start_time} ~ ${w.end_time ?? ""}]` : "";
  const typeGrade = `${w.work_type ?? ""}${w.grade ? `${w.grade}등급` : ""}`;
  const tag = [w.category, typeGrade].filter((x) => x && x.length > 0).join(" / ");
  const head = `[${STATUS_ICON[w.status]} ${w.status}] ${time}${tag ? `[${tag}]` : ""}`.trim();
  const who = w.assignee ? ` ➔ ${w.assignee}` : "";
  const sum = w.summary ? ` / ${w.summary.split("\n")[0]}` : "";
  return `${head} ${w.company ?? ""}${who}${sum}`.replace(/\s+/g, " ").trim();
}

export function minutesBetween(start: string, end: string): number | null {
  const p = (s: string) => {
    const m = s.match(/^(\d{1,2}):(\d{2})$/);
    return m ? +m[1] * 60 + +m[2] : null;
  };
  const a = p(start);
  const b = p(end);
  if (a === null || b === null || b < a) return null;
  return b - a;
}

export function fmtMinutes(min: number | null): string {
  if (min === null || min === undefined) return "-";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}시간 ${m}분` : `${m}분`;
}
