/* =====================================================================
   ★ 껍데기용 샘플 데이터입니다.
   나중에 Supabase(IT_AS, IT_AS_WORK) 데이터로 이 파일의 값을 교체합니다.
   ===================================================================== */

export const KPIS = [
  { icon: "📥", tint: "bg-blue-100", label: "오늘 신규 접수", value: 18, unit: "건", sub: "자산 8 / 일반 10", trend: "▲ 3건 (어제 대비)", trendCls: "text-rose-600" },
  { icon: "⚙️", tint: "bg-violet-100", label: "처리 중", value: 7, unit: "건", sub: "", trend: "▲ 2건", trendCls: "text-rose-600" },
  { icon: "🚨", tint: "bg-red-100", label: "긴급", value: 2, unit: "건", sub: "", trend: "▲ 1건", trendCls: "text-rose-600" },
  { icon: "⏰", tint: "bg-orange-100", label: "지연 (기한초과)", value: 4, unit: "건", sub: "", trend: "▲ 2건", trendCls: "text-rose-600" },
  { icon: "✅", tint: "bg-emerald-100", label: "오늘 완료", value: 9, unit: "건", sub: "", trend: "▲ 4건", trendCls: "text-emerald-600" },
  { icon: "📄", tint: "bg-indigo-100", label: "견적 필요", value: 3, unit: "건", sub: "", trend: "▲ 1건", trendCls: "text-rose-600" },
  { icon: "🎯", tint: "bg-sky-100", label: "영업기회", value: 5, unit: "건", sub: "예상매출 4,200,000원", trend: "", trendCls: "" },
];

export const SALES = { label: "이번달 매출", amount: "1,550,000", target: "10,000,000", pct: 15.5 };

export const DONUT = [
  { name: "자산장애", n: 8, pct: 44, color: "#3b82f6" },
  { name: "영업업무", n: 3, pct: 17, color: "#8b5cf6" },
  { name: "IT업무", n: 2, pct: 11, color: "#10b981" },
  { name: "기술업무", n: 2, pct: 11, color: "#f59e0b" },
  { name: "코디업무", n: 2, pct: 11, color: "#f97316" },
  { name: "교육업무", n: 1, pct: 6, color: "#64748b" },
];

export const STATUS_BARS = [
  { label: "신규접수", value: 5, color: "bg-blue-500" },
  { label: "확인중", value: 3, color: "bg-rose-500" },
  { label: "진행중", value: 7, color: "bg-sky-500" },
  { label: "외부예정", value: 2, color: "bg-amber-400" },
  { label: "고객회신대기", value: 1, color: "bg-yellow-400" },
  { label: "방문예정", value: 3, color: "bg-orange-500" },
  { label: "견적진행", value: 2, color: "bg-lime-500" },
  { label: "완료", value: 9, color: "bg-emerald-500" },
];

export const OPPORTUNITIES = [
  { rank: 1, customer: "참존이엔씨", name: "네트워크 장비 교체", amount: "950,000원", stage: "제안중" },
  { rank: 2, customer: "한빛건설", name: "노트북 5대 렌탈", amount: "5,400,000원", stage: "견적작성" },
  { rank: 3, customer: "세진산업", name: "M365 30명 도입", amount: "6,300,000원", stage: "상담중" },
  { rank: 4, customer: "미래테크", name: "IT환경 개선 프로젝트", amount: "8,500,000원", stage: "진단중" },
  { rank: 5, customer: "대성정밀", name: "데스크탑 교체 제안", amount: "2,160,000원", stage: "제안중" },
];

export const ATTENTION = [
  { tag: "반복장애", tagCls: "bg-rose-100 text-rose-700", text: "NAS 끊김 (3회) - 참존이엔씨", badge: "NEW", level: "중" },
  { tag: "계약만료", tagCls: "bg-orange-100 text-orange-700", text: "렌탈 PC 계약 만료 임박 - 대성정밀", badge: "NEW", level: "중" },
  { tag: "견적승인", tagCls: "bg-indigo-100 text-indigo-700", text: "노트북 5대 렌탈 견적 승인 필요", badge: "NEW", level: "높음" },
  { tag: "일정승인", tagCls: "bg-sky-100 text-sky-700", text: "방화벽 교체 작업 일정 최종 승인", badge: "NEW", level: "높음" },
  { tag: "영업전환", tagCls: "bg-emerald-100 text-emerald-700", text: "CAD 성능저하 → 장비 교체 제안 검토", badge: "NEW", level: "중" },
];

