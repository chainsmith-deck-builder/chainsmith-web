import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        'bg-base': 'var(--bg-base)',
        'bg-raised': 'var(--bg-raised)',
        'bg-overlay': 'var(--bg-overlay)',
        // Text
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        // Borders
        'border-subtle': 'var(--border-subtle)',
        // Brand
        'accent-brand': 'var(--accent-brand)',
        // Avatar fallback (semantic — used when no avatar image is set)
        'avatar-fallback': 'var(--avatar-fallback-bg)',
        // Semantic state
        'state-success': 'var(--state-success)',
        'state-warning': 'var(--state-warning)',
        'state-danger': 'var(--state-danger)',
        'state-info': 'var(--state-info)',
        // Pitch — data viz only, never UI chrome (per .claude/rules/css.md and fab-domain.md)
        'viz-pitch-1': 'var(--viz-pitch-1)',
        'viz-pitch-2': 'var(--viz-pitch-2)',
        'viz-pitch-3': 'var(--viz-pitch-3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': 'var(--text-2xs)',
        tiny: 'var(--text-tiny)',
        display: 'var(--text-display)',
      },
      letterSpacing: {
        display: 'var(--tracking-display)',
        heading: 'var(--tracking-heading)',
        label: 'var(--tracking-label)',
        allcaps: 'var(--tracking-allcaps)',
        spread: 'var(--tracking-spread)',
      },
      boxShadow: {
        dropdown: 'var(--shadow-dropdown)',
        modal: 'var(--shadow-modal)',
        drawer: 'var(--shadow-drawer)',
      },
      borderRadius: {
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        slow: 'var(--motion-slow)',
      },
      transitionTimingFunction: {
        out: 'ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
