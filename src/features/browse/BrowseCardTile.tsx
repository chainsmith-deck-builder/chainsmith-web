import type { CardSummary } from '../../api/types';
import { PitchDot } from '../../components/PitchDot';

type Props = {
  card: CardSummary;
  onClick?: ((card: CardSummary) => void) | undefined;
};

// Browse-grid tile: real card image when present, pitch pip overlay, click
// hands the card to the parent for detail-pane display. The 5:7 frame is
// the card's own aspect, so the image fills without cropping.
//
// The card detail pane / add-to-deck affordance is intentionally absent at
// this slice — browse is a read-only catalog view today; that wiring lands
// when the deck-editor migration lets us add cards in context.
export function BrowseCardTile({ card, onClick }: Props) {
  const imageUrl = card.defaultPrinting?.imageUrl ?? null;
  const pitch = card.pitch;

  return (
    <button
      type="button"
      onClick={() => onClick?.(card)}
      aria-label={card.name}
      className="relative block aspect-card w-full overflow-hidden rounded-md border border-border-subtle bg-bg-raised text-start transition-transform duration-fast hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand-ring"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-bg-overlay p-2 text-center">
          <span className="text-[12px] font-semibold text-text-secondary">{card.name}</span>
        </div>
      )}

      {pitch !== null && pitch !== undefined && pitch >= 1 && pitch <= 3 && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[#F2EEE6] backdrop-blur"
        >
          <PitchDot pitch={pitch as 1 | 2 | 3} size={7} />
          <span className="font-mono text-[9.5px] font-semibold">{pitch}</span>
        </span>
      )}
    </button>
  );
}
