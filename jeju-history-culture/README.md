# 제주 역사문화 스탬프 투어 (API 호출 버전)

파일 대신 **API(`/api/places`)** 를 호출해 데이터를 받아오는 버전입니다. Vercel에 올리면 `api/` 폴더의 함수가 서버리스 API가 되고, `public/` 폴더가 화면이 됩니다.

## 폴더 구성
| 경로 | 역할 |
| --- | --- |
| `public/index.html` | 화면 (API로 데이터를 받아 지도·목록·코스 표시) |
| `public/images/` | 제주 구경하기 사진 (Wikimedia Commons, 출처는 화면 하단에 표기) |
| `api/places.js` | API 함수 |
| `data/places.json` | 두 CSV를 고유번호로 합친 데이터 (API가 읽음) |
| `vercel.json` | 함수에 `data/` 포함 설정 |
| `dev.mjs` | 내 컴퓨터에서 테스트하는 서버 (배포 불필요) |

## API 사용법
- `GET /api/places` : 전체 목록 `{ count, items }`
- `GET /api/places?q=고분` : 검색
- `GET /api/places?kind=자연` : 분야로 거르기
- `GET /api/places?id=367` : 한 곳 (없으면 404)

## 내 컴퓨터에서 테스트
```bash
node dev.mjs
```
http://localhost:3100 을 엽니다.

## Vercel 배포
1. 이 저장소(study)를 GitHub에 올려 둡니다. (이미 올라가 있다면 생략)
2. vercel.com 에서 **Add New → Project** 로 그 저장소를 가져옵니다. (Framework: Other, Root Directory 를 `jeju-history-culture` 로 지정, Framework: Other)
3. Deploy 를 누르면 `https://프로젝트이름.vercel.app` 주소가 생깁니다.

CLI로 배포하려면:
```bash
npm i -g vercel
vercel login
vercel --prod
```

## 출처
데이터: 공공데이터포털 · 제주특별자치도_제주역사문화일반정보, 제주특별자치도_제주역사문화위치정보 (데이터 기준일자 2022-12-09)
