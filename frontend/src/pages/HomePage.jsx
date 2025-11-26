import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// 개별 책 카드 컴포넌트 (수정 기능 포함)
function BookCard({ book, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editTitle, setEditTitle] = useState(book.title);
  const [editAuthor, setEditAuthor] = useState(book.originalAuthor);

  const handleUpdate = () => {
    api.put(`/books/${book.id}`, { title: editTitle, originalAuthor: editAuthor })
       .then(() => {
         alert("수정되었습니다.");
         setIsEditing(false); // 수정 모드 끄기
         onUpdate(); // 목록 새로고침 요청
       })
       .catch(err => alert("수정 실패: " + err.message));
  };

  if (isEditing) {
    // [수정 모드일 때 보이는 화면]
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-400">
        <div className="mb-2">
          <label className="text-xs text-gray-500">제목 수정</label>
          <input 
            className="w-full border p-1 rounded" 
            value={editTitle} 
            onChange={e => setEditTitle(e.target.value)} 
          />
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-500">작가 수정</label>
          <input 
            className="w-full border p-1 rounded" 
            value={editAuthor} 
            onChange={e => setEditAuthor(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">저장</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-3 py-1 rounded text-sm">취소</button>
        </div>
      </div>
    );
  }

  // [평소에 보이는 화면]
  return (
    <div className="group relative bg-white h-full p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition duration-300">
      
      {/* 우측 상단 버튼들 */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
        <button 
          onClick={() => setIsEditing(true)} 
          className="bg-gray-100 text-gray-600 w-8 h-8 rounded hover:bg-blue-500 hover:text-white"
          title="수정"
        >
          ✎
        </button>
        <button 
          onClick={() => onDelete(book.id)} 
          className="bg-gray-100 text-red-500 w-8 h-8 rounded hover:bg-red-500 hover:text-white"
          title="삭제"
        >
          ✕
        </button>
      </div>

      <Link to={`/books/${book.id}`} className="block">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
            {book.title}
          </h2>
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded ml-2">#{book.id}</span>
        </div>
        <p className="text-gray-600 font-medium">{book.originalAuthor}</p>
        <div className="mt-4 text-sm text-gray-400 flex items-center gap-1">
          <span>번역본 비교하러 가기 &rarr;</span>
        </div>
      </Link>
    </div>
  );
}

// 메인 페이지
export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const fetchBooks = () => {
    api.get('/books')
      .then(res => setBooks(res.data || []))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!title || !author) return alert("제목과 작가를 입력하세요.");

    api.post('/books', { title, originalAuthor: author })
       .then(() => {
           alert(`[${title}] 책이 등록되었습니다.`);
           setTitle('');
           setAuthor('');
           fetchBooks();
       })
       .catch(() => alert("등록 실패!"));
  };

  const handleDeleteBook = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까? (관련 데이터 모두 삭제)")) return;
    api.delete(`/books/${id}`)
       .then(() => {
           alert("삭제되었습니다.");
           fetchBooks();
       })
       .catch(err => alert("삭제 실패"));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      
      {/* 책 등록 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10 border-l-4 border-blue-600">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📖 새로운 원작 등록하기</h2>
        <form onSubmit={handleAddBook} className="flex gap-3">
          <input 
            className="border border-gray-300 p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="책 제목 (예: The Stranger)"
            value={title} onChange={e => setTitle(e.target.value)} 
          />
          <input 
            className="border border-gray-300 p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="원작 작가 (예: Albert Camus)"
            value={author} onChange={e => setAuthor(e.target.value)} 
          />
          <button className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">
            등록
          </button>
        </form>
      </div>

      {/* 책 목록 섹션 */}
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-bold text-gray-800">📚 등록된 책 목록</h1>
        <span className="text-gray-500 text-sm">총 {books.length}권</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            onDelete={handleDeleteBook} 
            onUpdate={fetchBooks} 
          />
        ))}
      </div>
      
      {books.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg">
          등록된 책이 없습니다.
        </div>
      )}
    </div>
  );
}