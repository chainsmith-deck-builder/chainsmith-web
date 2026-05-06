import { useEffect, useRef, useState, type ReactNode } from 'react';

import { Icon } from './Icon';
import { Pill } from './Pill';

type Props = {
  /** Visible label inside the trigger pill (e.g. "Class · 2 selected"). */
  label: ReactNode;
  /** True when at least one option is selected; styles the pill accent. */
  active: boolean;
  /** Panel content. Rendered when the menu is open. */
  children: ReactNode;
};

// Filter dropdown used by the catalog browse screen. The trigger is a Pill
// with a chevron; clicking opens an absolutely-positioned panel below.
// Clicking outside or pressing Esc closes it. Focus stays where it is —
// these are toggle / multi-select menus, not modal dialogs.
//
// The trigger's accessible name comes from its visible content; don't add
// an aria-label that would override the dynamic "Class · N selected" text.
export function FilterMenu({ label, active, children }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Pill
        active={active}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {label} <Icon.chevron />
      </Pill>
      {open && (
        <div
          role="menu"
          className="absolute start-0 top-full z-10 mt-1 min-w-52 rounded-lg border border-border-subtle bg-bg-overlay p-1.5 shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
}
