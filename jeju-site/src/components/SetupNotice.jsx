import { supabaseReady } from "../lib/supabase.js";

// Supabase 환경변수가 아직 없을 때 보여 주는 안내 (개발 중에 헷갈리지 않게)
export default function SetupNotice() {
  if (supabaseReady) return null;
  return (
    <div className="notice">
      <b>⚙️ Supabase 환경변수가 아직 없어요.</b>
      <p>
        <code>.env.local</code> 에 <code>VITE_SUPABASE_URL</code> 과 <code>VITE_SUPABASE_ANON_KEY</code> 를 넣고
        개발 서버를 다시 켜 주세요. 자세한 순서는 README.md 를 봐 주세요.
      </p>
    </div>
  );
}
