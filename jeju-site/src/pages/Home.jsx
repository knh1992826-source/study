import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Mandarin from "../components/Mandarin.jsx";
import { JEJU_TOPICS, searchImages } from "../lib/pixabay.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user, nickname } = useAuth();
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    searchImages("제주도 풍경", 1, 8).then((d) => setPreview(d.hits.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="pill">🌋 제주 IP 이야기 사이트</p>
          <h1>혼저 옵서예,<br />귤이와 함께 제주로! 🍊</h1>
          <p className="lead">
            돌하르방, 한라산, 유채꽃, 감귤… 제주의 이야기를 사진으로 모아 보고, 마음에 드는 장면은 내 찜 목록에 담아 보세요.
          </p>
          <div className="cta">
            <Link className="btn big" to="/gallery">사진 구경하기</Link>
            {user
              ? <span className="hello-big">어서 와요, {nickname} 님! 💛</span>
              : <Link className="btn big ghost" to="/signup">무료로 가입하기</Link>}
          </div>
        </div>
        <div className="hero-art"><Mandarin size={230} className="bounce" /><span className="speech">혼저 옵서예~!</span></div>
      </section>

      <section className="section">
        <h2>제주 IP 모아보기</h2>
        <p className="muted">궁금한 주제를 누르면 사진이 쏟아져요.</p>
        <div className="topics">
          {JEJU_TOPICS.map((t) => (
            <Link key={t.q} to={`/gallery?q=${encodeURIComponent(t.q)}`} className="topic">
              <span className="emo">{t.emoji}</span>
              <b>{t.name}</b>
              <small>{t.desc}</small>
            </Link>
          ))}
        </div>
      </section>

      {preview.length > 0 && (
        <section className="section">
          <h2>오늘의 제주 풍경</h2>
          <div className="strip">
            {preview.map((p) => (
              <Link key={p.id} to="/gallery?q=제주도 풍경"><img src={p.thumb} alt={p.tags} loading="lazy" /></Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
