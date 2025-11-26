import { useEffect, useState } from "react";
import api from "../api/axios"; // 여기도 공통 모듈 사용

export default function MyPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 헤더 설정 불필요 (인터셉터가 해줌)
    api.get("/users/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        alert("로그인이 필요합니다.");
      });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>내 정보</h2>
      <p>ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Nickname: {user.nickname}</p>
    </div>
  );
}
