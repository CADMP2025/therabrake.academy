/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3B82F6",
          green: "#10B981",
          yellow: "#FACC15",
          orange: "#F97316",
          text: "#1F2937",
          gray: "#9CA3AF",
          bg: "#F3F4F6"
        }
      }
    }
  },
  plugins: []
};
