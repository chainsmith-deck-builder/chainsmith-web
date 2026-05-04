import { useTranslation } from 'react-i18next';
import type { Card } from '../domain/types';
import { PitchDot } from './PitchDot';

type Props = {
  card: Card;
  qty: number;
  focused?: boolean;
  hasViolation?: boolean;
  onHover?: () => void;
  onSelect?: () => void;
  onInc?: () => void;
  onDec?: () => void;
};

// Right-sidebar deck list row. Pitch pip + name + meta + quantity stepper.
// Two interactive surfaces: the row itself selects the card, and each stepper
// button mutates qty. Sibling buttons, never nested.
export function DeckRow({
  card,
  qty,
  focused = false,
  hasViolation = false,
  onHover,
  onSelect,
  onInc,
  onDec,
}: Props) {
  const { t } = useTranslation('deck');
  return (
    <div
      className="relative flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-fast"
      style={{ background: focused ? 'var(--bg-overlay)' : 'transparent' }}
      onMouseEnter={onHover}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={card.name}
        className="absolute inset-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand-ring"
      />
      <PitchDot pitch={card.pitch} size={8} />
      <div className="relative min-w-0 flex-1 pointer-events-none">
        <div
          className="flex items-center gap-1.5 truncate text-[12.5px] font-medium text-text-primary"
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {qty > 1 && (
            <span className="font-mono text-[11.5px] text-text-muted">{qty}×</span>
          )}
          <span>{card.name}</span>
          {hasViolation && (
            <span
              aria-hidden="true"
              className="block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-state-danger"
            />
          )}
        </div>
        <div
          className="mt-px font-medium uppercase text-text-muted"
          style={{ fontSize: 9.5, letterSpacing: '0.1em' }}
        >
          {card.subtype ?? card.type}
        </div>
      </div>
      <div className="relative z-10 flex items-center gap-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDec?.();
          }}
          aria-label={t('editor.card_actions.remove_one_from_deck', { name: card.name })}
          className="flex h-5.5 w-5.5 items-center justify-center rounded-sm text-text-muted transition-colors duration-fast hover:bg-bg-elevated hover:text-text-primary"
          style={{ width: 22, height: 22, fontSize: 14, lineHeight: 1 }}
        >
          −
        </button>
        <span
          className="font-mono text-[12px] font-medium text-text-secondary"
          style={{ minWidth: 16, textAlign: 'center' }}
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInc?.();
          }}
          aria-label={t('editor.card_actions.add_one_to_deck', { name: card.name })}
          className="flex items-center justify-center rounded-sm text-text-muted transition-colors duration-fast hover:bg-bg-elevated hover:text-text-primary"
          style={{ width: 22, height: 22, fontSize: 14, lineHeight: 1 }}
        >
          +
        </button>
      </div>
    </div>
  );
}
