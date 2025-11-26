import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminPage() {
  const [pendings, setPendings] = useState([]);

  const fetchPendings = () => {
    api.get('/admin/translations/pending')
       .then(res => setPendings(res.data))
       .catch(err => alert("관리자 권한이 필요합니다."));
  };

  useEffect(() => { fetchPendings(); }, []);

  const handleApprove = (id, isApproved) => {
    api.post(`/admin/translations/${id}/approve?approve=${isApproved}`)
       .then(() => {
           alert(isApproved ? "승인되었습니다." : "거절되었습니다.");
           fetchPendings(); // 목록 갱신
       })
       .catch(() => alert("처리 실패"));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-red-600">🛡️ 관리자 대시보드</h1>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">출판사</th>
              <th className="p-4">역자</th>
              <th className="p-4">상태</th>
              <th className="p-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {pendings.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">승인 대기 중인 요청이 없습니다.</td></tr>
            ) : (
              pendings.map(t => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{t.id}</td>
                  <td className="p-4 font-bold">{t.publisher}</td>
                  <td className="p-4">{t.translator} ({t.year})</td>
                  <td className="p-4 text-orange-500 font-bold">{t.status}</td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => handleApprove(t.id, true)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      승인
                    </button>
                    <button 
                      onClick={() => handleApprove(t.id, false)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
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
  );
}