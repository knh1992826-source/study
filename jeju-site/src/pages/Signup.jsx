import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authMessage, useAuth } from "../context/AuthContext.jsx";
import { supabaseReady } from "../lib/supabase.js";
import SetupNotice from "../components/SetupNotice.jsx";
import Mandarin from "../components/Mandarin.jsx";

export default function Signup() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!supabaseReady) return;
    if (password.length < 6) return setMsg("비밀번호는 6자 이상이어야 해요.");
    if (password !== password2) return setMsg("비밀번호가 서로 달라요.");
    setBusy(true); setMsg("");
    const { data, error } = await signUp(email.trim(), password, nickname.trim());
    setBusy(false);
    if (error) return setMsg(authMessage(error));
    // 이메일 인증을 켜 둔 프로젝트는 session 이 아직 없어요 → 메일함 안내
    if (data.session) nav("/", { replace: true });
    else setDone(true);
  }

  if (done) {
    return (
      <section className="auth-box">
        <Mandarin size={90} />
        <h2>메일함을 확인해 주세요 💌</h2>
        <p><b>{email}</b> 로 인증 메일을 보냈어요.<br />메일의 링크를 누르면 가입이 끝나요!</p>
        <button className="btn big" onClick={() => nav("/login")}>로그인하러 가기</button>
      </section>
    );
  }

  return (
    <section className="auth-box">
      <Mandarin size={90} />
      <h2>회원가입</h2>
      <SetupNotice />
      <form onSubmit={onSubmit}>
        <label>닉네임<input required maxLength={20} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="귤이친구" /></label>
        <label>이메일<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
        <label>비밀번호 (6자 이상)<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></label>
        <label>비밀번호 확인<input type="password" required value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" /></label>
        {msg && <p className="err-text">{msg}</p>}
        <button className="btn big" disabled={busy || !supabaseReady}>{busy ? "가입 중…" : "가입하기"}</button>
      </form>
      <p className="muted">이미 회원이에요? <Link to="/login">로그인</Link></p>
    </section>
  );
}
