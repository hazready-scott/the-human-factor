/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2744',
          50: '#f0f3f7',
          100: '#d4dce8',
          200: '#a9b9d1',
          300: '#7e96ba',
          400: '#4c6d9a',
          500: '#1a2744',
          600: '#162038',
          700: '#11192b',
          800: '#0d121f',
          900: '#080b12',
        },
        warmth: {
          DEFAULT: '#e8956a',
          50: '#fdf3ee',
          100: '#fbe1d4',
          200: '#f6c3a9',
          300: '#f1a57e',
          400: '#e8956a',
          500: '#d97740',
          600: '#b85e2f',
          700: '#8a4623',
          800: '#5c2f17',
          900: '#2e170c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
