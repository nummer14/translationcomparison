import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("BOOKMARKS");
  const [user, setUser] = useState(null);
  
  // 데이터 상태
  const [bookmarks, setBookmarks] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [myTranslations, setMyTranslations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // 1. 유저 정보
    api.get("/users/me").then((res) => setUser(res.data)).catch(() => navigate("/login"));

    // 2. 찜 목록
    api.get("/bookmarks/me").then((res) => setBookmarks(res.data));

    // 3. 내 리뷰 목록
    api.get("/users/me/comments").then((res) => setMyComments(res.data));

    // 4. 내 번역본 등록 현황
    api.get("/users/me/translations").then((res) => setMyTranslations(res.data));

  }, [navigate]);

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      {/* 1. 프로필 카드 */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 mb-10">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
          👤
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.nickname}님</h1>
          <p className="text-gray-500">{user.email}</p>
          <div className="flex gap-3 mt-2">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
              {user.role === 'ADMIN' ? '관리자' : '일반 회원'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. 탭 메뉴 */}
      <div className="flex border-b border-gray-200 mb-8">
        {[
          { key: "BOOKMARKS", label: "❤️ 찜한 책" },
          { key: "REVIEWS", label: "✍️ 내가 쓴 리뷰" },
          { key: "SUBMISSIONS", label: "📤 등록 현황" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-bold text-sm transition-all ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. 탭 내용 */}
      
      {/* TAB 1: 찜한 책 */}
      {activeTab === "BOOKMARKS" && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {bookmarks.length === 0 ? (
            <p className="col-span-full text-center py-10 text-gray-400">찜한 책이 없습니다.</p>
          ) : (
            bookmarks.map((book) => (
              <Link key={book.id} to={`/books/${book.id}`} className="group block">
                <div className="w-full aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden shadow-md group-hover:-translate-y-1 transition mb-3">
                  {book.imagePath ? (
                    <img src={`http://localhost:8080/uploads/${book.imagePath}`} className="w-full h-full object-cover" alt={book.title} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">📘</div>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 text-sm truncate">{book.title}</h3>
                <p className="text-xs text-gray-500">{book.originalAuthor}</p>
              </Link>
            ))
          )}
        </div>
      )}

      {/* TAB 2: 내가 쓴 리뷰 */}
      {activeTab === "REVIEWS" && (
        <div className="space-y-4">
          {myComments.length === 0 ? (
            <p className="text-center py-10 text-gray-400">작성한 리뷰가 없습니다.</p>
          ) : (
            myComments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link to={`/translations/${comment.translationId}`} className="font-bold text-gray-900 hover:text-blue-600">
                      {comment.bookTitle} <span className="text-gray-400 font-normal">| {comment.publisher}</span>
                    </Link>
                  </div>
                  <span className="text-yellow-500 text-sm">{"★".repeat(comment.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{comment.content}</p>
                <div className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: 번역본 등록 현황 */}
      {activeTab === "SUBMISSIONS" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">책 제목</th>
                <th className="p-4">출판사/역자</th>
                <th className="p-4">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myTranslations.length === 0 ? (
                <tr><td colSpan="3" className="p-6 text-center text-gray-400">등록 요청한 내역이 없습니다.</td></tr>
              ) : (
                myTranslations.map((t) => (
                  <tr key={t.id}>
                    <td className="p-4 font-bold text-gray-800">{t.bookTitle}</td>
                    <td className="p-4 text-gray-600">{t.publisher} / {t.translator}</td>
                    <td className="p-4">
                      {t.status === 'APPROVED' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">승인됨</span>}
                      {t.status === 'PENDING' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">대기 중</span>}
                      {t.status === 'REJECTED' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">거절됨</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}