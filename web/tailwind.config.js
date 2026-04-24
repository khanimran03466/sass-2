module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
    './services/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0d1b14',
        moss: '#0f5132',
        sand: '#f4efe8',
        coral: '#ff7a59',
        gold: '#cf9f47',
        slate: '#5d6b66'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(10, 37, 24, 0.12)'
      }
    }
  },
  plugins: []
};
