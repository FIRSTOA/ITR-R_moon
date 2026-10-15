import type { Method, Status } from "../lib/analyze";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

export function Kpi({ label, value, tone }: { label: string; value: number; tone: "blue" | "green" | "amber" | "red" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
  };
  return (
    <div className={`rounded-xl p-4 ${tones[tone]}`}>
      <div className="text-sm">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}건</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const c = {
    신규: "bg-rose-100 text-rose-700",
    "처리 중": "bg-amber-100 text-amber-700",
    완료: "bg-emerald-100 text-emerald-700",
  }[status];
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${c}`}>{status}</span>;
}

export function MethodBadge({ method }: { method: Method }) {
  const c = {
    원격: "bg-emerald-100 text-emerald-700",
    방문: "bg-blue-100 text-blue-700",
    미분류: "bg-slate-100 text-slate-500",
  }[method];
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${c}`}>{method}</span>;
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">
      <div className="font-bold mb-1">데이터를 불러오지 못했습니다</div>
      <div className="break-all">{message}</div>
    </div>
  );
}

export function PageTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
    </div>
  );
}
