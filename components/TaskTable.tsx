"use client";

import { useMemo, useState } from "react";
import type { Task } from "../lib/analyze";
import { MethodBadge, StatusBadge } from "./ui";

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  const [status, setStatus] = useState("전체");
  const [handler, setHandler] = useState("전체");
  const [method, setMethod] = useState("전체");
  const [q, setQ] = useState("");

  const handlers = useMemo(() => Array.from(new Set(tasks.map((t) => t.handler))), [tasks]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return tasks.filter((t) => {
      if (status !== "전체" && t.status !== status) return false;
      if (handler !== "전체" && t.handler !== handler) return false;
      if (method !== "전체" && t.method !== method) return false;
      if (keyword) {
        const hay = `${t.company} ${t.symptom} ${t.detail} ${t.location} ${t.item} ${t.no}`.toLowerCase();
        if (!hay.includes(keyword)) return false;
      }
      return true;
    });
  }, [tasks, status, handler, method, q]);

  const sel = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>전체</option>
          <option>신규</option>
          <option>처리 중</option>
          <option>완료</option>
        </select>
        <select className={sel} value={handler} onChange={(e) => setHandler(e.target.value)}>
          <option>전체</option>
          {handlers.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <select className={sel} value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>전체</option>
          <option>원격</option>
          <option>방문</option>
          <option>미분류</option>
        </select>
        <input
          className={`${sel} flex-1 min-w-[200px]`}
          placeholder="상호, 증상, 처리내용 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="text-sm text-slate-500 mb-2">{filtered.length}건 표시</div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {["순", "접수일", "상호", "품목", "증상", "처리자", "처리방식", "상태", "처리내용"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2">{t.no}</td>
                <td className="px-3 py-2 whitespace-nowrap">{t.date}</td>
                <td className="px-3 py-2">{t.company}</td>
                <td className="px-3 py-2">{t.item}</td>
                <td className="px-3 py-2 max-w-[260px]">{t.symptom}</td>
                <td className="px-3 py-2 whitespace-nowrap">{t.handler}</td>
                <td className="px-3 py-2">
                  <MethodBadge method={t.method} />
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-3 py-2 max-w-[320px]">{t.detail}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-400">
                  조건에 맞는 업무가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
