import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TranslationFormPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('translator', e.target.translator.value);
    formData.append('publisher', e.target.publisher.value);
    formData.append('year', e.target.year.value);
    formData.append('description', e.target.description.value);
    
    // ★ 링크 추가
    formData.append('externalLink', e.target.externalLink.value);
    
    if (e.target.coverImage.files[0]) {
      formData.append('coverImage', e.target.coverImage.files[0]);
    }

    try {
      await api.post(`/books/${bookId}/translations`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('등록 요청이 완료되었습니다.\n관리자 승인 후 목록에 표시됩니다.');
      navigate(`/books/${bookId}`);
    } catch (err) {
      alert('등록 실패! 로그인 상태를 확인해주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">📝 새 번역본 등록 요청</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* 기존 입력 필드들 */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">출판사</label>
          <input name="publisher" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="예: 민음사" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">번역가</label>
          <input name="translator" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="예: 김철수" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">출판년도</label>
          <input name="year" type="number" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2023" required />
        </div>

        {/* ★★★ [추가] 구매/미리보기 링크 ★★★ */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">구매/미리보기 링크 (선택)</label>
          <input name="externalLink" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="예: 알라딘, Yes24, 교보문고 도서 링크 URL" />
          <p className="text-xs text-gray-400 mt-1">서점의 '미리보기' 페이지나 도서 상세 페이지 주소를 복사해서 넣어주세요.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">특징 설명</label>
          <textarea name="description" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="4" placeholder="이 번역본의 특징을 적어주세요."></textarea>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">표지 이미지</label>
          <input name="coverImage" type="file" accept="image/*" className="w-full border border-gray-300 p-2 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        
        <button 
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-bold text-white transition shadow-sm ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? '처리 중...' : '등록 요청하기'}
        </button>
      </form>
    </div>
  );
}