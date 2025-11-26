import { useState } from "react";
import api from "../api/axios";

export default function Register() {

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("users/register", {
        email,
        password,
        nickname,
      });

      setMessage("회원가입 성공!");
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>회원가입</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />

        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        /><br />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        <button type="submit">회원가입</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
