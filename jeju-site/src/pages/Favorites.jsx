import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImage } from "../lib/pixabay.js";
import { useFavorites } from "../context/FavoritesContext.jsx";
import ImageGrid from "../components/ImageGrid.jsx";
import ImageModal from "../components/ImageModal.jsx";

export default function Favorites() {
  const { ids, error } = useFavorites();
  const [cache, setCache] = useState({});          // id -> 이미지 정보
  const [open, setOpen] = useState(null);

  // 이미지는 Pixabay 규정에 따라 id 만 저장해 두고, 볼 때마다 다시 가져와요.
  useEffect(() => {
    ids.filter((id) => !cache[id]).slice(0, 30).forEach((id) => {
      getImage(id).then((img) => img && setCache((c) => ({ ...c, [id]: img }))).catch(() => {});
    });
  }, [ids]);   // eslint-disable-line react-hooks/exhaustive-deps

  const images = ids.map((id) => cache[id]).filter(Boolean);

  return (
    <section className="section">
      <h2>💖 내가 찜한 제주</h2>
      {error && <div className="notice err">{error}</div>}
      {ids.length === 0
        ? <p className="center muted">아직 찜한 사진이 없어요. <Link to="/gallery">갤러리</Link>에서 마음에 드는 사진을 찜해 보세요!</p>
        : <ImageGrid images={images} onOpen={setOpen} />}
      {ids.length > 0 && images.length < Math.min(ids.length, 30) && <p className="center muted">불러오는 중… 🍊</p>}
      {open && <ImageModal img={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
