# 🍊 제주 이야기 (Vite + React + Supabase + Pixabay + Vercel)

제주 IP(귤이·돌하르방·한라산·유채꽃…)를 사진으로 모아 보는 사이트예요.

| 기능 | 사용 기술 |
|---|---|
| 회원가입 · 로그인 · 로그아웃 | Supabase Auth (이메일/비밀번호) |
| 제주 사진 검색 · 갤러리 | Pixabay API (서버리스 함수로 키 보호) |
| 사진 찜하기 (로그인한 사람만) | Supabase DB + RLS |
| 배포 | Vercel (정적 사이트 + `/api/pixabay` 서버리스 함수) |

## 폴더 구조
```
jeju-site/
├─ api/pixabay.js          ← Vercel 서버리스 함수 (Pixabay 키는 여기서만 사용)
├─ supabase/schema.sql     ← favorites 테이블 + 보안 규칙(RLS)
├─ src/                    ← React 코드 (페이지·컴포넌트·Auth 컨텍스트)
├─ .env.example            ← 환경변수 샘플 (복사해서 .env.local 로 사용)
└─ vercel.json             ← SPA 새로고침 404 방지
```

---

## 1단계. 환경변수 3개 만들기

| 변수 이름 | 어디서 얻나 | 브라우저에 노출? |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase 대시보드 → **Project Settings → API** → *Project URL* | 예 (공개 OK) |
| `VITE_SUPABASE_ANON_KEY` | 같은 화면 → *anon public* (또는 *Publishable*) 키 | 예 (공개 OK, RLS 로 보호) |
| `PIXABAY_API_KEY` | https://pixabay.com/api/docs/ 에 **로그인**하면 문서 안에 키가 보여요 | **아니요 (서버 전용)** |

> ⚠️ `service_role` 키는 절대 쓰지 마세요. `PIXABAY_API_KEY` 에는 `VITE_` 를 붙이지 마세요(붙이면 브라우저에 공개돼요).

### 1-1. Supabase 프로젝트 만들기
1. https://supabase.com 가입 → **New project** (이름, DB 비밀번호, 지역은 *Northeast Asia (Seoul)* 추천)
2. 프로젝트가 만들어지면 **Project Settings → API** 에서 URL 과 anon 키를 복사해 둬요.

### 1-2. 테이블 만들기
1. 왼쪽 메뉴 **SQL Editor → New query**
2. `supabase/schema.sql` 내용을 붙여넣고 **Run**

### 1-3. 로그인 설정
1. **Authentication → Providers → Email** 이 켜져 있는지 확인
2. 처음 테스트할 때 편하게 하려면 **Authentication → Sign In / Providers → Email → "Confirm email" 끄기**
   (켜 두면 가입 후 메일 인증을 해야 로그인돼요. 이 앱은 두 경우 모두 안내 문구가 나와요)
3. **Authentication → URL Configuration**
   - *Site URL*: 배포한 주소 (예: `https://내프로젝트.vercel.app`) — 배포 후에 수정
   - *Redirect URLs* 에 추가: `http://localhost:5173` 과 `https://내프로젝트.vercel.app`

### 1-4. Pixabay 키
1. https://pixabay.com 가입/로그인 → https://pixabay.com/api/docs/ 접속
2. 문서 상단 "Parameters" 근처에 `key` 값이 표시돼요 → 복사

---

## 2단계. 내 컴퓨터에서 실행
Node.js 18 이상이 필요해요 (https://nodejs.org 의 LTS).

```bash
cd jeju-site
copy .env.example .env.local      # (Mac/Linux: cp .env.example .env.local)
# .env.local 을 열어 3개 값을 채워요
npm install
npm run dev                        # http://localhost:5173
```
`npm run dev` 에서도 `/api/pixabay` 가 똑같이 동작해요 (vite.config.js 의 작은 플러그인 덕분).

---

## 3단계. GitHub 에 올리기
`.env.local` 은 `.gitignore` 에 있어서 올라가지 않아요. (키가 GitHub 에 올라가면 안 돼요!)
```bash
git add jeju-site
git commit -m "Add Jeju site"
git push
```

## 4단계. Vercel 에 배포하고 환경변수 등록
1. https://vercel.com 에 GitHub 로 로그인 → **Add New → Project** → 저장소 **Import**
2. **Root Directory** 를 `jeju-site` 로 바꿔요 (저장소 안의 하위 폴더일 때). Framework 는 *Vite* 로 자동 인식돼요.
3. **Environment Variables** 에 3개를 등록해요 (Name / Value, 환경은 Production·Preview·Development 모두 체크)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `PIXABAY_API_KEY`
4. **Deploy** → 완료되면 `https://….vercel.app` 주소가 생겨요.
5. 그 주소를 Supabase **Authentication → URL Configuration** 의 *Site URL* 과 *Redirect URLs* 에 넣어요.
6. 환경변수를 나중에 바꿨다면 Vercel **Deployments → ⋯ → Redeploy** 를 해야 반영돼요.
   (`VITE_` 변수는 빌드할 때 코드에 박히기 때문이에요.)

---

## 자주 겪는 문제
| 증상 | 해결 |
|---|---|
| 화면에 "Supabase 환경변수가 아직 없어요" | `.env.local` 값을 확인하고 `npm run dev` 를 껐다 켜기 / Vercel 은 Redeploy |
| 사진이 안 나오고 "PIXABAY_API_KEY 환경변수가…" | Vercel(또는 `.env.local`)에 `PIXABAY_API_KEY` 등록 |
| 가입했는데 로그인이 안 돼요 | 이메일 인증 메일 확인 (또는 1-3 의 Confirm email 끄기) |
| 찜이 저장되지 않아요 | `supabase/schema.sql` 을 실행했는지 확인 |
| 새로고침하면 404 | `vercel.json` 이 있는지, Root Directory 가 `jeju-site` 인지 확인 |

## Pixabay 이용 안내
이미지는 Pixabay 에서 가져오며, 찜 목록에는 이미지 자체가 아니라 **id 만** 저장하고 볼 때마다 다시 불러와요. 각 사진에서 작가와 Pixabay 링크를 보여줘요.
