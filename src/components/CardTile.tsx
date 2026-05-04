import { useTranslation } from 'react-i18next';
import type { Card } from '../domain/types';
import { CardArt } from './CardArt';
import { PitchDot } from './PitchDot';

type Props = {
  card: Card;
  inDeck?: number;
  onAdd?: ((card: Card) => void) | undefined;
  onClick?: ((card: Card) => void) | undefined;
};

// Card tile used in search grids. Two stacked interactive elements: the full
// tile is a button that opens the card detail; the "+" is a sibling button so
// AT users hit either action without nested controls.
export function CardTile({ card, inDeck = 0, onAdd, onClick }: Props) {
  const { t } = useTranslation('deck');
  return (
    <div className="relative aspect-card">
      <button
        type="button"
        onClick={() => onClick?.(card)}
        aria-label={card.name}
        className="absolute inset-0 flex w-full flex-col rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand-ring"
      >
        <CardArt card={card} size="tile" />
      </button>

      {/* Pitch pip — color + numeric, per fab-domain.md */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[#F2EEE6] backdrop-blur"
      >
        <PitchDot pitch={card.pitch} size={7} />
        <span className="font-mono text-[9.5px] font-semibold">{card.pitch}</span>
      </span>

      {/* In-deck badge */}
      {inDeck > 0 && (
        <span
          className="pointer-events-none absolute right-1.5 top-1.5 rounded-full bg-accent-brand px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white"
          aria-label={`${inDeck} in deck`}
        >
          ×{inDeck}
        </span>
      )}

      {/* Add affordance — separate button so it's not nested in the tile button */}
      {onAdd && (
        <button
          type="button"
          aria-label={t('editor.card_actions.add_to_deck', { name: card.name })}
          onClick={() => onAdd(card)}
          className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-black/65 font-mono text-base font-medium leading-none text-white backdrop-blur transition-colors duration-fast hover:bg-accent-brand"
        >
          +
        </button>
      )}
    </div>
  );
}
