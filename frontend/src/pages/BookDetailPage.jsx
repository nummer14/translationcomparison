import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function BookDetailPage() {
  const { bookId } = useParams();
  const [translations, setTranslations] = useState([]);
  const [reviews, setReviews] = useState({}); // 번역본ID별 리뷰 목록

  useEffect(() => {
    // 1. 번역본 목록 가져오기
    api
      .get(`/books/${bookId}/translations`)
      .then((res) => {
        setTranslations(res.data);
        // 2. 각 번역본의 리뷰 가져오기
        res.data.forEach((t) => loadReviews(t.id));
      })
      .catch((err) => console.error(err));
  }, [bookId]);

  const loadReviews = (tId) => {
    api
      .get(`/translations/${tId}/comments`)
      .then((res) => setReviews((prev) => ({ ...prev, [tId]: res.data })));
  };

  const submitReview = (tId, content, rating) => {
    api
      .post(`/translations/${tId}/comments`, { content, rating })
      .then(() => {
        alert("리뷰 등록 완료!");
        loadReviews(tId);
      })
      .catch(() => alert("로그인이 필요합니다."));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">번역본 비교</h1>
        <Link
          to={`/books/${bookId}/add`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + 번역본 등록하기
        </Link>
      </div>

      {translations.length === 0 ? (
        <p className="text-gray-500">
          등록된 번역본이 없습니다. 직접 등록해보세요!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {translations.map((t) => (
            <div key={t.id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-32 bg-gray-200 flex items-center justify-center overflow-hidden rounded border">
                  {t.imagePath ? (
                    <img
                      src={`http://localhost:8080/uploads/${t.imagePath}`}
                      alt="표지"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100?text=Error";
                      }} // 깨짐 방지
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.publisher}</h3>
                  <p className="text-gray-700">
                    역자: {t.translator} ({t.year})
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{t.description}</p>
                </div>
              </div>

              {/* 리뷰 영역 */}
              <div className="border-t pt-4">
                <h4 className="font-bold mb-2">
                  리뷰 ({reviews[t.id]?.length || 0})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                  {reviews[t.id]?.map((r) => (
                    <div key={r.id} className="bg-gray-50 p-2 rounded text-sm">
                      <span className="font-bold">⭐{r.rating}</span>{" "}
                      {r.content}
                    </div>
                  ))}
                </div>

                {/* 간단 리뷰 작성 폼 */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const content = e.target.content.value;
                    const rating = e.target.rating.value;
                    submitReview(t.id, content, parseInt(rating));
                    e.target.reset();
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="content"
                    className="border flex-1 rounded px-2 text-sm"
                    placeholder="평가 남기기..."
                    required
                  />
                  <select name="rating" className="border rounded text-sm">
                    <option value="5">5점</option>
                    <option value="4">4점</option>
                    <option value="3">3점</option>
                    <option value="2">2점</option>
                    <option value="1">1점</option>
                  </select>
                  <button className="bg-blue-500 text-white text-sm px-3 rounded">
                    등록
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
