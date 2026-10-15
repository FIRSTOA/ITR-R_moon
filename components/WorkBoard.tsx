"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../lib/supabase";
import type { Task } from "../lib/analyze";
import { nowHm, todayYmd } from "../lib/date";
import {
  fmtMinutes,
  minutesBetween,
  STATUS_LIST,
  workLine,
  type CheckItem,
  type Work,
  type WorkStatus,
} from "../lib/work";

type Form = {
  as_no: string;
  work_date: string;
  start_time: string;
  end_time: string;
  status: WorkStatus;
  category: string;
  work_type: string;
  grade: string;
  company: string;
  assignee: string;
  summary: string;
  checklist: string;
  work_minutes: string;
  bottleneck: string;
};

const emptyForm = (): Form => ({
  as_no: "",
  work_date: "",
  start_time: "",
  end_time: "",
  status: "예정",
  category: "",
  work_type: "내근",
  grade: "",
  company: "",
  assignee: "",
  summary: "",
  checklist: "",
  work_minutes: "",
  bottleneck: "",
});

const TABS = ["미완료", "예정", "진행중", "완료", "전체"] as const;
const CATEGORY_HINTS = ["효율성", "장애처리", "정기점검", "신규설치", "교육", "기타"];

const STATUS_STYLE: Record<WorkStatus, string> = {
  예정: "bg-slate-100 text-slate-700",
  진행중: "bg-amber-100 text-amber-800",
  완료: "bg-emerald-100 text-emerald-700",
};

