import { Link, NavLink, useNavigate } from "react-router-dom";
import Mandarin from "./Mandarin.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, nickname, signOut, loading } = useAuth();
  const nav = useNavigate();

  async function onLogout() {
    await signOut();
    nav("/");
  }

  return (
    <header className="nav">
      <Link to="/" className="brand">
        <Mandarin size={40} />
        <span>제주 이야기</span>
      </Link>
      <nav className="links">
        <NavLink to="/gallery">갤러리</NavLink>
        <NavLink to="/favorites">내 찜</NavLink>
      </nav>
      <div className="auth">
        {loading ? null : user ? (
          <>
            <span className="hello">🍊 {nickname} 님</span>
            <button className="btn ghost" onClick={onLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link className="btn ghost" to="/login">로그인</Link>
            <Link className="btn" to="/signup">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}
