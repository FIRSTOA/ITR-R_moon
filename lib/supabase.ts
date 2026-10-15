import type { Work } from "./work";

export type Row = { id: number; [key: string]: string | number | null };

const MSG = "껍데기 버전입니다. Supabase에는 아직 연결되어 있지 않습니다.";

export function getSupabase(): any {
  throw new Error(MSG);
}

export async function loadRows(): Promise<{ rows: Row[]; error: string | null }> {
  return { rows: [], error: MSG };
}

export async function loadWork(): Promise<{ works: Work[]; error: string | null }> {
  return { works: [], error: MSG };
}
