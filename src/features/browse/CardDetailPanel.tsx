import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { CardText } from '../../components/CardText';
import { Icon } from '../../components/Icon';
import { UI_FORMATS, formatI18nKey, legalityFor } from '../../api/format';
import type { Card, FormatStatus, Printing } from '../../api/types';
import { useCard } from './useCard';

type Props = {
  cardId: string | null;
  onClose: () => void;
};

// Card detail surface: full-screen overlay on mobile, fixed right-side
// panel on desktop. Esc and the close button always dismiss; on mobile a
// backdrop click does too. The panel is non-modal on desktop so the user
// can keep clicking other tiles in the grid behind it (the panel just
// swaps to the new card's detail). Per .claude/rules/accessibility.md
// the underlying layout cannot become inert in that flow.
export function CardDetailPanel({ cardId, onClose }: Props) {
  const { t } = useTranslation('catalog');
  const cardQuery = useCard(cardId);

  useEffect(() => {
    if (cardId === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cardId, onClose]);

  if (cardId === null) return null;

  return (
    <>
      {/* Mobile backdrop. Hidden on md+ where the panel is a side surface. */}
      <button
        type="button"
        aria-label={t('browse.detail.close')}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 md:hidden"
      />
      <aside
        role="dialog"
        aria-label={t('browse.detail.title')}
        className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg-base md:start-auto md:end-0 md:w-[420px] md:border-s md:border-border-subtle md:shadow-xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-bg-base/90 px-4 py-3 backdrop-blur">
          <h2 className="m-0 text-[14px] font-semibold uppercase text-text-muted" style={{ letterSpacing: '0.18em' }}>
            {t('browse.detail.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('browse.detail.close')}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-raised hover:text-text-primary"
          >
            <Icon.x size={18} />
          </button>
        </header>

        {cardQuery.isPending && (
          <div role="status" className="px-4 py-8 text-[13px] text-text-muted">
            {t('browse.detail.loading')}
          </div>
        )}

        {cardQuery.isError && (
          <div role="alert" className="px-4 py-8 text-[13px] text-state-danger">
            {t('browse.detail.error')}
          </div>
        )}

        {cardQuery.isSuccess && (
          <CardDetailBody card={cardQuery.data.card} printings={cardQuery.data.printings} />
        )}
      </aside>
    </>
  );
}

function CardDetailBody({
  card,
  printings,
}: {
  card: Card;
  printings: readonly Printing[];
}) {
  const { t } = useTranslation('catalog');
  const { t: tCommon } = useTranslation('common');
  const heroImage = printings[0]?.imageUrl ?? null;

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      {heroImage && (
        <img
          src={heroImage}
          alt={card.name}
          loading="lazy"
          decoding="async"
          className="aspect-card w-full rounded-md object-cover"
        />
      )}

      <div>
        <h3 className="m-0 text-[18px] font-semibold" style={{ letterSpacing: '-0.01em' }}>
          {card.name}
        </h3>
        {card.typeText && (
          <p className="m-0 mt-1 text-[12.5px] text-text-muted">{card.typeText}</p>
        )}
      </div>

      <StatRow card={card} />

      {(card.classes.length > 0 || card.talents.length > 0 || card.keywords.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {card.classes.map((c) => (
            <Tag key={`class-${c}`}>{t(`class.${c}`)}</Tag>
          ))}
          {card.talents.map((tl) => (
            <Tag key={`talent-${tl}`}>{t(`talent.${tl}`)}</Tag>
          ))}
          {card.keywords.map((kw) => (
            <Tag key={`keyword-${kw}`}>{kw}</Tag>
          ))}
        </div>
      )}

      <div className="rounded-md border border-border-subtle bg-bg-raised p-3 text-[13px] leading-relaxed text-text-primary">
        {card.functionalText && card.functionalText.trim().length > 0 ? (
          <p className="m-0 whitespace-pre-wrap">
            <CardText text={card.functionalText} />
          </p>
        ) : (
          <p className="m-0 italic text-text-muted">{t('browse.detail.rules_empty')}</p>
        )}
      </div>

      <div>
        <SectionHeading>{t('browse.detail.legality_heading')}</SectionHeading>
        <ul className="mt-2 flex flex-col gap-1.5">
          {UI_FORMATS.map((fmt) => (
            <LegalityRow
              key={fmt}
              label={tCommon(formatI18nKey(fmt))}
              status={legalityFor(card.legalitySummary, fmt)}
            />
          ))}
        </ul>
      </div>

      {printings.length > 0 && (
        <div>
          <SectionHeading>
            {t('browse.detail.printings_heading', { count: printings.length })}
          </SectionHeading>
          <ul className="mt-2 grid grid-cols-3 gap-2">
            {printings.map((p) => (
              <PrintingTile key={p.id} printing={p} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatRow({ card }: { card: Card }) {
  const { t } = useTranslation('catalog');
  const stats: { label: string; value: number | null | undefined }[] = [
    { label: t('browse.detail.cost'), value: card.cost },
    { label: t('browse.detail.pitch'), value: card.pitch },
    { label: t('browse.detail.power'), value: card.power },
    { label: t('browse.detail.defense'), value: card.defense },
  ];
  const visible = stats.filter((s) => s.value !== null && s.value !== undefined);
  if (visible.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {visible.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center rounded-md border border-border-subtle bg-bg-raised px-3 py-2 min-w-16"
        >
          <span
            className="text-[10px] font-medium uppercase text-text-muted"
            style={{ letterSpacing: '0.12em' }}
          >
            {s.label}
          </span>
          <span className="font-mono text-[18px] font-semibold text-text-primary">
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function LegalityRow({ label, status }: { label: string; status: FormatStatus }) {
  const tone = LEGALITY_TONE[status];
  return (
    <li className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-raised px-3 py-1.5 text-[12.5px]">
      <span className="text-text-secondary">{label}</span>
      <span
        className="rounded-sm px-2 py-0.5 font-medium uppercase"
        style={{
          fontSize: 10,
          letterSpacing: '0.06em',
          background: tone.bg,
          color: tone.fg,
        }}
      >
        {status.replace(/_/g, ' ')}
      </span>
    </li>
  );
}

const LEGALITY_TONE: Record<FormatStatus, { bg: string; fg: string }> = {
  legal: { bg: 'var(--state-success-soft)', fg: 'var(--state-success)' },
  banned: { bg: 'var(--state-danger-soft)', fg: 'var(--state-danger)' },
  suspended: { bg: 'var(--state-warning-soft)', fg: 'var(--state-warning)' },
  restricted: { bg: 'var(--state-warning-soft)', fg: 'var(--state-warning)' },
  living_legend_retired: { bg: 'var(--state-warning-soft)', fg: 'var(--state-warning)' },
  not_eligible: { bg: 'transparent', fg: 'var(--text-faint)' },
};

function PrintingTile({ printing }: { printing: Printing }) {
  return (
    <li className="overflow-hidden rounded-md border border-border-subtle bg-bg-raised">
      {printing.imageUrl ? (
        <img
          src={printing.imageUrl}
          alt={`${printing.set} ${printing.collectorNumber}`}
          loading="lazy"
          decoding="async"
          className="aspect-card w-full object-cover"
        />
      ) : (
        <div className="flex aspect-card w-full items-center justify-center bg-bg-overlay">
          <span className="text-center text-[10px] text-text-muted">
            {printing.set} {printing.collectorNumber}
          </span>
        </div>
      )}
      <div className="px-1.5 py-1 text-center">
        <span className="font-mono text-[10px] text-text-muted">
          {printing.set} · {printing.rarity}
        </span>
      </div>
    </li>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10.5px] font-medium uppercase text-text-muted"
      style={{ letterSpacing: '0.18em' }}
    >
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-border-subtle bg-bg-overlay px-2.5 text-[11px] text-text-secondary">
      {children}
    </span>
  );
}

