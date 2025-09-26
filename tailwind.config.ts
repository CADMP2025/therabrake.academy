import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#10B981',
          hover: '#34D399',
        },
        accent: {
          DEFAULT: '#FACC15',
          hover: '#FBBF24',
        },
        action: {
          DEFAULT: '#F97316',
          hover: '#FB923C',
        },
        text: {
          primary: '#1F2937',
          secondary: '#9CA3AF',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F3F4F6',
        },
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}
export default config
