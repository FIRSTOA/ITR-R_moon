# 퍼스트전산 IT AS 관리 (Next.js + Supabase + Vercel)

구글시트 → Supabase `IT_AS` 테이블에 쌓인 데이터를 화면으로 보여줍니다.

- 대시보드 / 업무 목록 / 업무 분배(해보지 않은 직원 추천) / 체크리스트

## 1. 컴퓨터에서 실행 (선택)
1. Node.js 설치 (https://nodejs.org → LTS)
2. 이 폴더에서 `.env.example` 파일을 복사해 `.env.local` 로 이름 변경
3. 안의 주소와 키를 Supabase 값으로 변경
4. 터미널에서 `npm install` → `npm run dev`
5. 브라우저에서 http://localhost:3000

## 2. GitHub에 올리기
1. GitHub Desktop 실행 → File → Add local repository → 이 폴더 선택
2. Publish repository (Private 권장) 클릭

`.env.local` 은 `.gitignore` 에 들어 있어 올라가지 않습니다.

## 3. Vercel 배포
1. vercel.com → Add New → Project → GitHub의 이 저장소 Import
2. Environment Variables 에 2개 입력
   - `NEXT_PUBLIC_SUPABASE_URL` = https://프로젝트.supabase.co (/rest/v1/ 붙이지 않음)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = sb_publishable_ 로 시작하는 키
3. Deploy

## 4. 화면 분류가 안 맞을 때
`lib/analyze.ts` 위쪽의 두 함수만 고치면 됩니다.
- `statusOf` : '처리여부' 칸의 단어 → 신규 / 처리 중 / 완료
- `methodOf` : 처리내용·증상·비고의 단어 → 원격 / 방문

'처리여부'에 실제로 어떤 값이 있는지 Supabase SQL Editor에서 확인:
```sql
select "처리여부", count(*) from public."IT_AS" group by 1 order by 2 desc;
```
