import { loadRows } from "../../lib/supabase";
import { buildChecklists, toTasks } from "../../lib/analyze";
import { Card, ErrorBox, PageTitle } from "../../components/ui";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const { rows, error } = await loadRows();
  if (error) return <ErrorBox message={error} />;

  const lists = buildChecklists(toTasks(rows));

  return (
    <div>
      <PageTitle
        title="처리내역 체크리스트"
        desc="과거 처리내용을 품목별로 모았습니다. 원격으로 처리한 내용이 있으면 그것을 우선 보여줍니다."
      />

      <div className="grid md:grid-cols-2 gap-4">
        {lists.map((l) => (
          <Card key={l.item}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold">{l.item}</h2>
              <span className="text-xs text-slate-500">
                총 {l.total}건 · 원격 {l.remote} · 방문 {l.visit}
              </span>
            </div>

            {l.symptoms.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-slate-500 mb-1">자주 접수되는 증상</div>
                <ul className="text-sm text-slate-700 list-disc pl-5">
                  {l.symptoms.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            )}

            <div className="text-xs font-semibold text-slate-500 mb-1">
              {l.remote > 0 ? "원격으로 처리한 방법" : "처리한 방법"}
            </div>
            {l.steps.length > 0 ? (
              <ul className="space-y-1">
                {l.steps.map((x) => (
                  <li key={x} className="flex gap-2 text-sm">
                    <span className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded border border-slate-300" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-400">기록된 처리내용이 없습니다.</div>
            )}

            {l.visit > 0 && (
              <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                방문 처리 {l.visit}건 → 위 원격 방법으로 먼저 시도해 볼 수 있는지 확인하세요.
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
