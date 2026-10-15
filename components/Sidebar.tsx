"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MENUS, type IconName } from "../lib/menus";

const PATHS: Record<IconName, string> = {
  home: "M3 12l9-9 9 9M5 10v10h14V10",
  inbox: "M4 4h16v12h-5l-1 3h-4l-1-3H4z",
  task: "M9 11l3 3 8-8M4 6v14h14",
  box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  contract: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
  coordi: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21a8 8 0 0 1 16 0",
  stats: "M3 3v18h18M7 15l4-4 3 3 5-6",
  book: "M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-6",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19 12l2 1-2 3-2-1a7 7 0 0 1-2 1l-.5 2h-3L11 16a7 7 0 0 1-2-1l-2 1-2-3 2-1a7 7 0 0 1 0-2L5 9l2-3 2 1a7 7 0 0 1 2-1l.5-2h3L15 6a7 7 0 0 1 2 1l2-1 2 3-2 1a7 7 0 0 1 0 2",
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col bg-[#0b1530] text-slate-300 transition-all ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 py-5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-lg font-extrabold text-white">
          F
        </div>
        {!collapsed && <div className="text-lg font-bold text-white">퍼스트전산 ERP</div>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {MENUS.map((m) => {
          const active = pathname === m.href;
          return (
            <Link
              key={m.slug}
              href={m.href}
              title={m.label}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] ${
                active ? "bg-blue-600 font-semibold text-white" : "hover:bg-white/10"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon name={m.icon} />
              {!collapsed && (
                <>
                  <span>{m.label}</span>
                  {m.slug !== "dashboard" && <span className="ml-auto text-xs text-slate-500">⌄</span>}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed((v) => !v)}
        className="m-3 flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/10"
      >
        <span>{collapsed ? "»" : "«"}</span>
        {!collapsed && <span>메뉴 접기</span>}
      </button>
    </aside>
  );
}
