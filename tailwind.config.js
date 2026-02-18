/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // to je ključnega pomena za dark mode toggle
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
