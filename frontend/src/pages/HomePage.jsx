import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = [
  { id: 'ALL', name: '🔥 전체', label: '전체' },
  { id: 'ANGLO', name: '🇺🇸🇬🇧 영미', label: '영미문학' },
  { id: 'EUROPE', name: '🇪🇺 유럽', label: '유럽문학' },
  { id: 'KOREAN', name: '🇰🇷 한국', label: '한국문학' },
  { id: 'ASIAN', name: '🇯🇵🇨🇳 아시아', label: '아시아' },
];

const checkIsAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.auth && payload.auth.includes('ROLE_ADMIN');
  } catch (e) { return false; }
};

function BookCard({ book, onDelete, onUpdate, isAdmin, isBookmarked, onToggleBookmark }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(book.title);
  const [editAuthor, setEditAuthor] = useState(book.originalAuthor);
  
  // ★ 카테고리 수정 상태 추가
  const [editCategory, setEditCategory] = useState(book.category || 'ANGLO');

  const handleUpdate = () => {
    api.put(`/books/${book.id}`, { 
        title: editTitle, 
        originalAuthor: editAuthor,
        category: editCategory // ★ 수정된 카테고리 전송
    })
       .then(() => { alert("수정 완료"); setIsEditing(false); onUpdate(); })
       .catch(() => alert("수정 실패"));
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded shadow border border-blue-500 text-sm flex flex-col gap-2 z-50 absolute inset-0">
        <p className="font-bold text-gray-500 text-xs mb-1">책 정보 수정</p>
        
        {/* ★ 카테고리 선택 박스 추가 */}
        <select 
          className="border p-1 w-full rounded bg-gray-50"
          value={editCategory} 
          onChange={e => setEditCategory(e.target.value)}
        >
          <option value="ANGLO">🇺🇸🇬🇧 영미문학</option>
          <option value="EUROPE">🇪🇺 유럽문학</option>
          <option value="KOREAN">🇰🇷 한국문학</option>
          <option value="ASIAN">🇯🇵🇨🇳 아시아/기타</option>
        </select>

        <input className="border p-1 w-full rounded" placeholder="제목" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
        <input className="border p-1 w-full rounded" placeholder="작가" value={editAuthor} onChange={e => setEditAuthor(e.target.value)} />
        
        <div className="flex gap-1 justify-end mt-2">
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">저장</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">취소</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="group relative flex flex-col w-full">
      {/* 책 표지 영역 */}
      <div className="relative w-full aspect-[2/3] rounded-r-lg shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden bg-gray-100">
        
        {/* ★★★ [수정됨] 관리자 버튼: 항상 잘 보이게 상단 고정 (배경색 추가) ★★★ */}
        {isAdmin && (
          <div className="absolute top-0 right-0 p-1 flex gap-1 z-40 bg-black/50 rounded-bl-lg backdrop-blur-sm">
            <button 
                onClick={(e) => { e.preventDefault(); setIsEditing(true); }} 
                className="bg-white text-gray-800 p-1.5 rounded hover:bg-blue-100 transition" 
                title="수정(카테고리 변경 가능)"
            >
                ✏️
            </button>
            <button 
                onClick={(e) => { e.preventDefault(); onDelete(book.id); }} 
                className="bg-white text-red-600 p-1.5 rounded hover:bg-red-100 transition" 
                title="삭제"
            >
                🗑️
            </button>
          </div>
        )}

        <Link to={`/books/${book.id}`} className="block w-full h-full">
          {/* 찜하기 버튼 */}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleBookmark(book.id); }}
            className="absolute top-2 left-2 z-30 hover:scale-110 transition drop-shadow-md"
            title="찜하기"
          >
            {isBookmarked ? <span className="text-2xl drop-shadow-sm">❤️</span> : <span className="text-2xl text-white opacity-60 hover:opacity-100 drop-shadow-md">🤍</span>}
          </button>

          {book.imagePath ? (
            <img src={`http://localhost:8080/uploads/${book.imagePath}`} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-2 text-center">
              <span className="text-4xl mb-2">📖</span>
              <span className="text-xs font-serif opacity-80">{book.title}</span>
            </div>
          )}
          
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent pointer-events-none"></div>
        </Link>
      </div>

      {/* 책 정보 */}
      <div className="mt-4 text-center px-1">
        <h3 className="text-base font-bold text-gray-800 leading-tight truncate hover:text-blue-600 transition">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="text-xs text-gray-500 mt-1">{book.originalAuthor}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set()); 
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => { 
    fetchBooks(); 
    fetchBookmarks();
    setIsAdmin(checkIsAdmin()); 
  }, []);

  const fetchBooks = () => {
    api.get('/books').then(res => setBooks(res.data.reverse())).catch(console.error);
  };

  const fetchBookmarks = () => {
    api.get('/bookmarks/me')
       .then(res => {
         const ids = new Set(res.data.map(b => b.id));
         setBookmarks(ids);
       })
       .catch(() => setBookmarks(new Set())); 
  };

  const handleToggleBookmark = (bookId) => {
    api.post(`/bookmarks/${bookId}`)
       .then(() => {
         const next = new Set(bookmarks);
         if (next.has(bookId)) next.delete(bookId);
         else next.add(bookId);
         setBookmarks(next);
       })
       .catch(err => {
         if (err.response?.status === 401) alert("로그인이 필요합니다.");
         else alert("오류 발생");
       });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("title", form.title.value);
    formData.append("originalAuthor", form.originalAuthor.value);
    formData.append("category", form.category.value); 
    if (form.coverImage.files[0]) formData.append("coverImage", form.coverImage.files[0]);

    setIsSubmitting(true);
    try {
      await api.post('/books', formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("등록 완료!");
      form.reset();
      fetchBooks();
    } catch { alert("등록 실패"); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteBook = (id) => {
    if(window.confirm("정말 삭제하시겠습니까?")) {
      api.delete(`/books/${id}`).then(fetchBooks).catch(()=>alert("권한 없음"));
    }
  };

  // ★★★ 여기가 수정된 검색 로직입니다 ★★★
  const filteredBooks = books.filter((book) => {
    const lowerTerm = searchTerm.toLowerCase();
    
    // 1. 카테고리 일치 여부
    const matchCategory = activeTab === 'ALL' || book.category === activeTab;
    
    // 2. 검색어 일치 여부 (제목 OR 원작작가 OR 번역가)
    // book.translations 배열을 순회하며 번역가 이름이 검색어를 포함하는지 확인 (some)
    const matchTranslator = book.translations && book.translations.some(
      t => t.translator && t.translator.toLowerCase().includes(lowerTerm)
    );

    const matchSearch = 
      book.title.toLowerCase().includes(lowerTerm) || 
      book.originalAuthor.toLowerCase().includes(lowerTerm) ||
      matchTranslator; // 번역가 검색 결과 포함

    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      
      {/* 1. 배너 */}
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl mb-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-12 max-w-2xl text-white">
          <h1 className="text-4xl font-serif font-bold mb-3 drop-shadow-lg text-white tracking-wide">
            Nuance <span className="text-lg font-sans font-normal opacity-80 block mt-2">번역의 차이를 발견하다</span>
          </h1>
          <p className="text-gray-200 mb-8 text-lg font-light drop-shadow-md">
            읽고 싶은 원서가 있나요? <br/>
            직접 등록하고, 다양한 번역의 결을 비교해보세요.
          </p>
          
          <form onSubmit={handleAddBook} className="flex flex-col gap-3 bg-white/10 p-5 rounded-xl backdrop-blur-md border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3">
              <select name="category" className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-3 text-sm outline-none" required>
                <option value="ANGLO">영미문학</option>
                <option value="EUROPE">유럽문학</option>
                <option value="KOREAN">한국문학</option>
                <option value="ASIAN">아시아/기타</option>
              </select>
              <input name="title" className="flex-1 bg-gray-800/80 text-white placeholder-gray-300 border border-gray-600 px-4 py-3 rounded text-sm outline-none focus:border-blue-500" placeholder="책 제목" required />
            </div>
            <div className="flex gap-3 items-center">
              <input name="originalAuthor" className="flex-1 bg-gray-800/80 text-white placeholder-gray-300 border border-gray-600 px-4 py-3 rounded text-sm outline-none focus:border-blue-500" placeholder="원작 작가" required />
              <input type="file" name="coverImage" className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded text-sm border border-gray-500 whitespace-nowrap">
                📷 표지 선택
              </label>
              <button disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-bold transition shadow-lg whitespace-nowrap">
                등록
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. 탭 & 검색 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === cat.id 
                ? 'bg-gray-900 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72 group">
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 작가, 번역가 검색..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition shadow-sm group-hover:shadow-md"
          />
          <span className="absolute left-4 top-3 text-gray-400">🔍</span>
        </div>
      </div>

      {/* 3. 책 리스트 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
        {filteredBooks.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            isAdmin={isAdmin}
            onDelete={handleDeleteBook} 
            onUpdate={fetchBooks}
            isBookmarked={bookmarks.has(book.id)} 
            onToggleBookmark={handleToggleBookmark}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-40">
          <p className="text-6xl mb-4">📚</p>
          <p className="text-gray-500 text-lg">찾으시는 책이 없네요.</p>
        </div>
      )}
    </div>
  );
}