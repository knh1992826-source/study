import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import pixabayHandler from "./api/pixabay.js";

// 개발 서버(npm run dev)에서도 Vercel 서버리스 함수(/api/pixabay)가 똑같이 동작하게 해 주는 작은 플러그인.
// PIXABAY_API_KEY 는 .env.local 에서 읽고, 브라우저로는 절대 내려가지 않아요.
function devApi(env) {
  return {
    name: "dev-api-pixabay",
    configureServer(server) {
      server.middlewares.use("/api/pixabay", async (req, res) => {
        if (env.PIXABAY_API_KEY) process.env.PIXABAY_API_KEY = env.PIXABAY_API_KEY;
        const url = new URL(req.url, "http://localhost");
        req.query = Object.fromEntries(url.searchParams);
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (obj) => { res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(obj)); };
        await pixabayHandler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return { plugins: [react(), devApi(env)] };
});
