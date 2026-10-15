import type { Row } from "./supabase";
import { parseYmd } from "./date";

export type Status = "신규" | "처리 중" | "완료";
export type Method = "원격" | "방문" | "미분류";

export type Task = {
  id: number;
  no: string;         // 순
  date: string;       // 접수일 (시트 원문)
  ymd: string | null; // 접수일을 YYYY-MM-DD 로 바꾼 값
  company: string;    // 상호
  location: string;   // 지역
  item: string;       // 품목
  symptom: string;    // 증상
  detail: string;     // 처리내용
  handler: string;    // 처리자
  receiver: string;   // 접수자
  status: Status;
  method: Method;
};

const s = (r: Row, key: string): string => {
  const v = r[key];
  return v === null || v === undefined ? "" : String(v).trim();
};

/* =====================================================
   ★ 처리여부 값 해석 규칙 (여기만 고치면 됩니다)
   구글시트 '처리여부' 칸에 실제로 적는 단어에 맞춰 수정하세요.
   ===================================================== */
export function statusOf(r: Row): Status {
  const v = s(r, "처리여부");
  if (!v) return "신규";
  if (/미처리|미완|미결|접수|신규/.test(v)) return "신규";
  if (/완료|종결|처리됨|처리완료|^O$|^o$|^Y$|^y$/.test(v)) return "완료";
  if (/중|진행|보류|대기|예정/.test(v)) return "처리 중";
  return "처리 중";
}

/* =====================================================
   ★ 원격/방문 구분 규칙 (처리내용·증상·비고에서 단어 찾기)
   ===================================================== */
export function methodOf(r: Row): Method {
  const text = `${s(r, "처리내용")} ${s(r, "증상")} ${s(r, "비고")}`;
  if (/원격|애니데스크|anydesk|팀뷰어|teamviewer|전화\s?안내|전화\s?지원|전화\s?처리/i.test(text)) return "원격";
  if (/방문|출동|현장|입고|직접/.test(text)) return "방문";
  return "미분류";
}

export function toTask(r: Row): Task {
  return {
    id: r.id,
    no: s(r, "순"),
    date: s(r, "접수일"),
    ymd: parseYmd(s(r, "접수일")),
    company: s(r, "상호"),
    location: s(r, "지역"),
    item: s(r, "품목") || s(r, "기종") || "기타",
    symptom: s(r, "증상"),
    detail: s(r, "처리내용"),
    handler: s(r, "처리자") || "미배정",
    receiver: s(r, "접수자"),
    status: statusOf(r),
    method: methodOf(r),
  };
}

export function toTasks(rows: Row[]): Task[] {
  // 최신(아래쪽 행)이 위로 오도록 뒤집기
  return rows.map(toTask).reverse();
}

export function countBy<T>(list: T[], pick: (x: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of list) {
    const k = pick(x);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export function summary(tasks: Task[]) {
  return {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "완료").length,
    doing: tasks.filter((t) => t.status === "처리 중").length,
    fresh: tasks.filter((t) => t.status === "신규").length,
    remote: tasks.filter((t) => t.method === "원격").length,
    visit: tasks.filter((t) => t.method === "방문").length,
    unknown: tasks.filter((t) => t.method === "미분류").length,
  };
}

export function handlerStats(tasks: Task[]) {
  const map: Record<string, { name: string; 신규: number; "처리 중": number; 완료: number; total: number }> = {};
  for (const t of tasks) {
    if (!map[t.handler]) map[t.handler] = { name: t.handler, 신규: 0, "처리 중": 0, 완료: 0, total: 0 };
    map[t.handler][t.status] += 1;
    map[t.handler].total += 1;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}

/* 직원 × 품목 경험표 + 신규 건 추천 배정 */
export function buildAssignment(tasks: Task[]) {
  const handlers = Array.from(new Set(tasks.map((t) => t.handler).filter((h) => h !== "미배정")));
  const itemCount = countBy(tasks, (t) => t.item);
  const items = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k);

  const matrix: Record<string, Record<string, number>> = {};
  const open: Record<string, number> = {};
  for (const h of handlers) {
    matrix[h] = {};
    open[h] = 0;
  }
  for (const t of tasks) {
    if (t.handler === "미배정") continue;
    matrix[t.handler][t.item] = (matrix[t.handler][t.item] ?? 0) + 1;
    if (t.status !== "완료") open[t.handler] += 1;
  }

  // 미배정 또는 신규 건 → 해당 품목을 가장 적게 해본 직원을 추천 (동률이면 진행 업무가 적은 직원)
  const targets = tasks.filter((t) => t.handler === "미배정" || t.status === "신규");
  const load = { ...open };
  const suggestions = targets.map((t) => {
    let best = "";
    let bestExp = Infinity;
    let bestLoad = Infinity;
    for (const h of handlers) {
      const exp = matrix[h][t.item] ?? 0;
      const l = load[h];
      if (exp < bestExp || (exp === bestExp && l < bestLoad)) {
        best = h;
        bestExp = exp;
        bestLoad = l;
      }
    }
    if (best) load[best] += 1;
    return { task: t, suggested: best, experience: best ? bestExp : 0 };
  });

  return { handlers, items, matrix, open, suggestions };
}

/* 품목별 체크리스트 재료 (처리내용 모음) */
export function buildChecklists(tasks: Task[]) {
  const groups: Record<string, Task[]> = {};
  for (const t of tasks) {
    if (!groups[t.item]) groups[t.item] = [];
    groups[t.item].push(t);
  }
  return Object.entries(groups)
    .map(([item, list]) => {
      const remote = list.filter((t) => t.method === "원격");
      const visit = list.filter((t) => t.method === "방문");
      const steps = Array.from(
        new Set(
          (remote.length ? remote : list)
            .filter((t) => t.detail)
            .map((t) => t.detail.replace(/\s+/g, " ").slice(0, 80))
        )
      ).slice(0, 5);
      const symptoms = Array.from(
        new Set(list.filter((t) => t.symptom).map((t) => t.symptom.replace(/\s+/g, " ").slice(0, 60)))
      ).slice(0, 4);
      return { item, total: list.length, remote: remote.length, visit: visit.length, steps, symptoms };
    })
    .sort((a, b) => b.total - a.total);
}
