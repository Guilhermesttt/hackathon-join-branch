/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
      },
    },
  },
  plugins: [],
  // Otimizações para produção
  corePlugins: {
    // Desabilitar plugins não utilizados
    container: false,
    preflight: true,
  },
  // Reduzir variantes para melhorar performance
  variants: {
    extend: {
      opacity: ['hover', 'focus'],
      transform: ['hover', 'focus'],
      scale: ['hover', 'focus'],
      translate: ['hover', 'focus'],
    },
  },
}
