# ITR-R_moon v0.3.1 (껍데기)

퍼스트전산 ERP 진행상황 대시보드의 화면 틀만 반영한 버전입니다.
샘플 데이터로 표시되며, **환경변수가 필요 없습니다.**

## 배포 방법 (중요)
1. GitHub 저장소를 **비어 있는 상태**로 만듭니다. (이전 파일이 남아 있으면 오류가 납니다)
2. 이 ZIP의 압축을 풀고, `ITR-R_moon` 폴더 **안의 내용 전체**를 저장소에 올립니다.
3. Vercel에서 Import → Deploy (환경변수 입력 없음).

## 구조
- 화면: `components/Dashboard.tsx`, `components/Sidebar.tsx`
- 샘플 데이터: `lib/sample.ts`  ← 나중에 실제 데이터로 교체
- 메뉴: `lib/menus.ts`
