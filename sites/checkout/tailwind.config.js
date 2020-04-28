module.exports = {
  theme: {
    screens: {
      sm: '600px',
      md: '1024px',
      lg: '1440px',
      xl: '1920px',
    },
    fontFamily: {
      display: 'Rubik, sans-serif',
      body: 'Rubik, sans-serif'
    },
    extend: {
      scale: {
        '200': '2',
        '250': '2.5',
        '300': '3'
      },
      opacity: {
        '12': '.12',
        '38': '.38',
        '60': '.60',
        '87': '.87',
        '95': '.95',
      },
      colors: {
        primary: '#FEDBD0',
        secondary: '#FEEAE6',
        cart: '#FEEAE6D9',
        error: '#B00020',
        dark: '#442C2E'
      },
      zIndex: {
        '-10': '-10',
        '-12': '-12',
      },
      width: {
        card: '384px'
      },
      height: {
        '18': '4.5rem',
        inputBox: '3.5rem',
      },
    },
  },
  variants: {},
  plugins: [
    require('tailwindcss-elevation')(['responsive', 'hover', 'focus', 'active']),
  ],
}
