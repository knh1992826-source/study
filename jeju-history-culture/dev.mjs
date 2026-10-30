// 로컬 테스트용 서버: public/ 정적 파일 + /api/* 함수를 Vercel 처럼 흉내 낸다. (배포에는 필요 없음)
// 실행: node dev.mjs  →  http://localhost:3100
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = path.dirname(fileURLToPath(import.meta.url))
const TYPES = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css' }

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname.startsWith('/api/')) {
    const name = url.pathname.slice(5).replace(/[^\w-]/g, '')
    let handler
    try { handler = require(path.join(root, 'api', `${name}.js`)) } catch { res.writeHead(404); return res.end('no such api') }
    req.query = Object.fromEntries(url.searchParams)
    res.status = (code) => { res.statusCode = code; return res }
    res.json = (obj) => res.end(JSON.stringify(obj))
    return handler(req, res)
  }
  const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1))
  const file = path.join(root, 'public', rel)
  if (!file.startsWith(path.join(root, 'public')) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('not found') }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
}).listen(3100, () => console.log('http://localhost:3100'))
