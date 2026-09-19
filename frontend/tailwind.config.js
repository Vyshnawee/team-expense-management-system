/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        ledger: {
          DEFAULT: '#1A2332',
          light: '#243447',
          dark: '#111926',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          dark: '#EDE6D9',
        },
        cleared: {
          DEFAULT: '#2A7D4F',
          light: '#3A9D63',
          50: '#EDF7F1',
          100: '#D0EDDB',
        },
        amber: {
          DEFAULT: '#C27B2B',
          50: '#FBF3E6',
          100: '#F5E0BF',
        },
      },
    },
  },
  plugins: [],
};
