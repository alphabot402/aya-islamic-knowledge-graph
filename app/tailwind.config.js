/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        celestial: {
          void: '#0a0e1a',
          deep: '#1a1f35',
          medium: '#2d3653'
        },
        teal: {
          400: '#1ac7b1',
          500: '#16a896'
        },
        gold: {
          400: '#f6d157',
          500: '#d4af37'
        }
      },
      fontFamily: {
        arabic: ['Amiri', 'serif']
      }
    },
  },
  plugins: [],
}
