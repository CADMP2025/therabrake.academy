import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
          600: '#2563EB', // Keep for compatibility
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
        // Keep these for shadcn compatibility but map to our colors
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#3B82F6',
        foreground: '#111827',
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
