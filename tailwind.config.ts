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
        // TheraBrake Brand Colors
        primary: {
          DEFAULT: '#3B82F6', // Blue
          light: '#60A5FA',
          dark: '#2563EB',
        },
        secondary: {
          DEFAULT: '#10B981', // Green
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#FACC15', // Yellow
          light: '#FDE047',
          dark: '#EAB308',
        },
        action: {
          DEFAULT: '#F97316', // Orange
          light: '#FB923C',
          dark: '#EA580C',
        },
        // Neutral colors
        background: {
          light: '#F9FAFB',
          DEFAULT: '#FFFFFF',
          secondary: '#F3F4F6',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          light: '#9CA3AF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          light: '#F3F4F6',
          dark: '#D1D5DB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
