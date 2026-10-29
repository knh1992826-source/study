import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { JEJU_TOPICS, searchImages } from "../lib/pixabay.js";
import ImageGrid from "../components/ImageGrid.jsx";
import ImageModal from "../components/ImageModal.jsx";

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "제주도";
  const [text, setText] = useState(q);
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading");   // loading | ready | error
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);
  const seq = useRef(0);

  useEffect(() => {
    setText(q); setImages([]); setPage(1); setStatus("loading");
    const my = ++seq.current;                        // 빨리 다른 주제를 누르면 이전 결과는 버려요
    searchImages(q, 1).then((d) => {
      if (my !== seq.current) return;
      setImages(d.hits); setTotal(d.total); setStatus("ready");
    }).catch((e) => { if (my === seq.current) { setError(e.message); setStatus("error"); } });
  }, [q]);

  async function more() {
    const next = page + 1, my = seq.current;
    setStatus("loading");
    try {
      const d = await searchImages(q, next);
      if (my !== seq.current) return;
      setImages((prev) => [...prev, ...d.hits.filter((h) => !prev.some((p) => p.id === h.id))]);
      setPage(next); setStatus("ready");
    } catch (e) { setError(e.message); setStatus("error"); }
  }

  const onSearch = (e) => { e.preventDefault(); const t = text.trim(); if (t) setParams({ q: t }); };

  return (
    <section className="section">
      <h2>제주 갤러리</h2>
      <form className="search" onSubmit={onSearch}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="예: 한라산, 돌하르방, 유채꽃" />
        <button className="btn">검색</button>
      </form>
      <div className="chips">
        {JEJU_TOPICS.map((t) => (
          <button key={t.q} className={"chip" + (t.q === q ? " on" : "")} onClick={() => setParams({ q: t.q })}>{t.emoji} {t.name}</button>
        ))}
      </div>

      {status === "error" && <div className="notice err">😢 {error}</div>}
      {status === "ready" && images.length === 0 && <p className="center muted">“{q}” 사진을 찾지 못했어요. 다른 말로 검색해 보세요!</p>}
      <ImageGrid images={images} onOpen={setOpen} />
      {status === "loading" && <p className="center muted">귤이가 사진을 가져오는 중… 🍊</p>}
      {status === "ready" && images.length < total && (
        <div className="center"><button className="btn big" onClick={more}>더 보기</button></div>
      )}
      {open && <ImageModal img={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
