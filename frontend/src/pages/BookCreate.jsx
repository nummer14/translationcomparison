import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function BookCreate() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await api.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.url);
      alert("이미지 업로드 완료!");
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 실패");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
        alert("제목과 저자는 필수입니다.");
        return;
    }
    try {
      await api.post("/books", {
        title,
        author,
        description: desc,
        coverImageUrl: imageUrl
      });
      alert("책 등록되었습니다!");
      navigate("/books");
    } catch (err) {
      console.error(err);
      alert("등록 실패!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>새 책 등록</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
            placeholder="책 제목" 
            value={title} 
            onChange={(e)=>setTitle(e.target.value)} 
        />
        <input 
            placeholder="저자" 
            value={author} 
            onChange={(e)=>setAuthor(e.target.value)} 
        />
        <textarea 
            placeholder="설명" 
            value={desc} 
            onChange={(e)=>setDesc(e.target.value)} 
            rows={4} 
        />
        <div style={{ border: "1px dashed #ccc", padding: "10px" }}>
            <label>표지 이미지 업로드: </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {isUploading && <p>업로드 중...</p>}
            {imageUrl && (
                <div style={{ marginTop: "10px" }}>
                    <img src={imageUrl} alt="미리보기" style={{ width: "100px", height: "auto" }} />
                </div>
            )}
        </div>
        
        <button type="submit" disabled={isUploading}>등록하기</button>
      </form>
    </div>
  );
}