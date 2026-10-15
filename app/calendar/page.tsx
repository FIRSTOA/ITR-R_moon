import { loadRows, loadWork } from "../../lib/supabase";
import { toTasks } from "../../lib/analyze";
import { ErrorBox, PageTitle } from "../../components/ui";
import CalendarView from "../../components/CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [{ rows, error }, { works, error: workError }] = await Promise.all([loadRows(), loadWork()]);
  if (error) return <ErrorBox message={error} />;

  const openTasks = toTasks(rows).filter((t) => t.status !== "완료");

  return (
    <div>
      <PageTitle
        title="캘린더"
        desc="처리 완료된 접수는 제외하고, 아직 끝나지 않은 접수와 업무분장 일정을 날짜별로 봅니다."
      />
      {workError && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          업무분장 데이터를 읽지 못했습니다. Supabase에서 <b>IT_AS_WORK</b> 테이블 SQL을 먼저 실행했는지 확인하세요.
          <div className="mt-1 break-all text-xs">{workError}</div>
        </div>
      )}
      <CalendarView openTasks={openTasks} works={works} />
    </div>
  );
}
