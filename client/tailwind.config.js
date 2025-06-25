/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}', // this must include all template files
    './public/**/*.html',             // if you're injecting or serving from there
  ],
  safelist: [
    {
      pattern: /^(mb|mt|ml|mr)-\d$/,
    },
    {
      pattern: /^(bg|text|border)-(red|gray|black)-\d{2,3}$/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
