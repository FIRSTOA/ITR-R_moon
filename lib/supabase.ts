import { createClient } from "@supabase/supabase-js";

export type Row = { id: number; [key: string]: string | number | null };

// 테이블 이름 (Supabase에 만든 이름과 같아야 합니다)
const TABLE_NAME = "IT_AS";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "환경변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 를 Vercel에 등록하세요."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Supabase는 한 번에 1000건까지만 주므로 나눠서 전부 가져옵니다.
async function fetchAllRows(): Promise<Row[]> {
  const supabase = getSupabase();
  const all: Row[] = [];
  const size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("id", { ascending: true })
      .range(from, from + size - 1);
    if (error) throw new Error(error.message);
    const chunk = (data ?? []) as Row[];
    all.push(...chunk);
    if (chunk.length < size) break;
  }
  return all;
}

export async function loadRows(): Promise<{ rows: Row[]; error: string | null }> {
  try {
    return { rows: await fetchAllRows(), error: null };
  } catch (e) {
    return { rows: [], error: e instanceof Error ? e.message : String(e) };
  }
}
