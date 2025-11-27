import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.auth && payload.auth.includes('ROLE_ADMIN')) {
          setIsAdmin(true);
        }
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900 flex items-center gap-2 font-serif tracking-wide hover:opacity-80 transition">
          <span className="text-blue-600 text-3xl">N</span>uance
        </Link>
        
        <div className="flex items-center gap-6">
          {isAdmin && (
            <Link to="/admin" className="text-sm font-bold text-red-500 hover:text-red-700 transition">
              🛡️ 관리자 페이지
            </Link>
          )}

          {!token ? (
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                로그인
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition shadow-md">
                시작하기
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link to="/mypage" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                마이페이지
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-100 rounded-full hover:bg-red-50 transition"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}