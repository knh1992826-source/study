import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authMessage, useAuth } from "../context/AuthContext.jsx";
import { supabaseReady } from "../lib/supabase.js";
import SetupNotice from "../components/SetupNotice.jsx";
import Mandarin from "../components/Mandarin.jsx";

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!supabaseReady) return;
    setBusy(true); setMsg("");
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) setMsg(authMessage(error));
    else nav(loc.state?.from || "/", { replace: true });    // 보호된 페이지에서 왔다면 거기로 돌아가요
  }

  return (
    <section className="auth-box">
      <Mandarin size={90} />
      <h2>로그인</h2>
      <SetupNotice />
      <form onSubmit={onSubmit}>
        <label>이메일<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
        <label>비밀번호<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="비밀번호" /></label>
        {msg && <p className="err-text">{msg}</p>}
        <button className="btn big" disabled={busy || !supabaseReady}>{busy ? "확인 중…" : "로그인"}</button>
      </form>
      <p className="muted">아직 회원이 아니에요? <Link to="/signup">회원가입</Link></p>
    </section>
  );
}
