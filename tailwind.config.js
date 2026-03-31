/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0f172a',
          'primary-light': '#1e3a5f',
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          teal: '#06b6d4',
          'teal-dark': '#0891b2',
          purple: '#8b5cf6',
          'purple-light': '#a78bfa',
          amber: '#c9944a',
          'amber-dark': '#b07d3a',
          'amber-light': '#d4a85c',
          navy: '#1a2744',
          'navy-light': '#243352',
          slate: '#334155',
          'cool-white': '#f8fafc',
          'cool-gray': '#f1f5f9',
          'light-gray': '#e2e8f0',
          success: '#16a34a',
          warning: '#d97706',
          danger: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
