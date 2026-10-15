"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENUS = [
  { href: "/", label: "대시보드", icon: "📊" },
  { href: "/calendar", label: "캘린더", icon: "📅" },
  { href: "/work", label: "업무분장", icon: "🗂️" },
  { href: "/tasks", label: "업무 목록", icon: "📋" },
  { href: "/assign", label: "업무 분배", icon: "👥" },
  { href: "/checklist", label: "체크리스트", icon: "✅" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 bg-slate-800 text-slate-200 min-h-screen p-4">
      <div className="text-xl font-bold text-white mb-6 px-2">IT AS</div>
      <nav className="space-y-1">
        {MENUS.map((m) => {
          const active = pathname === m.href;
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                active ? "bg-blue-600 text-white" : "hover:bg-slate-700"
              }`}
            >
              <span>{m.icon}</span>
              {m.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
