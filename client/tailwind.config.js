/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}', // this must include all template files
    './public/**/*.html',             // if you're injecting or serving from there
  ],
  safelist: [
    'justify-end', 'justify-start', 'justify-around', 'justify-between',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
