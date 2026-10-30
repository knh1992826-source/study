// GET /api/places            → 전체 목록 { count, items }
// GET /api/places?q=고분      → 장소명·주소·내용 등에서 검색
// GET /api/places?kind=자연   → 분야(디렉토리1)로 거르기
// GET /api/places?id=367     → 장소 1건 (없으면 404)
// 데이터: 공공데이터포털 제주특별자치도_제주역사문화일반정보 + 위치정보(2022-12-09)를 고유번호로 합친 data/places.json
const places = require('../data/places.json')

const clean = (v) => (v && v !== '해당없음' ? v : '')
const kindOf = (d) => clean(d.dir1) || clean(d.category) || '기타'

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

  const { q = '', kind = '', id = '', limit = '' } = req.query ?? {}

  if (id) {
    const item = places.find((d) => String(d.id) === String(id))
    if (!item) return res.status(404).json({ error: '해당 장소를 찾을 수 없습니다.' })
    return res.status(200).json(item)
  }

  let items = places
  if (kind) items = items.filter((d) => kindOf(d) === String(kind))
  const keyword = String(q).trim().toLowerCase()
  if (keyword) {
    items = items.filter((d) =>
      [d.name, d.address, d.title, d.subtitle, d.dir1, d.dir2, d.content, d.subject].join(' ').toLowerCase().includes(keyword),
    )
  }
  const n = Number(limit)
  if (Number.isInteger(n) && n > 0) items = items.slice(0, n)

  res.status(200).json({
    count: items.length,
    source: '공공데이터포털 제주특별자치도_제주역사문화일반정보·위치정보 (데이터 기준일자 2022-12-09)',
    items,
  })
}
