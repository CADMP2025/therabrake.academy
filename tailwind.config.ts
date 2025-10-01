import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-primary', 'bg-primary-light', 'bg-primary-dark',
    'bg-secondary', 'bg-secondary-light', 'bg-secondary-dark',
    'bg-accent', 'bg-accent-light', 'bg-accent-dark',
    'bg-action', 'bg-action-light', 'bg-action-dark',
    'bg-background', 'bg-background-light', 'bg-background-secondary',
    'text-primary', 'text-secondary', 'text-accent', 'text-action',
    'text-text-primary', 'text-text-secondary', 'text-text-light',
    'text-white', 'text-white/90', 'text-white/75',
    'hover:bg-action/90', 'hover:text-accent', 'hover:bg-accent-light',
    'hover:text-primary-dark', 'hover:text-secondary-dark',
    'from-primary', 'to-primary-dark', 'to-secondary',
    'bg-gradient-to-br', 'bg-gradient-to-r',
    'border-primary-dark'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        secondary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#FACC15',
          light: '#FDE047',
          dark: '#EAB308',
        },
        action: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA580C',
        },
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
      },
    },
  },
  plugins: [],
};

export default config;
