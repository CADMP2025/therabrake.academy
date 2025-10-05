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
          hover: '#2563EB',
          600: '#2563EB',
        },
        secondary: {
          DEFAULT: '#10B981',
          hover: '#059669',
        },
        accent: '#FACC15',
        action: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
        },
      },
    },
  },
  plugins: [],
}

export default config
