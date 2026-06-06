/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        white: 'var(--white)',
        black: 'var(--black)',
        'base-background': 'var(--base-background)',
        
        accent: {
          1: 'var(--accent-1)',
          2: 'var(--accent-2)',
          3: 'var(--accent-3)',
          4: 'var(--accent-4)',
          5: 'var(--accent-5)',
          6: 'var(--accent-6)',
          7: 'var(--accent-7)',
          8: 'var(--accent-8)',
          9: 'var(--accent-9)',
          10: 'var(--accent-10)',
          11: 'var(--accent-11)',
          12: 'var(--accent-12)',          
          a1: 'var(--accent-a1)',
          a2: 'var(--accent-a2)',
          a3: 'var(--accent-a3)',
          a4: 'var(--accent-a4)',
          a5: 'var(--accent-a5)',
          a6: 'var(--accent-a6)',
          a7: 'var(--accent-a7)',
          a8: 'var(--accent-a8)',
          a9: 'var(--accent-a9)',
          a10: 'var(--accent-a10)',
          a11: 'var(--accent-a11)',
          a12: 'var(--accent-a12)',
          contrast: 'var(--accent-contrast)',
          background: 'var(--accent-background)',
          foreground: 'var(--accent-foreground)',
        },
        
        neutral: {
          1: 'var(--neutral-1)',
          2: 'var(--neutral-2)',
          3: 'var(--neutral-3)',
          4: 'var(--neutral-4)',
          5: 'var(--neutral-5)',
          6: 'var(--neutral-6)',
          7: 'var(--neutral-7)',
          8: 'var(--neutral-8)',
          9: 'var(--neutral-9)',
          10: 'var(--neutral-10)',
          11: 'var(--neutral-11)',
          12: 'var(--neutral-12)',
          a1: 'var(--neutral-a1)',
          a2: 'var(--neutral-a2)',
          a3: 'var(--neutral-a3)',
          a4: 'var(--neutral-a4)',
          a5: 'var(--neutral-a5)',
          a6: 'var(--neutral-a6)',
          a7: 'var(--neutral-a7)',
          a8: 'var(--neutral-a8)',
          a9: 'var(--neutral-a9)',
          a10: 'var(--neutral-a10)',
          a11: 'var(--neutral-a11)',
          a12: 'var(--neutral-a12)',
          contrast: 'var(--neutral-contrast)',
        },
        
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        muted: {
          background: 'var(--muted-background)',
          foreground: 'var(--muted-foreground)',
        },
        
        primary: {
          background: 'var(--primary-background)',
          foreground: 'var(--primary-foreground)',
          'background-hover': 'var(--primary-background-hover)',
        },
        
        secondary: {
          background: 'var(--secondary-background)',
          foreground: 'var(--secondary-foreground)',
          'background-hover': 'var(--secondary-background-hover)',
        },
        
        border: 'var(--border)',
       'border-hover': 'var(--border-hover)',
        outline: 'var(--outline)',
        separator: 'var(--separator)',
      }
    }
  },
  plugins: [],
}
