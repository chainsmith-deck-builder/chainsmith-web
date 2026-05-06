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
        'bg-elevated': 'var(--bg-elevated)',
        'bg-input': 'var(--bg-input)',
        // Text
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-faint': 'var(--text-faint)',
        // Text on card art / portraits / equipment imagery (theme-invariant).
        'text-on-art': 'var(--text-on-art)',
        // Borders
        'border-subtle': 'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'border-strong': 'var(--border-strong)',
        // Brand
        'accent-brand': 'var(--accent-brand)',
        'accent-brand-hover': 'var(--accent-brand-hover)',
        'accent-brand-dim': 'var(--accent-brand-dim)',
        'accent-brand-soft': 'var(--accent-brand-soft)',
        'accent-brand-ring': 'var(--accent-brand-ring)',
        // Avatar fallback (semantic — used when no avatar image is set)
        'avatar-fallback': 'var(--avatar-fallback-bg)',
        // Semantic state
        'state-success': 'var(--state-success)',
        'state-success-soft': 'var(--state-success-soft)',
        'state-warning': 'var(--state-warning)',
        'state-warning-soft': 'var(--state-warning-soft)',
        'state-danger': 'var(--state-danger)',
        'state-danger-soft': 'var(--state-danger-soft)',
        'state-info': 'var(--state-info)',
        'state-info-soft': 'var(--state-info-soft)',
        // Pitch — data viz only, never UI chrome (per .claude/rules/css.md and fab-domain.md)
        'viz-pitch-1': 'var(--viz-pitch-1)',
        'viz-pitch-2': 'var(--viz-pitch-2)',
        'viz-pitch-3': 'var(--viz-pitch-3)',
        'viz-pitch-1-soft': 'var(--viz-pitch-1-soft)',
        'viz-pitch-2-soft': 'var(--viz-pitch-2-soft)',
        'viz-pitch-3-soft': 'var(--viz-pitch-3-soft)',
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
      width: {
        sidebar: 'var(--layout-sidebar)',
        'sidebar-wide': 'var(--layout-sidebar-wide)',
        modal: 'var(--layout-modal)',
        drawer: 'var(--layout-drawer)',
      },
      minWidth: ({ theme }) => ({ ...theme('spacing') }),
      minHeight: ({ theme }) => ({ ...theme('spacing') }),
      maxWidth: ({ theme }) => ({ ...theme('spacing') }),
      maxHeight: ({ theme }) => ({ ...theme('spacing') }),
      ringWidth: {
        3: '3px',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      transitionDuration: {
        fast: '150ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
      },
      // Cap aspect-ratio aliases at the values the design uses; card art is locked to 5:7 per fab-domain.md.
      aspectRatio: {
        card: '5 / 7',
      },
    },
  },
  plugins: [],
} satisfies Config;
