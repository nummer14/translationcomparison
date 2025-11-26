import React from 'react';  // <--- ⭐ 이 줄을 꼭 추가하세요!
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom"; // 라우터 감싸는 게 여기 있을 수도 있음
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)