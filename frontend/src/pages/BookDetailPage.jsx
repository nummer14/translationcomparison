import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function BookDetailPage() {
  const { bookId } = useParams();
  const [translations, setTranslations] = useState([]);
  const [reviews, setReviews] = useState({}); // 평점 계산용

  useEffect(() => {
    api.get(`/books/${bookId}/translations`)
      .then((res) => {
        setTranslations(res.data);
        res.data.forEach((t) => loadReviews(t.id));
      });
  }, [bookId]);

  const loadReviews = (tId) => {
    api.get(`/translations/${tId}/comments`)
       .then((res) => setReviews((prev) => ({ ...prev, [tId]: res.data })));
  };

  // 평균 평점 계산 함수
  const getAverageRating = (tId) => {
    const list = reviews[tId] || [];
    if (list.length === 0) return 0;
    const sum = list.reduce((a, b) => a + b.rating, 0);
    return (sum / list.length).toFixed(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold font-serif text-gray-900">번역본 목록</h1>
        <Link to={`/books/${bookId}/add`} className="bg-gray-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
          + 번역본 등록
        </Link>
      </div>

      <div className="space-y-6">
        {translations.map((t) => (
          // 카드를 클릭하면 상세 페이지로 이동
          <Link to={`/translations/${t.id}`} key={t.id} className="block bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition flex flex-col md:flex-row gap-6">
            
            {/* 왼쪽: 이미지 */}
            <div className="w-32 h-48 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
              {t.imagePath ? (
                <img src={`http://localhost:8080/uploads/${t.imagePath}`} className="w-full h-full object-cover" alt="표지" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
              )}
            </div>

            {/* 가운데: 정보 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{t.publisher}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{t.year}년</span>
              </div>
              <p className="text-lg text-gray-700 mb-2">역자: <span className="font-bold">{t.translator}</span></p>
              
              {/* 특징 설명 (말줄임 없이 2~3줄 정도) */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {t.description || "특징 설명이 없습니다."}
              </p>
            </div>

            {/* 오른쪽: 평점 및 바로가기 */}
            <div className="flex flex-col justify-center items-end min-w-[120px] border-l pl-6">
              <div className="text-center mb-4">
                <span className="block text-gray-400 text-xs uppercase tracking-wide">평균 별점</span>
                <span className="text-4xl font-bold text-yellow-500">{getAverageRating(t.id)}</span>
                <span className="text-gray-400 text-sm"> / 5.0</span>
                <p className="text-xs text-gray-400 mt-1">리뷰 {reviews[t.id]?.length || 0}개</p>
              </div>
              <span className="text-blue-600 text-sm font-bold hover:underline">상세보기 &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}