"use client";

import { useEffect, useState } from "react";
import { ATTENTION, DETAIL, DONUT, KPIS, OPPORTUNITIES, SALES, STATUS_BARS, TASKS } from "../lib/sample";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const LIST_TABS = [
  { label: "전체", n: 18 },
  { label: "긴급", n: 2 },
  { label: "지연", n: 4 },
  { label: "내 업무", n: 7 },
];
const DETAIL_TABS = ["진행 타임라인", "상세정보", "자산정보", "첨부파일 (2)", "영업기회 (1)", "관련업무 (2)"];

export default function Dashboard() {
  const [today, setToday] = useState("");
  const [tab, setTab] = useState("전체");
  const [selected, setSelected] = useState("1");
  const [detailTab, setDetailTab] = useState(DETAIL_TABS[0]);

  useEffect(() => {
    const n = new Date();
    const p = (v: number) => String(v).padStart(2, "0");
    setToday(`${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())} (${WEEK[n.getDay()]})`);
  }, []);

  const donutTotal = DONUT.reduce((s, d) => s + d.n, 0);
  const donutGradient = (() => {
    let acc = 0;
    return DONUT.map((d) => {
      const from = (acc / donutTotal) * 100;
      acc += d.n;
      return `${d.color} ${from}% ${(acc / donutTotal) * 100}%`;
    }).join(", ");
  })();
  const barMax = Math.max(...STATUS_BARS.map((b) => b.value));

  return (
    <div className="space-y-4">
      {/* 상단 바 */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-bold">진행상황 대시보드</h1>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{today || "-"}</div>
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option>전체</option>
        </select>
        <input
          placeholder="고객사, 자산번호, 접수번호 검색"
          className="w-72 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-2 text-sm">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 font-bold text-slate-600">문</span>
          <div className="leading-tight">
            <div className="font-semibold">문종주 대표</div>
            <div className="text-xs text-slate-400">대표이사</div>
          </div>
        </div>
      </div>

      {/* 오늘의 요약 현황 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center">
          <h2 className="mr-auto text-lg font-bold">오늘의 요약 현황</h2>
          <button className="mr-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">⟳ 새로고침</button>
          <button className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">+ 접수 등록</button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 2xl:grid-cols-8">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center gap-2">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-base ${k.tint}`}>{k.icon}</div>
                <div className="text-sm font-semibold text-slate-700">{k.label}</div>
              </div>
              <div className="mt-2 text-3xl font-bold">
                {k.value}
                <span className="ml-1 text-base font-medium text-slate-500">{k.unit}</span>
              </div>
              {k.sub && <div className="text-xs text-blue-600">{k.sub}</div>}
              {k.trend && <div className={`mt-1 text-xs ${k.trendCls}`}>{k.trend}</div>}
            </div>
          ))}
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-base">📈</div>
              <div className="text-sm font-semibold text-slate-700">{SALES.label}</div>
            </div>
            <div className="mt-2 text-xl font-bold">{SALES.amount}<span className="ml-1 text-sm font-medium text-slate-500">원</span></div>
            <div className="text-xs text-slate-400">목표 {SALES.target}원</div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 flex-1 rounded bg-slate-100">
                <div className="h-2 rounded bg-emerald-500" style={{ width: `${SALES.pct}%` }} />
              </div>
              <span className="text-xs text-slate-500">{SALES.pct}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 차트 4칸 */}
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-bold">업무영역별 현황</h3>
          <div className="flex items-center gap-4">
            <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${donutGradient})` }}>
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center">
                <div>
                  <div className="text-[11px] text-slate-500">전체</div>
                  <div className="text-lg font-bold">{donutTotal}건</div>
                </div>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5 text-sm">
              {DONUT.map((d) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                  <span className="truncate">{d.name}</span>
                  <span className="ml-auto shrink-0 text-slate-500">{d.n} ({d.pct}%)</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-bold">상태별 현황</h3>
          <ul className="space-y-2">
            {STATUS_BARS.map((b) => (
              <li key={b.label} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-slate-600">{b.label}</span>
                <div className="h-3 flex-1 rounded bg-slate-100">
                  <div className={`h-3 rounded ${b.color}`} style={{ width: `${(b.value / barMax) * 100}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right font-medium">{b.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-bold">영업기회 TOP 5</h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-400">
              <tr>
                <th className="w-8 py-1 text-left font-medium">순위</th>
                <th className="py-1 text-left font-medium">고객사</th>
                <th className="py-1 text-left font-medium">기회명</th>
                <th className="py-1 text-right font-medium">예상매출</th>
                <th className="py-1 text-right font-medium">단계</th>
              </tr>
            </thead>
            <tbody>
              {OPPORTUNITIES.map((o) => (
                <tr key={o.rank} className="border-t border-slate-100">
                  <td className="py-2">{o.rank}</td>
                  <td className="max-w-[70px] truncate py-2">{o.customer}</td>
                  <td className="max-w-[90px] truncate py-2 text-slate-500">{o.name}</td>
                  <td className="whitespace-nowrap py-2 text-right text-xs">{o.amount}</td>
                  <td className="py-2 text-right">
                    <span className="rounded bg-sky-100 px-1.5 py-0.5 text-xs text-sky-700">{o.stage}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">대표 판단이 필요한 항목 ({ATTENTION.length + 2})</h3>
            <span className="text-slate-400">⋮</span>
          </div>
          <ul className="space-y-2">
            {ATTENTION.map((a) => (
              <li key={a.text} className="flex items-center gap-2 text-sm">
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${a.tagCls}`}>{a.tag}</span>
                <span className="truncate">{a.text}</span>
                <span className="ml-auto shrink-0 rounded bg-rose-50 px-1 text-[10px] font-bold text-rose-500">{a.badge}</span>
                <span className="shrink-0 text-xs text-slate-500">{a.level}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right text-xs text-blue-600">더보기 ›</div>
        </section>
      </div>

      {/* 업무 목록 + 상세 */}
      <div className="grid gap-4 xl:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="mr-1 text-lg font-bold">업무 목록</h3>
            {LIST_TABS.map((t) => (
              <button
                key={t.label}
                onClick={() => setTab(t.label)}
                className={`rounded-lg px-2.5 py-1 text-sm ${
                  tab === t.label ? "bg-blue-600 font-semibold text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label} {t.n}
              </button>
            ))}
            <button className="ml-auto rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-600">필터</button>
          </div>
          <input
            placeholder="접수번호, 고객사, 제목 검색"
            className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
          <ul className="space-y-2">
            {TASKS.map((t) => (
              <li
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`cursor-pointer rounded-xl border p-3 ${
                  selected === t.id ? "border-blue-400 bg-blue-50/60" : "border-slate-200 hover:bg-slate-50"
                } ${t.urgent ? "border-l-4 border-l-red-500" : ""}`}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${t.kindCls}`}>{t.kind}</span>
                  <span className="truncate font-semibold">{t.no}</span>
                  <span className="truncate text-slate-500">{t.customer}</span>
                  <span className="ml-auto shrink-0 text-xs text-slate-400">{t.time}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-slate-800">{t.title}</div>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                  <span>{t.owner}</span>
                  {t.sub && <span>{t.sub}</span>}
                  <span className={`ml-auto rounded px-1.5 py-0.5 font-medium ${t.statusCls}`}>{t.status}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-center text-sm text-blue-600">더보기 (12) ⌄</div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-7">
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">{DETAIL.priority}</span>
                <span className="font-semibold">{DETAIL.no}</span>
                <span className="text-slate-600">{DETAIL.customer}</span>
              </div>
              <h3 className="mt-1 text-xl font-bold">{DETAIL.title}</h3>
              <div className="mt-1 text-xs text-slate-500">{DETAIL.meta}</div>
            </div>
            <div className="flex items-end gap-3 text-sm">
              <div>
                <div className="mb-1 text-xs text-slate-400">상태</div>
                <div className="rounded-lg border border-slate-200 px-3 py-2 font-medium">{DETAIL.status} ⌄</div>
              </div>
              <div>
                <div className="mb-1 text-xs text-slate-400">담당자</div>
                <div className="rounded-lg border border-slate-200 px-3 py-2 font-medium">{DETAIL.owner} ⌄</div>
              </div>
              <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">수정</button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-5 border-b border-slate-200 text-sm">
            {DETAIL_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setDetailTab(t)}
                className={`-mb-px border-b-2 pb-2 ${
                  detailTab === t ? "border-blue-600 font-semibold text-blue-600" : "border-transparent text-slate-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <ul className="space-y-3 lg:col-span-2">
              {DETAIL.timeline.map((e) => (
                <li key={e.time + e.who} className="flex gap-3">
                  <span className="w-11 shrink-0 pt-2 text-xs text-slate-400">{e.time}</span>
                  <div className="min-w-0 flex-1 rounded-lg bg-slate-50 p-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{e.who}</span>
                      {e.team && <span className="text-xs text-slate-400">({e.team})</span>}
                      <span className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${e.tagCls}`}>{e.tag}</span>
                    </div>
                    <div className="mt-1 whitespace-pre-wrap text-slate-700">{e.text}</div>
                  </div>
                </li>
              ))}
              <li className="flex items-center gap-2 pt-1">
                <input
                  placeholder="메시지를 입력하세요. (Enter로 전송)"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">전송</button>
              </li>
            </ul>

            <aside className="space-y-3 rounded-xl border border-slate-200 p-3 text-sm">
              <h4 className="font-bold">다음 조치</h4>
              <div>
                <div className="text-xs text-slate-400">방문 예정</div>
                <div className="font-medium">{DETAIL.next.visit}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">방문 담당자</div>
                <div className="font-medium">{DETAIL.next.visitor}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">준비 사항</div>
                {DETAIL.next.prep.map((p) => (
                  <div key={p}>{p}</div>
                ))}
              </div>
              <div>
                <div className="text-xs text-slate-400">고객 요청사항</div>
                <div>{DETAIL.next.request}</div>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <div className="text-xs text-slate-400">관련 고객 담당자</div>
                <div className="font-medium">{DETAIL.next.contact.name}</div>
                <div className="text-slate-500">{DETAIL.next.contact.phone}</div>
                <button className="mt-2 w-full rounded-lg border border-slate-200 py-1.5 text-sm">연락하기</button>
              </div>
            </aside>
          </div>
        </section>
      </div>

      <p className="pb-2 text-center text-xs text-slate-400">※ 현재 화면의 숫자와 내용은 샘플입니다. 실제 데이터는 추후 연결됩니다.</p>
    </div>
  );
}
