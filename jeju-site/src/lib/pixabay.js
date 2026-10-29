// 브라우저는 Pixabay 를 직접 부르지 않고, 우리 서버리스 함수(/api/pixabay)를 통해서만 불러요. (API 키 보호)
async function call(params) {
  const res = await fetch("/api/pixabay?" + new URLSearchParams(params).toString());
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "이미지를 불러오지 못했어요.");
  return data;
}

export const searchImages = (q, page = 1, perPage = 24) => call({ q, page, per_page: perPage });

export async function getImage(id) {
  const data = await call({ id });
  return data.hits[0] || null;
}

// 제주 IP(캐릭터·명소) 주제들 — 홈과 갤러리 칩에서 같이 써요.
export const JEJU_TOPICS = [
  { emoji: "🍊", name: "감귤 · 귤이", q: "감귤", desc: "제주의 대표 얼굴, 새콤달콤 귤이!" },
  { emoji: "🗿", name: "돌하르방", q: "돌하르방", desc: "마을을 지키는 제주의 수호신" },
  { emoji: "🌋", name: "한라산", q: "한라산", desc: "제주의 한가운데 우뚝 솟은 산" },
  { emoji: "🌼", name: "유채꽃", q: "제주 유채꽃", desc: "봄이면 노랗게 물드는 들판" },
  { emoji: "🌅", name: "성산일출봉", q: "성산일출봉", desc: "바다 위로 해가 솟는 곳" },
  { emoji: "🐴", name: "조랑말", q: "제주 조랑말", desc: "작지만 튼튼한 제주 말" },
  { emoji: "🌊", name: "제주 바다", q: "제주 바다", desc: "에메랄드빛 파도" },
  { emoji: "🤿", name: "해녀", q: "해녀", desc: "바다의 살림꾼, 제주 해녀" },
  { emoji: "🏝️", name: "우도", q: "우도 제주", desc: "소를 닮은 아기자기한 섬" },
  { emoji: "🥾", name: "올레길", q: "제주 올레길", desc: "천천히 걷는 제주 길" },
];
