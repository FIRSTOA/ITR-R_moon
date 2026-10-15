import { loadRows } from "@/lib/supabase";
import { buildAssignment, toTasks } from "@/lib/analyze";
import { Card, ErrorBox, PageTitle } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AssignPage() {
  const { rows, error } = await loadRows();
  if (error) return <ErrorBox message={error} />;

  const { handlers, items, matrix, open, suggestions } = buildAssignment(toTasks(rows));

  return (
    <div>
      <PageTitle
        title="업무 분배"
        desc="직원별로 품목 처리 경험을 확인하고, 해보지 않은 직원에게 신규 건을 우선 추천합니다."
      />

      <Card className="mb-5 overflow-x-auto">
        <h2 className="font-bold mb-3">직원별 처리 경험 (건수)</h2>
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left py-2 px-2">직원</th>
              {items.map((i) => (
                <th key={i} className="text-center py-2 px-2 whitespace-nowrap">{i}</th>
              ))}
              <th className="text-center py-2 px-2">진행 중</th>
            </tr>
          </thead>
          <tbody>
            {handlers.map((h) => (
              <tr key={h} className="border-t border-slate-100">
                <td className="py-2 px-2 font-medium">{h}</td>
                {items.map((i) => {
                  const n = matrix[h][i] ?? 0;
                  return (
                    <td key={i} className="py-2 px-2 text-center">
                      <span className={`inline-block min-w-[2rem] rounded px-2 py-0.5 ${n === 0 ? "bg-rose-100 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {n}
                      </span>
                    </td>
                  );
                })}
                <td className="py-2 px-2 text-center">{open[h]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-2">빨간색 0 = 아직 해보지 않은 품목 (경험 쌓을 기회)</p>
      </Card>

      <Card>
        <h2 className="font-bold mb-3">신규·미배정 업무 추천 배정 ({suggestions.length}건)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                {["순", "접수일", "상호", "품목", "증상", "현재 처리자", "추천 처리자", "추천 이유"].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suggestions.map(({ task, suggested, experience }) => (
                <tr key={task.id} className="border-t border-slate-100 align-top">
                  <td className="py-2 px-2">{task.no}</td>
                  <td className="py-2 px-2 whitespace-nowrap">{task.date}</td>
                  <td className="py-2 px-2">{task.company}</td>
                  <td className="py-2 px-2">{task.item}</td>
                  <td className="py-2 px-2 max-w-[260px]">{task.symptom}</td>
                  <td className="py-2 px-2">{task.handler}</td>
                  <td className="py-2 px-2 font-semibold text-blue-700">{suggested || "-"}</td>
                  <td className="py-2 px-2 text-slate-500">
                    {suggested ? (experience === 0 ? "해본 적 없는 품목 → 경험 기회" : `해당 품목 ${experience}건 (가장 적음)`) : "-"}
                  </td>
                </tr>
              ))}
              {suggestions.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-slate-400">배정할 신규 업무가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
