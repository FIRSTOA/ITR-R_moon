import { loadRows, loadWork } from "../../lib/supabase";
import { toTasks } from "../../lib/analyze";
import { ErrorBox, PageTitle } from "../../components/ui";
import WorkBoard from "../../components/WorkBoard";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const [{ rows, error }, { works, error: workError }] = await Promise.all([loadRows(), loadWork()]);
  if (error) return <ErrorBox message={error} />;

  const tasks = toTasks(rows);
  const openTasks = tasks.filter((t) => t.status !== "완료");
  const people = Array.from(
    new Set([...tasks.map((t) => t.handler), ...works.map((w) => w.assignee ?? "")].filter((x) => x && x !== "미배정"))
  );

  return (
    <div>
      <PageTitle
        title="업무분장"
        desc="일정·담당자·등급·작업시간·병목·체크리스트를 앱에서 입력하고, 시작·완료까지 관리합니다."
      />
      {workError && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          업무분장 데이터를 읽지 못했습니다. Supabase SQL Editor에서 <b>IT_AS_WORK</b> 테이블 생성 SQL을 먼저 실행하세요.
          <div className="mt-1 break-all text-xs">{workError}</div>
        </div>
      )}
      <WorkBoard works={works} openTasks={openTasks} people={people} />
    </div>
  );
}
