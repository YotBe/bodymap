/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5F2EC',
        surface: '#FFFFFF',
        ink: '#1A1A1A',
        'ink-muted': '#5C5751',
        rule: '#E4DFD6',
        accent: '#C8442C',
        'accent-soft': '#F0D9D2',
        evidence: '#2E5C4A',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.06)',
      },
    },
  },
  plugins: [],
};
