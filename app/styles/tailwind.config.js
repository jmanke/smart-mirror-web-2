// eslint-disable-next-line no-undef
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        13: '3.25rem',
        15: '3.75rem',
        17: '4.25rem',
        18: '4.5rem',
        19: '4.75rem',
        fit: 'fit-content',
      },
      width: {
        120: '30rem',
        144: '36rem',
        fit: 'fit-content',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in-down-50': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '0.50',
            transform: 'translateY(0)',
          },
        },
        'fade-in-down-25': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '0.25',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-in-down-50': 'fade-in-down-50 0.5s ease-out',
        'fade-in-down-25': 'fade-in-down-25 0.5s ease-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
