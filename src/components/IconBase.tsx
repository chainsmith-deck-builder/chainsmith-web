import type { ReactNode, SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

// Stroke-line SVG container shared by every icon in components/Icon.tsx.
// Defaults match the prototype: 14×14, stroke 1.7, round caps + joins, and
// `aria-hidden` because every icon-using button supplies its own aria-label.
export function IconSvg({
  size = 14,
  children,
  strokeWidth,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}
