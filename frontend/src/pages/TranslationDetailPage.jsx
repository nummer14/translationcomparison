import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function TranslationDetailPage() {
  const { translationId } = useParams();
  const navigate = useNavigate();
  const [translation, setTranslation] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    api.get(`/translations/${translationId}`) 
       .then(res => setTranslation(res.data))
       .catch(err => alert("정보를 불러오지 못했습니다."));

    loadComments();
    api.get('/users/me').then(res => setCurrentUser(res.data)).catch(() => {});
  }, [translationId]);

  const loadComments = () => {
    api.get(`/translations/${translationId}/comments`)
       .then(res => setComments(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    const rating = e.target.rating.value;
    
    api.post(`/translations/${translationId}/comments`, { content, rating: parseInt(rating) })
       .then(() => { alert("등록 완료"); e.target.reset(); loadComments(); })
       .catch(err => alert(err.response?.status === 401 ? "로그인 필요" : "오류 발생"));
  };

  const handleDeleteComment = (id) => {
    if(confirm("삭제하시겠습니까?")) {
      api.delete(`/comments/${id}`).then(() => { alert("삭제됨"); loadComments(); });
    }
  };

  const handleUpdateComment = (id) => {
    api.put(`/comments/${id}`, { content: editContent, rating: parseInt(editRating) })
       .then(() => { alert("수정되었습니다."); setEditingId(null); loadComments(); })
       .catch(() => alert("수정 실패"));
  };

  if (!translation) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-4 text-gray-500 hover:text-black">← 목록으로 돌아가기</button>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row mb-10">
        <div className="w-full md:w-1/3 bg-gray-100 aspect-[2/3] md:aspect-auto relative">
          {translation.imagePath ? (
            <img src={`http://localhost:8080/uploads/${translation.imagePath}`} className="w-full h-full object-cover" alt="표지" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}
        </div>
        
        <div className="p-8 flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{translation.publisher} ({translation.year})</h1>
            <p className="text-xl text-gray-700">역자: <span className="font-bold text-blue-600">{translation.translator}</span></p>
          </div>
          
          <div className="prose text-gray-600 mb-8 leading-relaxed">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">특징 및 설명</h3>
            {translation.description || "등록된 설명이 없습니다."}
          </div>

          {translation.externalLink && (
            <a 
              href={translation.externalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md w-fit"
            >
              🛒 미리보기 / 구매하러 가기
            </a>
          )}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">사용자 리뷰 ({comments.length})</h2>
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
          <textarea 
            name="content" 
            className="w-full border p-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3 min-h-[100px]" 
            placeholder="이 번역본의 장단점, 문체 등을 자세히 남겨주세요."
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">별점:</span>
              <select name="rating" className="border p-2 rounded">
                <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                <option value="4">⭐⭐⭐⭐ (4점)</option>
                <option value="3">⭐⭐⭐ (3점)</option>
                <option value="2">⭐⭐ (2점)</option>
                <option value="1">⭐ (1점)</option>
              </select>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">등록하기</button>
          </div>
        </form>
        <div className="space-y-6">
          {comments.map((c) => (
            <div key={c.id} className="border-b border-gray-100 pb-6">
              {editingId === c.id ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <textarea 
                    className="w-full border p-2 rounded mb-2" 
                    value={editContent} 
                    onChange={e => setEditContent(e.target.value)} 
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleUpdateComment(c.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">저장</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-300 px-3 py-1 rounded text-sm">취소</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{c.userNickname}</span>
                      <span className="text-yellow-500 text-sm">{"★".repeat(c.rating)}</span>
                      <span className="text-gray-400 text-xs ml-2">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    {currentUser && currentUser.id === c.userId && (
                      <div className="text-sm text-gray-400 flex gap-2">
                        <button onClick={() => { setEditingId(c.id); setEditContent(c.content); setEditRating(c.rating); }} className="hover:text-blue-600 underline">수정</button>
                        <button onClick={() => handleDeleteComment(c.id)} className="hover:text-red-600 underline">삭제</button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}