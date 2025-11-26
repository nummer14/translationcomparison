import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import BookDetailPage from "./pages/BookDetailPage";
import TranslationFormPage from "./pages/TranslationFormPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {/* 상단 네비게이션 바 */}
        <nav className="bg-white shadow p-4 mb-6">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              📚 번역비교
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-gray-600 hover:text-blue-600">
                관리자
              </Link>

              {!token ? (
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  로그인
                </Link>
              ) : (
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-500"
                >
                  로그아웃
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* 페이지 내용이 나오는 곳 */}
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/books/:bookId" element={<BookDetailPage />} />
            <Route
              path="/books/:bookId/add"
              element={<TranslationFormPage />}
            />
            <Route path="/login-success" element={<LoginSuccess />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// 소셜 로그인 성공 시 토큰 처리용
function LoginSuccess() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("token", token);
    window.location.href = "/";
  }
  return <div>로그인 처리 중...</div>;
}

export default App;
