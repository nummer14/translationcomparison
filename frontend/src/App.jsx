import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MyPage from "./pages/MyPage";
import BookDetailPage from "./pages/BookDetailPage";
import TranslationFormPage from "./pages/TranslationFormPage";
import TranslationDetailPage from "./pages/TranslationDetailPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/books/:bookId" element={<BookDetailPage />} />
            <Route path="/books/:bookId/add" element={<TranslationFormPage />} />
            <Route path="/translations/:translationId" element={<TranslationDetailPage />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function LoginSuccess() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("token", token);
    window.location.href = "/"; // 메인으로 리다이렉트
  }
  return <div className="text-center mt-10">로그인 처리 중...</div>;
}

export default App;