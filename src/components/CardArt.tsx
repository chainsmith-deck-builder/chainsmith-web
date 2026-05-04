import { useTranslation } from 'react-i18next';
import type { Card } from '../domain/types';

type ArtSize = 'thumb' | 'tile' | 'gallery' | 'full';

type Props = {
  card: Card;
  size?: ArtSize;
};

// Typographic-on-gradient fallback used everywhere card art would appear, per
// the design brief and .claude/rules/fab-domain.md. When the backend exposes
// `imageUrl` for a printing, swap to a real <img> with this as the placeholder.
export function CardArt({ card, size = 'tile' }: Props) {
  const { t } = useTranslation('deck');
  const dims = SIZE_MAP[size];
  const grad = PITCH_GRADIENTS[card.pitch];
  const padding = size === 'thumb' ? 6 : 9;

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-md text-[#F2EEE6]"
      style={{
        width: dims.w,
        height: dims.h,
        background: `radial-gradient(120% 80% at 50% 18%, ${grad.from} 0%, ${grad.to} 70%), #0b0810`,
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -40px 60px -20px rgba(0,0,0,0.5)',
        padding,
      }}
    >
      {/* Pitch + cost row */}
      <div className="mb-1 flex items-center justify-between">
        <span
          className="rounded-full bg-black/40 px-1.5 py-0.5 font-mono font-semibold"
          style={{ fontSize: dims.meta + 1 }}
        >
          {card.pitch}
        </span>
        {card.cost != null && (
          <span
            className="rounded-full bg-black/40 px-1.5 py-0.5 font-mono font-semibold"
            style={{ fontSize: dims.meta + 1 }}
          >
            {card.cost}
          </span>
        )}
      </div>

      {/* Name */}
      <div className="flex flex-1 items-center justify-center px-0.5 text-center">
        <div
          className="font-sans font-semibold"
          style={{
            fontSize: dims.name,
            lineHeight: 1.15,
            letterSpacing: '-0.005em',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {card.name}
        </div>
      </div>

      {/* Bottom: subtype + defense */}
      <div className="flex items-end justify-between gap-1.5">
        <span
          className="font-medium uppercase"
          style={{
            color: 'rgba(242,238,230,0.78)',
            fontSize: dims.meta,
            letterSpacing: '0.1em',
            lineHeight: 1.1,
          }}
        >
          {card.subtype ?? card.type.split(' ')[0]}
        </span>
        {card.defense != null && size !== 'thumb' && (
          <span
            className="font-mono"
            style={{ fontSize: dims.meta + 1, color: 'rgba(242,238,230,0.65)' }}
          >
            {t('editor.analytics.slot_d_label', { n: card.defense })}
          </span>
        )}
      </div>
    </div>
  );
}

const SIZE_MAP: Record<ArtSize, { w: number | string; h: number | string; name: number; meta: number }> = {
  thumb: { w: 80, h: 112, name: 11, meta: 8.5 },
  tile: { w: '100%', h: '100%', name: 12.5, meta: 9 },
  gallery: { w: 200, h: 280, name: 15, meta: 10 },
  full: { w: 360, h: 504, name: 22, meta: 12 },
};

const PITCH_GRADIENTS = {
  1: { from: 'rgba(208, 58, 58, 0.55)', to: 'rgba(70, 16, 16, 0.95)' },
  2: { from: 'rgba(226, 181, 60, 0.5)', to: 'rgba(70, 50, 12, 0.95)' },
  3: { from: 'rgba(74, 123, 217, 0.5)', to: 'rgba(15, 30, 70, 0.95)' },
} as const;
