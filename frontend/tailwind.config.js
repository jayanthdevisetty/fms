export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf6',
          100: '#d1fae8',
          500: '#10b981',
          600: '#0f9f6e',
          700: '#047857'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
