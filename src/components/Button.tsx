import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dangerOutline';
type Size = 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

// Button with three tones plus a danger outline. Sized 32/40 (md/lg) to match
// the design's primary affordance scale.
export function Button({
  ref,
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...rest
}: Props) {
  const base =
    'inline-flex items-center gap-1.5 rounded-md font-medium transition-colors duration-fast';
  const sized = SIZE_MAP[size];
  const tone = TONE_MAP[variant];
  return (
    <button ref={ref} type={type} className={`${base} ${sized} ${tone} ${className}`} {...rest}>
      {children}
    </button>
  );
}

const SIZE_MAP: Record<Size, string> = {
  md: 'h-8 px-3.5 text-[13px]',
  lg: 'h-10 px-5 text-sm',
};

const TONE_MAP: Record<Variant, string> = {
  primary: 'bg-accent-brand text-white hover:bg-accent-brand-hover',
  secondary:
    'border border-border-subtle bg-bg-raised text-text-primary hover:bg-bg-overlay',
  ghost:
    'h-7 px-2.5 text-[12.5px] text-text-secondary hover:bg-bg-raised hover:text-text-primary',
  dangerOutline:
    'border border-state-danger bg-transparent text-state-danger hover:bg-state-danger-soft',
};
