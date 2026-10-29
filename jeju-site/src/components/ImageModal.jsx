import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function ImageModal({ img, onClose }) {
  const { user } = useAuth();
  const { isFav, toggle } = useFavorites();
  const nav = useNavigate();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);

  const fav = isFav(img.id);
  function onFav() {
    if (!user) { nav("/login", { state: { from: "/gallery" } }); return; }
    toggle(img);
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="닫기">✕</button>
        <img src={img.large} alt={img.tags} />
        <div className="modal-info">
          <div className="tags">{img.tags.split(",").map((t) => <span key={t}>#{t.trim()}</span>)}</div>
          <div className="row">
            <button className={"btn" + (fav ? " on" : "")} onClick={onFav}>{fav ? "💖 찜 취소" : "🤍 찜하기"}</button>
            <a className="credit" href={img.pageURL} target="_blank" rel="noreferrer">
              📷 {img.user} · Pixabay
            </a>
          </div>
          {!user && <p className="muted small">찜하려면 로그인이 필요해요.</p>}
        </div>
      </div>
    </div>
  );
}
