import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// 로그인한 사람만 볼 수 있는 페이지를 감싸요. 아니면 로그인 페이지로 보내고, 로그인 뒤 원래 페이지로 돌아와요.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <p className="center muted">잠깐만요…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
  return children;
}
