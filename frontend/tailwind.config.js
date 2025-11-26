/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ★ 이 부분이 꼭 있어야 합니다!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}