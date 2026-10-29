import { createClient } from "@supabase/supabase-js";

// 브라우저에서 쓰는 값이라 VITE_ 접두사가 필요해요. anon(공개) 키만 사용하세요. service_role 키는 절대 넣지 마세요!
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && key);
export const supabase = supabaseReady ? createClient(url, key) : null;
