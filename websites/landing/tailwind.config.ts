import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{ts,tsx}',
    './containers/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '1rem',
        xl: '1rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        'c-purple': '#A020F0',
        'c-yellow': '#F3F731',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        daysOne: ['var(--font-days-one)'],
      },
    },
  },
};
export default config;
