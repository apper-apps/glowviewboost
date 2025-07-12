/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#00F0FF',
        secondary: '#7B2FFF',
        accent: '#FF0080',
        surface: '#1A1A2E',
        background: '#0F0F1E',
        success: '#00FF88',
        warning: '#FFB800',
        error: '#FF3366',
        info: '#00B4D8',
      },
      boxShadow: {
        'neon': '0 0 10px currentColor',
        'neon-lg': '0 0 20px currentColor',
        'neon-sm': '0 0 5px currentColor',
      },
    },
  },
  plugins: [],
}