import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminPage() {
  const [pendings, setPendings] = useState([]);

  const fetchPendings = () => {
    api.get('/admin/translations/pending')
       .then(res => setPendings(res.data))
       .catch(err => {
         console.error(err);
         alert("관리자 권한이 필요합니다.");
       });
  };

  useEffect(() => { fetchPendings(); }, []);

  const handleApprove = (id, isApproved) => {
    if(!window.confirm(isApproved ? "승인하시겠습니까?" : "거절하시겠습니까?")) return;
    
    api.post(`/admin/translations/${id}/approve?approve=${isApproved}`)
       .then(() => {
           alert("처리되었습니다.");
           fetchPendings();
       })
       .catch(() => alert("처리 실패"));
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        🛡️ 관리자 대시보드
      </h1>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">정보 확인</th> {/* 컬럼명 변경 */}
                <th className="p-4 border-b">출판사</th>
                <th className="p-4 border-b">역자 (년도)</th>
                <th className="p-4 border-b text-center">승인 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">
                    현재 승인 대기 중인 요청이 없습니다.
                  </td>
                </tr>
              ) : (
                pendings.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50/50 transition">
                    <td className="p-4 text-gray-500 font-mono text-xs">{t.id}</td>
                    
                    {/* ★★★ 상세보기 링크 추가 ★★★ */}
                    <td className="p-4">
                      <Link 
                        to={`/translations/${t.id}`} 
                        target="_blank" 
                        className="text-blue-600 hover:underline font-bold text-sm flex items-center gap-1"
                      >
                        📄 내용 보기 ↗
                      </Link>
                    </td>

                    <td className="p-4 font-bold text-gray-800">{t.publisher}</td>
                    <td className="p-4 text-gray-700">{t.translator} ({t.year})</td>
                    <td className="p-4 flex gap-2 justify-center">
                      <button 
                        onClick={() => handleApprove(t.id, true)}
                        className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 text-xs font-bold shadow-sm transition"
                      >
                        승인
                      </button>
                      <button 
                        onClick={() => handleApprove(t.id, false)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 text-xs font-bold shadow-sm transition"
                      >
                        거절
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}