/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030B17',
          900: '#0A1D37',
          800: '#122849',
          700: '#1C3A66',
          600: '#2A5087',
        },
        gold: {
          600: '#D48806',
          500: '#F5A623',
          400: '#FFB800',
          300: '#FFC837',
          200: '#FFE082',
          100: '#FFF4D6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Montserrat', 'Oswald', 'Inter', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif']
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(245, 166, 35, 0.4)',
        'navy': '0 10px 30px -5px rgba(10, 29, 55, 0.3)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, rgba(10, 29, 55, 0.95), rgba(10, 29, 55, 0.75))',
        'gold-gradient': 'linear-gradient(135deg, #F5A623 0%, #FFB800 100%)',
      }
    },
  },
  plugins: [],
}
