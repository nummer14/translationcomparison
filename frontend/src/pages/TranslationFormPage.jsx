import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TranslationFormPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('translator', e.target.translator.value);
    formData.append('publisher', e.target.publisher.value);
    formData.append('year', e.target.year.value);
    formData.append('description', e.target.description.value);
    
    // 파일이 있을 때만 추가
    if (e.target.coverImage.files[0]) {
      formData.append('coverImage', e.target.coverImage.files[0]);
    }

    try {
      // Content-Type을 multipart/form-data로 설정
      await api.post(`/books/${bookId}/translations`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('등록 요청 완료! 관리자 승인 후 표시됩니다.');
      navigate(`/books/${bookId}`);
    } catch (err) {
      alert('등록 실패! 로그인 상태를 확인하세요.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">번역본 정보 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">출판사</label>
          <input name="publisher" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">번역가</label>
          <input name="translator" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">출판년도</label>
          <input name="year" type="number" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">특징 설명</label>
          <textarea name="description" className="w-full border p-2 rounded" rows="3"></textarea>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">표지 이미지</label>
          <input name="coverImage" type="file" className="w-full border p-2 rounded" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
          등록 요청
        </button>
      </form>
    </div>
  );
}