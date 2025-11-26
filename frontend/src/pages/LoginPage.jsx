import { useState } from "react";
import api from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.accessToken);
      window.location.href = "/"; // 홈으로 이동
    } catch (err) {
      alert("로그인 실패! 아이디/비번을 확인하세요.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          로그인
        </button>
        {/* ▼▼▼ 이 부분 추가해서 테스트용 회원가입 버튼 만드세요 ▼▼▼ */}
        <button
          type="button"
          onClick={async () => {
            try {
              await api.post("/auth/signup", {
                email,
                password,
                nickname: "테스트유저",
              });
              alert("가입 성공! 이제 로그인하세요.");
            } catch (e) {
              alert("가입 실패 (이미 존재함)");
            }
          }}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-2"
        >
          (테스트용) 바로 회원가입
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm mb-2">또는</p>
        <a
          href="http://localhost:8080/oauth2/authorization/google"
          className="block w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          구글로 시작하기
        </a>
      </div>
    </div>
  );
}
