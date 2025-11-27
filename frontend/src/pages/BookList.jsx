import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 등록된 책 목록</h2>
      <button
        onClick={() => navigate("/books/create")}
        style={{ marginBottom: "20px" }}
      >
        + 새 책 등록하기
      </button>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => navigate(`/books/${book.id}`)}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              width: "200px",
              cursor: "pointer",
            }}
          >
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={book.title}
                style={{ width: "100%", height: "250px", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{ width: "100%", height: "250px", background: "#eee" }}
              >
                No Image
              </div>
            )}
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
