/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 90%, 50%)',
        accent: 'hsl(140, 60%, 45%)',
        bg: 'hsl(220, 15%, 95%)',
        surface: 'hsl(220, 15%, 100%)',
        text: 'hsl(220, 15%, 20%)',
        border: 'hsl(220, 15%, 80%)',
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.75', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.25', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 20%, 0.08)',
      },
    },
  },
  plugins: [],
}