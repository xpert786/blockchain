// import { defineConfig } from '@tailwindcss/vite'

// export default defineConfig({
//   theme: {
//     extend: {
//       fontFamily: {
//         aeonik: ['Aeonik', 'sans-serif'],
//       },
//       animation: {
//         'blob': 'blob 7s infinite',
//       },
//       keyframes: {
//         blob: {
//           "0%": {
//             transform: "translate(0px, 0px) scale(1)",
//           },
//           "33%": {
//             transform: "translate(30px, -50px) scale(1.1)",
//           },
//           "66%": {
//             transform: "translate(-20px, 20px) scale(0.9)",
//           },
//           "100%": {
//             transform: "translate(0px, 0px) scale(1)",
//           },
//         },
//       },
//     },
//   },
// })
import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        'aeonik': ['Aeonik', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'sans': ['Aeonik', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
})
