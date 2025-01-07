/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#2d2f42', // 사용자 정의 색상 추가
        button: '#48319D',
        hover: '#8322FF',
        gradient: 'var(--gradient)',
        sub: '#3a3f58',
      },
    },
  },
  plugins: [],
};
