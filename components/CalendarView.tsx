"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Task } from "../lib/analyze";
import { daysBetween, todayYmd, ymd } from "../lib/date";
import { workLine, type Work } from "../lib/work";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

const WORK_CHIP: Record<string, string> = {
  예정: "bg-slate-100 text-slate-700",
  진행중: "bg-amber-100 text-amber-800",
  완료: "bg-emerald-100 text-emerald-700",
};

type DayItems = { works: Work[]; tasks: Task[] };

export default function CalendarView({ openTasks, works }: { openTasks: Task[]; works: Work[] }) {
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [today, setToday] = useState("");

  // 날짜는 브라우저(한국 시간)에서 정합니다.
  useEffect(() => {
    const t = todayYmd();
    setToday(t);
    setSelected(t);
    const [y, m] = t.split("-").map(Number);
    setCursor({ y, m });
  }, []);

  const shownWorks = useMemo(() => (showDone ? works : works.filter((w) => w.status !== "완료")), [works, showDone]);

  const byDate = useMemo(() => {
    const map: Record<string, DayItems> = {};
    const get = (k: string) => (map[k] ??= { works: [], tasks: [] });
    for (const w of shownWorks) if (w.work_date) get(w.work_date).works.push(w);
    for (const t of openTasks) if (t.ymd) get(t.ymd).tasks.push(t);
    return map;
  }, [shownWorks, openTasks]);

  const noDate = useMemo(() => openTasks.filter((t) => !t.ymd), [openTasks]);
  const backlog = useMemo(
    () => openTasks.filter((t) => t.ymd).sort((a, b) => (a.ymd as string).localeCompare(b.ymd as string)),
    [openTasks]
  );

  if (!cursor) return <div className="text-slate-400 text-sm">달력을 불러오는 중...</div>;

  const { y, m } = cursor;
  const firstWeekday = new Date(y, m - 1, 1).getDay();
  const lastDay = new Date(y, m, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const move = (diff: number) => {
    const d = new Date(y, m - 1 + diff, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() + 1 });
  };

  const sel = selected ? byDate[selected] ?? { works: [], tasks: [] } : null;

  return (
    <div className="grid xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button className="rounded-lg bg-white px-3 py-1.5 text-sm shadow-sm" onClick={() => move(-1)}>◀</button>
          <div className="text-lg font-bold w-32 text-center">{y}년 {m}월</div>
          <button className="rounded-lg bg-white px-3 py-1.5 text-sm shadow-sm" onClick={() => move(1)}>▶</button>
          <button
            className="rounded-lg bg-white px-3 py-1.5 text-sm shadow-sm"
            onClick={() => {
              const [ty, tm] = today.split("-").map(Number);
              setCursor({ y: ty, m: tm });
              setSelected(today);
            }}
          >
            오늘
          </button>
          <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
            완료된 업무분장도 보기
          </label>
          <Link href="/work" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white">+ 업무분장 입력</Link>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 mb-1">
          {WEEK.map((w, i) => (
            <div key={w} className={i === 0 ? "text-rose-500" : i === 6 ? "text-blue-500" : ""}>{w}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, idx) => {
            if (d === null) return <div key={idx} className="min-h-[96px] rounded-lg bg-slate-50" />;
            const key = ymd(y, m, d);
            const items = byDate[key];
            const chips: { text: string; cls: string }[] = [];
            items?.works.forEach((w) =>
              chips.push({ text: `${w.start_time ?? ""} ${w.company ?? ""}`.trim(), cls: WORK_CHIP[w.status] })
            );
            items?.tasks.forEach((t) =>
              chips.push({ text: `접수 ${t.company || t.no}`, cls: "bg-rose-100 text-rose-700" })
            );
            const isToday = key === today;
            const isSel = key === selected;
            return (
              <button
                key={idx}
                onClick={() => setSelected(key)}
                className={`min-h-[96px] rounded-lg bg-white p-1.5 text-left align-top shadow-sm ${
                  isSel ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className={`text-xs font-semibold mb-1 ${isToday ? "inline-block rounded-full bg-blue-600 px-1.5 text-white" : "text-slate-600"}`}>
                  {d}
                </div>
                <div className="space-y-0.5">
                  {chips.slice(0, 3).map((c, i) => (
                    <div key={i} className={`truncate rounded px-1 py-0.5 text-[11px] ${c.cls}`}>{c.text}</div>
                  ))}
                  {chips.length > 3 && <div className="text-[11px] text-slate-400">+{chips.length - 3}건 더</div>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          <span><span className="inline-block h-2.5 w-2.5 rounded bg-rose-300 mr-1" />미처리 접수(접수일 기준)</span>
          <span><span className="inline-block h-2.5 w-2.5 rounded bg-slate-300 mr-1" />예정</span>
          <span><span className="inline-block h-2.5 w-2.5 rounded bg-amber-300 mr-1" />진행중</span>
          <span><span className="inline-block h-2.5 w-2.5 rounded bg-emerald-300 mr-1" />완료</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-bold mb-2">{selected ?? "-"} 일정</h2>
          {sel && sel.works.length === 0 && sel.tasks.length === 0 && (
            <div className="text-sm text-slate-400">이 날짜에는 일정이 없습니다.</div>
          )}
          <ul className="space-y-2 text-sm">
            {sel?.works.map((w) => (
              <li key={`w${w.id}`} className="rounded-lg bg-slate-50 p-2">{workLine(w)}</li>
            ))}
            {sel?.tasks.map((t) => (
              <li key={`t${t.id}`} className="rounded-lg bg-rose-50 p-2">
                <div className="font-medium">접수 {t.no} · {t.company}</div>
                <div className="text-slate-600">{t.symptom || "증상 미입력"}</div>
                <div className="text-xs text-slate-400">처리자 {t.handler} · {t.status}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-bold mb-2">미처리 접수 누적 ({openTasks.length}건)</h2>
          <ul className="max-h-[360px] space-y-1.5 overflow-y-auto text-sm">
            {backlog.map((t) => {
              const days = today ? daysBetween(t.ymd as string, today) : 0;
              return (
                <li key={t.id} className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
                  <button className="text-left" onClick={() => {
                    setSelected(t.ymd);
                    const [ty, tm] = (t.ymd as string).split("-").map(Number);
                    setCursor({ y: ty, m: tm });
                  }}>
                    <div className="font-medium">{t.company || t.no}</div>
                    <div className="text-xs text-slate-500">{t.ymd} · {t.symptom.slice(0, 30)}</div>
                  </button>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs ${days >= 7 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
                    {days >= 0 ? `${days}일 경과` : "예정"}
                  </span>
                </li>
              );
            })}
            {backlog.length === 0 && <li className="text-slate-400">미처리 접수가 없습니다.</li>}
          </ul>
          {noDate.length > 0 && (
            <p className="mt-2 text-xs text-amber-700">
              접수일을 읽지 못한 {noDate.length}건은 달력에 표시되지 않습니다. (예: {noDate[0].date || "빈 칸"})
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
