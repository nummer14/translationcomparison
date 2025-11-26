import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 보낼 때마다 토큰이 있으면 헤더에 끼워넣기
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;