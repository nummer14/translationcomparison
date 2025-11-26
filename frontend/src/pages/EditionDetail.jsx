import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditionDetail() {
  const { id } = useParams(); // URL의 editionId
  const navigate = useNavigate();
  
  const [edition, setEdition] = useState(null); // 번역본 정보 (일단 생략하거나 별도 조회 필요)
  const [reviews, setReviews] = useState([]);
  
  // 입력 폼 상태
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchReviews();
    // (참고) 번역본 상세 정보 API는 아직 안 만들었으므로, UI에는 "번역본 ID: {id}" 라고만 표시합니다.
    // 시간이 남으면 EditionController에 @GetMapping("/editions/{id}") 추가해서 가져오면 됩니다.
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/editions/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/editions/${id}/reviews`, {
        rating: Number(rating),
        content
      });
      alert("리뷰 등록 완료!");
      setContent("");
      fetchReviews(); // 목록 갱신
    } catch (err) {
      alert("등록 실패 (로그인 했나요?)");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)}>← 뒤로 가기</button>
      
      <h2>📝 번역본 리뷰 페이지</h2>
      <p style={{ color: "#666" }}>번역본 ID: {id} (여기에 민음사/김영하 정보가 뜨면 좋음)</p>

      <hr />

      {/* 1. 리뷰 작성 폼 */}
      <div style={{ background: "#f0f8ff", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
        <h4>리뷰 남기기</h4>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>별점: </label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
              <option value="4">⭐⭐⭐⭐ (4점)</option>
              <option value="3">⭐⭐⭐ (3점)</option>
              <option value="2">⭐⭐ (2점)</option>
              <option value="1">⭐ (1점)</option>
            </select>
          </div>
          <textarea 
            placeholder="이 번역은 어땠나요? (예: 직역이라 조금 딱딱해요)" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", height: "80px" }}
            required
          />
          <button type="submit" style={{ marginTop: "10px", width: "100%" }}>등록하기</button>
        </form>
      </div>

      {/* 2. 리뷰 목록 */}
      <h3>💬 사용자 리뷰 ({reviews.length})</h3>
      {reviews.length === 0 ? <p>아직 리뷰가 없습니다. 첫 리뷰를 남겨보세요!</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reviews.map((review) => (
            <li key={review.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{review.writerNickname}</strong>
                <span style={{ color: "orange" }}>{"⭐".repeat(review.rating)}</span>
              </div>
              <p style={{ margin: "5px 0" }}>{review.content}</p>
              <small style={{ color: "#aaa" }}>{review.createdAt.split("T")[0]}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}