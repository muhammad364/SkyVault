import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        'canvas-strong': 'var(--canvas-strong)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        'card-muted': 'var(--card-muted)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-foreground': 'var(--primary-foreground)',
        'accent-amber': 'var(--accent-amber)',
        'accent-amber-soft': 'var(--accent-amber-soft)',
        'accent-coral': 'var(--accent-coral)',
        'accent-coral-soft': 'var(--accent-coral-soft)',
        foreground: 'var(--foreground)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        rest: 'var(--shadow-rest)',
        float: 'var(--shadow-float)',
        hover: 'var(--shadow-hover)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        vault: 'cubic-bezier(.22, 1, .36, 1)',
      },
      transitionDuration: {
        micro: '160ms',
        default: '240ms',
        page: '320ms',
      },
    },
  },
  plugins: [],
} satisfies Config
