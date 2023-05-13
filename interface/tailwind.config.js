const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{jsx,tsx}', './src/components/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-primary)', ...fontFamily.sans],
        secondary: ['var(--font-secondary)', ...fontFamily.sans]
      },
      height: {
        navbar: '64px'
      }
    }
  },
  plugins: []
}
