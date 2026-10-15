# ITR-R_moon v0.1 (퍼스트전산 IT AS 관리)

Next.js + Supabase + Vercel. 구글시트 → Supabase `IT_AS` 데이터를 화면으로 보여주고,
업무분장은 앱에서 입력합니다.

화면: 대시보드 / 캘린더(미처리만) / 업무분장 / 업무 목록 / 업무 분배 / 체크리스트

## 처음 한 번: Supabase 테이블
Supabase → SQL Editor → New query → `supabase/00_전체_테이블_생성.sql` 전체 붙여넣기 → Run

## Vercel 환경변수 2개
- `NEXT_PUBLIC_SUPABASE_URL` = https://프로젝트.supabase.co  (/rest/v1/ 붙이지 않음)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = sb_publishable_ 로 시작하는 키

## GitHub 저장소 최상위에 이 파일/폴더가 보여야 합니다
app, components, lib, supabase, package.json, tsconfig.json, next.config.mjs, postcss.config.mjs, tailwind.config.ts

## 분류가 안 맞을 때
`lib/analyze.ts` 의 `statusOf`(처리여부→신규/처리 중/완료), `methodOf`(원격/방문)
