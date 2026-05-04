import type { ReactNode } from 'react';

type Props = {
  title: string;
  danger?: boolean;
  children: ReactNode;
};

export function Section({ title, danger = false, children }: Props) {
  return (
    <section className="border-b border-border-subtle py-5">
      <h2
        className="m-0 mb-3.5 text-[14px] font-semibold"
        style={{
          color: danger ? 'var(--state-danger)' : 'var(--text-primary)',
          letterSpacing: '-0.005em',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