export default function WorkBoard({
  works,
  openTasks,
  people,
}: {
  works: Work[];
  openTasks: Task[];
  people: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(emptyForm);
  const [editing, setEditing] = useState<Work | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("미완료");
  const [person, setPerson] = useState("전체");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // 오늘 날짜는 브라우저에서 채웁니다.
  useEffect(() => {
    setForm((f) => (f.work_date ? f : { ...f, work_date: todayYmd() }));
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const list = useMemo(() => {
    const filtered = works.filter((w) => {
      if (person !== "전체" && w.assignee !== person) return false;
      if (tab === "미완료") return w.status !== "완료";
      if (tab === "전체") return true;
      return w.status === tab;
    });
    const asc = tab !== "완료" && tab !== "전체";
    return [...filtered].sort((a, b) => {
      const ka = `${a.work_date} ${a.start_time ?? ""}`;
      const kb = `${b.work_date} ${b.start_time ?? ""}`;
      return asc ? ka.localeCompare(kb) : kb.localeCompare(ka);
    });
  }, [works, tab, person]);

  const counts = useMemo(
    () => ({
      예정: works.filter((w) => w.status === "예정").length,
      진행중: works.filter((w) => w.status === "진행중").length,
      완료: works.filter((w) => w.status === "완료").length,
      병목: works.filter((w) => w.bottleneck && w.status !== "완료").length,
    }),
    [works]
  );

  function pickTask(no: string) {
    const t = openTasks.find((x) => x.no === no);
    setForm((f) => ({
      ...f,
      as_no: no,
      company: t ? t.company || f.company : f.company,
      assignee: f.assignee || (t && t.handler !== "미배정" ? t.handler : ""),
      summary: f.summary || (t ? t.symptom : ""),
    }));
  }

  function startEdit(w: Work) {
    setEditing(w);
    setMsg(null);
    setForm({
      as_no: w.as_no ?? "",
      work_date: w.work_date,
      start_time: w.start_time ?? "",
      end_time: w.end_time ?? "",
      status: w.status,
      category: w.category ?? "",
      work_type: w.work_type ?? "내근",
      grade: w.grade ?? "",
      company: w.company ?? "",
      assignee: w.assignee ?? "",
      summary: w.summary ?? "",
      checklist: w.checklist.map((c) => c.text).join("\n"),
      work_minutes: w.work_minutes === null ? "" : String(w.work_minutes),
      bottleneck: w.bottleneck ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditing(null);
    setForm({ ...emptyForm(), work_date: todayYmd() });
  }

  function buildChecklist(text: string, old: CheckItem[]): CheckItem[] {
    const doneMap = new Map(old.map((c) => [c.text, c.done]));
    return text
      .split("\n")
      .map((l) => l.replace(/^[-•\s]+/, "").trim())
      .filter(Boolean)
      .map((t) => ({ text: t, done: doneMap.get(t) ?? false }));
  }

  async function save() {
    setMsg(null);
    if (!form.company.trim()) return setMsg({ ok: false, text: "상호(고객명)를 입력하세요." });
    if (!form.assignee.trim()) return setMsg({ ok: false, text: "담당자를 입력하세요." });

    const minutes = form.work_minutes.trim()
      ? Number(form.work_minutes)
      : minutesBetween(form.start_time, form.end_time);

    const payload = {
      as_no: form.as_no || null,
      work_date: form.work_date || todayYmd(),
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      status: form.status,
      category: form.category.trim() || null,
      work_type: form.work_type || null,
      grade: form.grade || null,
      company: form.company.trim(),
      assignee: form.assignee.trim(),
      summary: form.summary.trim() || null,
      checklist: buildChecklist(form.checklist, editing?.checklist ?? []),
      work_minutes: minutes !== null && !Number.isNaN(minutes) ? minutes : null,
      bottleneck: form.bottleneck.trim() || null,
      completed_at: form.status === "완료" ? editing?.completed_at ?? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    setBusy(true);
    try {
      const sb = getSupabase();
      const q = editing
        ? sb.from("IT_AS_WORK").update(payload).eq("id", editing.id).select("id")
        : sb.from("IT_AS_WORK").insert(payload).select("id");
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error("저장되지 않았습니다. Supabase 권한(RLS) 설정을 확인하세요.");
      setMsg({ ok: true, text: editing ? "수정했습니다." : "등록했습니다." });
      resetForm();
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  }

  async function patch(w: Work, changes: Record<string, unknown>, okText: string) {
    setMsg(null);
    setBusy(true);
    try {
      const { data, error } = await getSupabase()
        .from("IT_AS_WORK")
        .update({ ...changes, updated_at: new Date().toISOString() })
        .eq("id", w.id)
        .select("id");
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error("저장되지 않았습니다. Supabase 권한(RLS) 설정을 확인하세요.");
      setMsg({ ok: true, text: okText });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  }

  const startWork = (w: Work) =>
    patch(w, { status: "진행중", start_time: w.start_time ?? nowHm(), completed_at: null }, "진행중으로 변경했습니다.");

  function finishWork(w: Work) {
    const end = w.end_time ?? nowHm();
    const minutes = w.work_minutes ?? (w.start_time ? minutesBetween(w.start_time, end) : null);
    return patch(
      w,
      { status: "완료", end_time: end, work_minutes: minutes, completed_at: new Date().toISOString() },
      "완료 처리했습니다."
    );
  }

  const reopenWork = (w: Work) => patch(w, { status: "진행중", completed_at: null }, "다시 진행중으로 바꿨습니다.");

  const toggleCheck = (w: Work, idx: number) =>
    patch(
      w,
      { checklist: w.checklist.map((c, i) => (i === idx ? { ...c, done: !c.done } : c)) },
      "체크리스트를 저장했습니다."
    );

  const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";
  const label = "block text-xs font-semibold text-slate-500 mb-1";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl bg-slate-100 p-3"><div className="text-xs">예정</div><div className="text-2xl font-bold">{counts.예정}건</div></div>
        <div className="rounded-xl bg-amber-50 p-3 text-amber-800"><div className="text-xs">진행중</div><div className="text-2xl font-bold">{counts.진행중}건</div></div>
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><div className="text-xs">완료</div><div className="text-2xl font-bold">{counts.완료}건</div></div>
        <div className="rounded-xl bg-rose-50 p-3 text-rose-700"><div className="text-xs">병목 기록(미완료)</div><div className="text-2xl font-bold">{counts.병목}건</div></div>
      </div>

      {/* 입력·수정 폼 */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">{editing ? `업무 수정 (No.${editing.id})` : "새 업무 입력"}</h2>
          {editing && (
            <button className="text-sm text-slate-500 underline" onClick={resetForm}>수정 취소</button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className={label}>연결할 접수 (선택 · 미처리 접수만 표시)</label>
            <select className={input} value={form.as_no} onChange={(e) => pickTask(e.target.value)}>
              <option value="">연결 안 함 (직접 입력)</option>
              {openTasks.map((t) => (
                <option key={t.id} value={t.no}>
                  {t.no} · {t.company} · {t.symptom.slice(0, 20)}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={label}>상호(고객명) *</label>
            <input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="예: 아이에스건설" />
          </div>

          <div>
            <label className={label}>날짜</label>
            <input type="date" className={input} value={form.work_date} onChange={(e) => set("work_date", e.target.value)} />
          </div>
          <div>
            <label className={label}>시작</label>
            <input type="time" className={input} value={form.start_time} onChange={(e) => set("start_time", e.target.value)} />
          </div>
          <div>
            <label className={label}>종료</label>
            <input type="time" className={input} value={form.end_time} onChange={(e) => set("end_time", e.target.value)} />
          </div>
          <div>
            <label className={label}>상태</label>
            <select className={input} value={form.status} onChange={(e) => set("status", e.target.value as WorkStatus)}>
              {STATUS_LIST.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={label}>담당자 *</label>
            <input className={input} list="people" value={form.assignee} onChange={(e) => set("assignee", e.target.value)} placeholder="예: 문종주" />
            <datalist id="people">{people.map((p) => <option key={p} value={p} />)}</datalist>
          </div>
          <div>
            <label className={label}>목적</label>
            <input className={input} list="cats" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="예: 효율성" />
            <datalist id="cats">{CATEGORY_HINTS.map((p) => <option key={p} value={p} />)}</datalist>
          </div>
          <div>
            <label className={label}>근무 구분</label>
            <select className={input} value={form.work_type} onChange={(e) => set("work_type", e.target.value)}>
              <option>내근</option>
              <option>외근</option>
            </select>
          </div>
          <div>
            <label className={label}>등급</label>
            <select className={input} value={form.grade} onChange={(e) => set("grade", e.target.value)}>
              <option value="">선택 안 함</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={label}>업무 정리 (외근 정리 등)</label>
            <textarea className={input} rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>체크리스트 (한 줄에 한 항목)</label>
            <textarea className={input} rows={3} value={form.checklist} onChange={(e) => set("checklist", e.target.value)} placeholder={"프린터 전원 확인\n드라이버 재설치\n테스트 출력"} />
          </div>

          <div>
            <label className={label}>작업시간(분) · 비우면 시작~종료로 자동 계산</label>
            <input type="number" min={0} className={input} value={form.work_minutes} onChange={(e) => set("work_minutes", e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <label className={label}>병목 (막힌 점·지연 사유)</label>
            <input className={input} value={form.bottleneck} onChange={(e) => set("bottleneck", e.target.value)} placeholder="예: 고객 관리자 부재로 접속 불가" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={busy}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "저장 중..." : editing ? "수정 저장" : "등록"}
          </button>
          {msg && <span className={`text-sm ${msg.ok ? "text-emerald-700" : "text-rose-700"}`}>{msg.text}</span>}
        </div>
      </div>

      {/* 목록 */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm ${tab === t ? "bg-slate-800 text-white" : "bg-white shadow-sm"}`}
            >
              {t}
            </button>
          ))}
          <select className="ml-auto rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm" value={person} onChange={(e) => setPerson(e.target.value)}>
            <option>전체</option>
            {people.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {list.map((w) => (
            <div key={w.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className={`mr-2 rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[w.status]}`}>{w.status}</span>
                  <span className="text-xs text-slate-400">{w.work_date}{w.as_no ? ` · 접수 ${w.as_no}` : ""}</span>
                  <div className="mt-1 font-medium">{workLine(w)}</div>
                </div>
                <div className="flex gap-1.5">
                  {w.status === "예정" && (
                    <button disabled={busy} onClick={() => startWork(w)} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">▶ 시작</button>
                  )}
                  {w.status !== "완료" && (
                    <button disabled={busy} onClick={() => finishWork(w)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">✅ 완료</button>
                  )}
                  {w.status === "완료" && (
                    <button disabled={busy} onClick={() => reopenWork(w)} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs disabled:opacity-50">다시 진행</button>
                  )}
                  <button onClick={() => startEdit(w)} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs">수정</button>
                </div>
              </div>

              <div className="mt-2 grid gap-3 text-sm md:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">작업시간</div>
                  {fmtMinutes(w.work_minutes)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">병목</div>
                  {w.bottleneck ? <span className="text-amber-700">{w.bottleneck}</span> : <span className="text-slate-400">-</span>}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">체크리스트</div>
                  {w.checklist.length === 0 && <span className="text-slate-400">-</span>}
                  <ul className="space-y-0.5">
                    {w.checklist.map((c, i) => (
                      <li key={i}>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input type="checkbox" checked={c.done} disabled={busy} onChange={() => toggleCheck(w, i)} />
                          <span className={c.done ? "text-slate-400 line-through" : ""}>{c.text}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-400">표시할 업무가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
