import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Gallery from "./pages/Gallery.jsx";
import Favorites from "./pages/Favorites.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<p className="center">길을 잃었어요 🍊 <Link to="/">홈으로</Link></p>} />
        </Routes>
      </main>
      <footer className="footer">
        사진 제공 <a href="https://pixabay.com" target="_blank" rel="noreferrer">Pixabay</a> · 로그인 <a href="https://supabase.com" target="_blank" rel="noreferrer">Supabase</a> · 배포 Vercel
      </footer>
    </div>
  );
}
