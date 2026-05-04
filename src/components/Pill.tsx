import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

// Filter chip / segmented-control pill. Used in deck list filters, hero
// selection, and the editor's filter bar. Rounded-full so the chip reads as
// a toggle, not a button.
export function Pill({ active = false, className = '', children, ...rest }: Props) {
  const base =
    'inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors duration-fast';
  const tone = active
    ? 'border-accent-brand-dim bg-accent-brand-soft text-text-primary'
    : 'border-border-subtle bg-bg-raised text-text-secondary hover:border-border-default hover:bg-bg-overlay hover:text-text-primary';
  return (
    <button type="button" className={`${base} ${tone} ${className}`} {...rest}>
      {children}
    </button>
  );
}
