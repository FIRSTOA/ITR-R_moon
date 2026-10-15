import { loadRows } from "@/lib/supabase";
import { handlerStats, summary, toTasks } from "@/lib/analyze";
import { Card, ErrorBox, Kpi, MethodBadge, PageTitle, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { rows, error } = await loadRows();
  if (error) return <ErrorBox message={error} />;

  const tasks = toTasks(rows);
  const sum = summary(tasks);
  const stats = handlerStats(tasks);
  const maxTotal = Math.max(1, ...stats.map((s) => s.total));

  const classified = sum.remote + sum.visit;
  const remotePct = classified ? Math.round((sum.remote / classified) * 100) : 0;

  return (
    <div>
      <PageTitle title="IT AS 대시보드" desc="Supabase IT_AS 테이블 기준 실시간 현황" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Kpi label="전체 IT 요청" value={sum.total} tone="blue" />
        <Kpi label="처리 완료" value={sum.done} tone="green" />
        <Kpi label="처리 중" value={sum.doing} tone="amber" />
        <Kpi label="신규" value={sum.fresh} tone="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2">
          <h2 className="font-bold mb-3">직원별 업무 현황</h2>
          <div className="space-y-3">
            {stats.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.name}</span>
                  <span className="text-slate-500">
                    신규 {s.신규} · 처리 중 {s["처리 중"]} · 완료 {s.완료}
                  </span>
                </div>
                <div className="flex h-4 rounded bg-slate-100 overflow-hidden" style={{ width: `${(s.total / maxTotal) * 100}%` }}>
                  <div className="bg-rose-400" style={{ flex: s.신규 }} />
                  <div className="bg-amber-400" style={{ flex: s["처리 중"] }} />
                  <div className="bg-emerald-500" style={{ flex: s.완료 }} />
                </div>
              </div>
            ))}
            {stats.length === 0 && <div className="text-slate-400 text-sm">데이터가 없습니다.</div>}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold mb-3">처리 방식 비율</h2>
          <div className="flex items-center gap-4">
            <div
              className="h-28 w-28 rounded-full shrink-0 grid place-items-center"
              style={{
                background: classified
                  ? `conic-gradient(#10b981 0 ${remotePct}%, #3b82f6 ${remotePct}% 100%)`
                  : "#e2e8f0",
              }}
            >
              <div className="h-16 w-16 rounded-full bg-white grid place-items-center text-xs text-slate-500">
                {classified}건
              </div>
            </div>
            <ul className="text-sm space-y-1">
              <li><span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2" />원격 {sum.remote}건 ({remotePct}%)</li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2" />방문 {sum.visit}건 ({classified ? 100 - remotePct : 0}%)</li>
              <li className="text-slate-400">미분류 {sum.unknown}건</li>
            </ul>
          </div>
          <p className="text-xs text-slate-400 mt-3">처리내용·증상·비고에 &quot;원격&quot;, &quot;방문&quot; 등의 단어가 있는지로 구분합니다.</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-bold mb-3">최근 IT 업무</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                {["순", "접수일", "상호", "증상", "처리자", "처리방식", "상태"].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 8).map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="py-2 px-2">{t.no}</td>
                  <td className="py-2 px-2 whitespace-nowrap">{t.date}</td>
                  <td className="py-2 px-2">{t.company}</td>
                  <td className="py-2 px-2 max-w-[280px]">{t.symptom}</td>
                  <td className="py-2 px-2">{t.handler}</td>
                  <td className="py-2 px-2"><MethodBadge method={t.method} /></td>
                  <td className="py-2 px-2"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
