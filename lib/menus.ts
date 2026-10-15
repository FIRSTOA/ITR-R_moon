export type IconName =
  | "home" | "inbox" | "task" | "box" | "chart" | "contract" | "users"
  | "calendar" | "coordi" | "stats" | "book" | "gear";

export const MENUS: { slug: string; label: string; icon: IconName; href: string }[] = [
  { slug: "dashboard", label: "대시보드", icon: "home", href: "/" },
  { slug: "reception", label: "접수 관리", icon: "inbox", href: "/menu/reception" },
  { slug: "work", label: "업무 관리", icon: "task", href: "/menu/work" },
  { slug: "asset", label: "자산 관리", icon: "box", href: "/menu/asset" },
  { slug: "sales", label: "영업 관리", icon: "chart", href: "/menu/sales" },
  { slug: "contract", label: "계약 / 렌탈", icon: "contract", href: "/menu/contract" },
  { slug: "customer", label: "고객 관리", icon: "users", href: "/menu/customer" },
  { slug: "calendar", label: "일정 / 캘린더", icon: "calendar", href: "/menu/calendar" },
  { slug: "coordi", label: "코디 관리", icon: "coordi", href: "/menu/coordi" },
  { slug: "stats", label: "통계 / 분석", icon: "stats", href: "/menu/stats" },
  { slug: "docs", label: "지식 / 문서", icon: "book", href: "/menu/docs" },
  { slug: "settings", label: "설정 관리", icon: "gear", href: "/menu/settings" },
];
