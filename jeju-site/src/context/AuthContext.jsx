import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase.js";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    // 새로고침해도 로그인 상태 유지 (Supabase 가 브라우저에 세션을 저장해 둬요)
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => {
    const user = session?.user ?? null;
    return {
      user,
      loading,
      nickname: user?.user_metadata?.nickname || user?.email?.split("@")[0] || "",
      // 회원가입: 닉네임은 user_metadata 에 저장돼요.
      signUp: (email, password, nickname) =>
        supabase.auth.signUp({ email, password, options: { data: { nickname }, emailRedirectTo: window.location.origin } }),
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signOut: () => supabase.auth.signOut(),
    };
  }, [session, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// Supabase 영어 오류를 쉬운 한국어로
export function authMessage(error) {
  const m = (error?.message || "").toLowerCase();
  if (m.includes("invalid login")) return "이메일 또는 비밀번호가 올바르지 않아요.";
  if (m.includes("email not confirmed")) return "이메일 인증이 아직이에요. 메일함의 인증 링크를 눌러 주세요.";
  if (m.includes("already registered") || m.includes("already been registered")) return "이미 가입된 이메일이에요. 로그인해 주세요.";
  if (m.includes("password") && m.includes("least")) return "비밀번호는 6자 이상이어야 해요.";
  if (m.includes("rate limit")) return "너무 자주 시도했어요. 잠시 뒤에 다시 해 주세요.";
  if (m.includes("valid email") || m.includes("invalid email")) return "이메일 형식을 확인해 주세요.";
  return error?.message || "문제가 생겼어요. 잠시 뒤에 다시 해 주세요.";
}