export type SampleTask = {
  id: string;
  kind: string;
  kindCls: string;
  no: string;
  customer: string;
  title: string;
  sub: string;
  owner: string;
  time: string;
  status: string;
  statusCls: string;
  urgent?: boolean;
};

export const TASKS: SampleTask[] = [
  { id: "1", kind: "긴급", kindCls: "bg-red-100 text-red-700", no: "CS-202609-003", customer: "참존이엔씨", title: "NAS 공유폴더 간헐적 끊김", sub: "FT-NAS-0004", owner: "이기술", time: "09:10", status: "방문예정", statusCls: "bg-orange-100 text-orange-700", urgent: true },
  { id: "2", kind: "영업", kindCls: "bg-violet-100 text-violet-700", no: "REQ-202609-001", customer: "한빛건설", title: "노트북 5대 렌탈 견적 요청", sub: "", owner: "문종주", time: "08:40", status: "견적작성", statusCls: "bg-indigo-100 text-indigo-700" },
  { id: "3", kind: "코디", kindCls: "bg-emerald-100 text-emerald-700", no: "REQ-202609-004", customer: "대성정밀", title: "방화벽 교체 작업 일정 조율", sub: "", owner: "김코디", time: "09:20", status: "조율중", statusCls: "bg-sky-100 text-sky-700" },
  { id: "4", kind: "IT", kindCls: "bg-blue-100 text-blue-700", no: "REQ-202609-002", customer: "미래테크", title: "IT 환경 조사 요청", sub: "", owner: "이기술", time: "09:20", status: "일정조율", statusCls: "bg-violet-100 text-violet-700" },
  { id: "5", kind: "기술", kindCls: "bg-amber-100 text-amber-700", no: "REQ-202609-003", customer: "참존이엔씨", title: "NAS 공유폴더 권한 설정 요청", sub: "", owner: "박기술", time: "10:15", status: "작업예정", statusCls: "bg-emerald-100 text-emerald-700" },
  { id: "6", kind: "영업", kindCls: "bg-violet-100 text-violet-700", no: "REQ-202609-005", customer: "세진산업", title: "M365 30명 도입 상담 요청", sub: "", owner: "판기술", time: "13:10", status: "상담예정", statusCls: "bg-sky-100 text-sky-700" },
];

export type TimelineEvent = { time: string; who: string; team: string; text: string; tag: string; tagCls: string };

export const DETAIL = {
  priority: "긴급",
  no: "CS-202609-003",
  customer: "참존이엔씨",
  title: "NAS 공유폴더 간헐적 끊김",
  meta: "자산번호 FT-NAS-0004 | Synology DS923+ | 설치일 2024-08-20 | 계약종료일 2027-08-19",
  status: "방문예정",
  owner: "이기술",
  timeline: [
    { time: "09:10", who: "김CS", team: "CS팀", text: "고객에게 전화 접수됨\nNAS 공유폴더가 오전부터 간헐적으로 끊긴다고 함", tag: "접수", tagCls: "bg-blue-100 text-blue-700" },
    { time: "09:18", who: "시스템", team: "", text: "담당자가 이기술로 변경되었습니다.", tag: "담당자 변경", tagCls: "bg-sky-100 text-sky-700" },
    { time: "09:25", who: "이기술", team: "기술팀", text: "원격으로 NAS 로그 확인\nNAS 자체 이상보다 네트워크 구간 문제로 추정\n스위치와 케이블 확인 필요", tag: "원격점검", tagCls: "bg-teal-100 text-teal-700" },
    { time: "09:40", who: "김코디", team: "코디팀", text: "고객사와 방문 가능 시간 확인\n9월 22일 오후 2시 방문 요청", tag: "일정조율", tagCls: "bg-violet-100 text-violet-700" },
    { time: "10:05", who: "문종주 대표", team: "", text: "반복장애 3회 확인\n관리형 스위치 교체 검토 필요", tag: "의견", tagCls: "bg-rose-100 text-rose-700" },
    { time: "10:20", who: "시스템", team: "", text: "영업기회가 생성되었습니다. (OP-202609-002)\n예상 매출: 950,000원", tag: "영업기회", tagCls: "bg-amber-100 text-amber-700" },
  ] as TimelineEvent[],
  next: {
    visit: "2026-09-22 (화) 14:00",
    visitor: "이기술",
    prep: ["- 케이블", "- 관리형 스위치 후보 2종"],
    request: "공유폴더 안정적 사용",
    contact: { name: "정주임 (전산담당)", phone: "010-0000-3001" },
  },
};
