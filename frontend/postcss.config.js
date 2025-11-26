import tailwindcss from "@tailwindcss/postcss";

export default {
  plugins: {
    '@tailwindcss/postcss': {},   // ⭐ 요걸로 교체
    autoprefixer: {},
  },
}