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
        className={`m-0 mb-3.5 text-sm font-semibold tracking-heading ${danger ? 'text-state-danger' : 'text-text-primary'}`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
