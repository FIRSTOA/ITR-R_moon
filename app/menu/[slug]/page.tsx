import { MENUS } from "../../../lib/menus";

export default function MenuPage({ params }: { params: { slug: string } }) {
  const menu = MENUS.find((m) => m.slug === params.slug);
  return (
    <div>
      <h1 className="text-2xl font-bold">{menu ? menu.label : "페이지"}</h1>
      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-400">
        준비 중인 화면입니다. (껍데기만 반영됨 · 데이터 연결은 추후 진행)
      </div>
    </div>
  );
}
