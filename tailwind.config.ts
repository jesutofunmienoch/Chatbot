// tailwind.config.ts
export default {
  darkMode: 'class', // important!
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // custom color or font configs
    },
  },
  plugins: [],
}
