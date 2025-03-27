module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      required: {
        color: 'red',
        content: '"*"', // Dấu hoa thị
      },
    },
  },
  plugins: [],
}

