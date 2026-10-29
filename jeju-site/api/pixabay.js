// Vercel 서버리스 함수: Pixabay API 를 대신 호출해 줘요.
// API 키(PIXABAY_API_KEY)는 서버 환경변수에만 있고 브라우저에는 절대 내려가지 않아요.
//   GET /api/pixabay?q=한라산&page=1&per_page=24   → 검색
//   GET /api/pixabay?id=12345                       → 이미지 한 장 (즐겨찾기 목록용)
export default async function handler(req, res) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return res.status(500).json({ error: "서버에 PIXABAY_API_KEY 환경변수가 설정되지 않았어요." });

  const { q = "제주도", page = "1", per_page = "24", id } = req.query || {};
  const params = new URLSearchParams({ key, image_type: "photo", lang: "ko", safesearch: "true" });
  if (id) {
    params.set("id", String(id).replace(/[^0-9]/g, ""));
  } else {
    params.set("q", String(q).slice(0, 100));
    params.set("page", String(Math.max(1, parseInt(page, 10) || 1)));
    params.set("per_page", String(Math.min(50, Math.max(3, parseInt(per_page, 10) || 24))));
  }

  try {
    const r = await fetch("https://pixabay.com/api/?" + params.toString());
    if (!r.ok) return res.status(r.status).json({ error: "Pixabay 응답 오류 (" + r.status + ")" });
    const d = await r.json();
    const hits = (d.hits || []).map((h) => ({
      id: h.id,
      tags: h.tags,
      thumb: h.webformatURL,
      large: h.largeImageURL,
      w: h.imageWidth,
      h: h.imageHeight,
      user: h.user,
      pageURL: h.pageURL,
    }));
    // 같은 검색은 1시간 동안 캐시해서 Pixabay 호출 횟수(분당 100회 제한)를 아껴요.
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ total: d.totalHits || 0, hits });
  } catch (e) {
    return res.status(502).json({ error: "Pixabay 에 연결하지 못했어요." });
  }
}
