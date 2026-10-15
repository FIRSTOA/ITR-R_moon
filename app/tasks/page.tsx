import { loadRows } from "../../lib/supabase";
import { toTasks } from "../../lib/analyze";
import { ErrorBox, PageTitle } from "../../components/ui";
import TaskTable from "../../components/TaskTable";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const { rows, error } = await loadRows();
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <PageTitle title="IT 업무 목록" desc="상태·담당자·처리방식으로 걸러서 볼 수 있습니다." />
      <TaskTable tasks={toTasks(rows)} />
    </div>
  );
}
