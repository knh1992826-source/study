import { useFavorites } from "../context/FavoritesContext.jsx";

// 이미지 카드 격자. 카드를 누르면 onOpen(img) 호출.
export default function ImageGrid({ images, onOpen }) {
  const { isFav } = useFavorites();
  return (
    <div className="grid">
      {images.map((img) => (
        <button key={img.id} className="card" onClick={() => onOpen(img)} style={{ aspectRatio: `${img.w} / ${img.h}` }}>
          <img src={img.thumb} alt={img.tags} loading="lazy" />
          {isFav(img.id) && <span className="heart">💖</span>}
          <span className="cap">{img.tags.split(",")[0]}</span>
        </button>
      ))}
    </div>
  );
}
