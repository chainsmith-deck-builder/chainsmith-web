import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card, EquipmentSlotKey } from '../../domain/types';
import { findCard } from '../../domain/cards';
import { getHero } from '../../domain/heroes';
import { DEMO_DECK, DEMO_EQUIPMENT } from '../../domain/decks';
import { GlobalHeader } from '../../components/GlobalHeader';
import { HeroAvatar } from '../../components/HeroAvatar';
import { ValidityBadge } from '../../components/ValidityBadge';
import { CardArt } from '../../components/CardArt';
import { PitchDot } from '../../components/PitchDot';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { PitchDistribution } from '../deck-editor/PitchDistribution';
import { StatRow } from '../deck-editor/StatRow';
import { SharedCardPreview } from './SharedCardPreview';

const SLOT_KEYS: readonly EquipmentSlotKey[] = [
  'head',
  'chest',
  'arms',
  'legs',
  'mainHand',
  'offHand',
];

export function SharedDeckScreen() {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [previewCard, setPreviewCard] = useState<Card | null>(null);
  const hero = getHero('iyslander');
  const heroLine = `${hero.name} · ${hero.cls}${
    hero.talents.length > 0 ? ` · ${hero.talents.join(' · ')}` : ''
  }`;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-auto bg-bg-base text-text-primary">
      <GlobalHeader signedIn={false} />
      <main
        id="main-content"
        aria-label={t('editor.title_default')}
        className="mx-auto w-full flex-1"
        style={{ maxWidth: 1000, padding: '28px 40px' }}
      >
        {/* Sign-in callout */}
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-accent-brand-dim bg-accent-brand-soft px-4 py-3">
          <div className="flex-1">
            <div className="text-[13px] font-semibold">
              {t('shared.sign_in_callout_title')}
            </div>
            <div className="mt-0.5 text-[11.5px] text-text-muted">
              {t('shared.sign_in_callout_body')}
            </div>
          </div>
          <Button variant="primary">{tCommon('actions.sign_in')}</Button>
        </div>

        {/* Header — attribution moved to footer */}
        <div className="mb-7 flex items-start gap-5">
          <HeroAvatar heroId="iyslander" size={64} />
          <div className="flex-1">
            <h1
              className="m-0 font-semibold"
              style={{ fontSize: 24, letterSpacing: '-0.015em' }}
            >
              {t('editor.title_default')}
            </h1>
            <div className="mt-1 text-[13px] text-text-secondary">{heroLine}</div>
            <div className="mt-1.5 flex items-center gap-2.5 text-[11.5px] text-text-muted">
              <span
                className="font-medium uppercase"
                style={{ fontSize: 9.5, letterSpacing: '0.1em' }}
              >
                {tCommon('format.classic_constructed')}
              </span>
              <span className="font-mono">60/60</span>
              <ValidityBadge legal compact />
            </div>
          </div>
          <Button variant="primary">
            <Icon.copy /> {t('shared.clone_deck')}
          </Button>
        </div>

        <div className="grid gap-7" style={{ gridTemplateColumns: '1fr 320px' }}>
          <div>
            {/* Equipment */}
            <SectionHead label={t('shared.section_equipment')} count="5/6" />
            <div className="mb-6 grid grid-cols-6 gap-2">
              {SLOT_KEYS.map((slot) => {
                const cardId = DEMO_EQUIPMENT[slot];
                const card = cardId ? findCard(cardId) : null;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => card && setPreviewCard(card)}
                    disabled={!card}
                    aria-label={card ? card.name : `Empty ${slot}`}
                    className="aspect-card overflow-hidden rounded-md p-0"
                    style={{
                      background: 'transparent',
                      border: card ? 'none' : '1px dashed var(--border-default)',
                      cursor: card ? 'pointer' : 'default',
                    }}
                  >
                    {card ? <CardArt card={card} size="tile" /> : null}
                  </button>
                );
              })}
            </div>

            <SectionHead label={t('shared.section_deck')} count="60" />
            {([1, 2, 3] as const).map((p) => {
              const rows = DEMO_DECK.filter((d) => {
                const c = findCard(d.id);
                return c && c.pitch === p && c.type !== 'Equipment';
              });
              const total = rows.reduce((s, r) => s + r.qty, 0);
              return (
                <div key={p} className="mb-3.5">
                  <div
                    className="mb-1 flex items-center gap-2 py-0.5 font-semibold uppercase text-text-muted"
                    style={{ fontSize: 10.5, letterSpacing: '0.12em' }}
                  >
                    <PitchDot pitch={p} size={6} />
                    {tCommon('pitch.label', { n: p })}
                    <span
                      className="ms-auto font-mono text-text-faint"
                      style={{ letterSpacing: 0 }}
                    >
                      {total}
                    </span>
                  </div>
                  {rows.map((d) => {
                    const c = findCard(d.id);
                    if (!c) return null;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setPreviewCard(c)}
                        aria-label={c.name}
                        className="flex w-full cursor-pointer items-center gap-2 border-b border-border-subtle bg-transparent px-2 py-1.5 text-start transition-colors duration-fast hover:bg-bg-overlay"
                      >
                        <PitchDot pitch={c.pitch} size={6} />
                        <span className="text-[12.5px] font-medium">{c.name}</span>
                        <span className="ms-auto font-mono text-[12px] text-text-muted">
                          ×{d.qty}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <aside>
            <button
              type="button"
              onClick={() => setAnalyticsOpen(!analyticsOpen)}
              aria-expanded={analyticsOpen}
              className="mb-2.5 flex w-full cursor-pointer items-center gap-2 bg-transparent py-1.5 text-[11px] font-medium uppercase text-text-muted"
              style={{ letterSpacing: '0.5em' }}
            >
              <span
                aria-hidden="true"
                className="inline-flex transition-transform duration-fast"
                style={{ transform: analyticsOpen ? 'rotate(90deg)' : 'rotate(0)' }}
              >
                <Icon.chevron />
              </span>
              {t('shared.analytics')}
            </button>
            {analyticsOpen && (
              <div className="rounded-lg border border-border-subtle bg-bg-raised p-3.5">
                <div className="mb-1.5 text-[11px] text-text-muted">
                  {t('editor.analytics.pitch_distribution')}
                </div>
                <PitchDistribution data={{ p1: 16, p2: 16, p3: 9 }} />
                <div className="my-3.5 h-px bg-border-subtle" />
                <StatRow label={t('editor.analytics.avg_pitch_value')} value="2.1" />
                <StatRow
                  label={t('editor.analytics.net_resource')}
                  value="+4"
                  accent="var(--state-success)"
                />
                <StatRow label={t('editor.analytics.zero_cost_cards')} value="62%" />
                <StatRow label={t('editor.analytics.go_again_count')} value="14" />
              </div>
            )}
          </aside>
        </div>

        {/* Footer attribution */}
        <footer className="mt-9 flex items-center gap-3.5 border-t border-border-subtle py-5 text-[11.5px] text-text-muted">
          <div
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[11.5px] font-semibold text-white"
            style={{ background: 'oklch(0.45 0.12 218)' }}
          >
            F
          </div>
          <div className="flex flex-col gap-px">
            <span className="[&>strong]:font-medium [&>strong]:text-text-secondary">
              {t('shared.footer_created_by', { author: 'frostbrew' })}
            </span>
            <span className="text-text-faint">
              {t('shared.footer_meta', { edited: '3 days ago', views: 142, clones: 18 })}
            </span>
          </div>
          <div className="ms-auto flex gap-2">
            <button
              type="button"
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11.5px] text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
            >
              <Icon.link /> {t('shared.copy_link')}
            </button>
            <button
              type="button"
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11.5px] text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
            >
              {t('shared.report')}
            </button>
          </div>
        </footer>
      </main>

      {previewCard && (
        <SharedCardPreview card={previewCard} onClose={() => setPreviewCard(null)} />
      )}
    </div>
  );
}

function SectionHead({ label, count }: { label: string; count?: string }) {
  return (
    <div
      className="mb-2.5 flex items-center gap-2 font-semibold uppercase text-text-muted"
      style={{ fontSize: 10.5, letterSpacing: '0.12em' }}
    >
      <span>{label}</span>
      {count && (
        <span className="ms-auto font-mono text-text-faint" style={{ letterSpacing: 0 }}>
          {count}
        </span>
      )}
    </div>
  );
}
