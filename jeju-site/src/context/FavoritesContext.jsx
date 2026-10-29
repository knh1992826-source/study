import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "./AuthContext.jsx";

const FavCtx = createContext(null);
export const useFavorites = () => useContext(FavCtx);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState([]);          // 최근에 찜한 순서의 pixabay id 목록
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase || !user) { setIds([]); return; }
    supabase.from("favorites").select("pixabay_id").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("찜 목록을 불러오지 못했어요. (supabase/schema.sql 을 실행했는지 확인해 주세요)");
        else { setError(""); setIds((data || []).map((r) => Number(r.pixabay_id))); }
      });
  }, [user]);

  const toggle = useCallback(async (img) => {
    if (!supabase || !user) return;
    const has = ids.includes(img.id);
    setIds((prev) => (has ? prev.filter((x) => x !== img.id) : [img.id, ...prev]));      // 먼저 화면을 바꾸고
    const { error } = has
      ? await supabase.from("favorites").delete().eq("pixabay_id", img.id)
      : await supabase.from("favorites").insert({ pixabay_id: img.id, tags: img.tags });
    if (error) { setError("저장하지 못했어요."); setIds((prev) => (has ? [img.id, ...prev] : prev.filter((x) => x !== img.id))); }   // 실패하면 되돌려요
  }, [ids, user]);

  const value = useMemo(() => ({ ids, error, toggle, isFav: (id) => ids.includes(id) }), [ids, error, toggle]);
  return <FavCtx.Provider value={value}>{children}</FavCtx.Provider>;
}
