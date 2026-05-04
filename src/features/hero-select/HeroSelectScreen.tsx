import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalHeader } from '../../components/GlobalHeader';
import { Pill } from '../../components/Pill';
import { Icon } from '../../components/Icon';
import { HEROES } from '../../domain/heroes';
import type { Format } from '../../domain/types';
import { HeroTile } from './HeroTile';

const FORMATS: readonly Format[] = ['Classic Constructed', 'Blitz', 'Commoner'];
const HERO_IDS = [
  'iyslander',
  'bravo',
  'briar',
  'katsu',
  'prism',
  'dorinthea',
  'data',
  'oldhim',
] as const;

export function HeroSelectScreen() {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  const [format, setFormat] = useState<Format>('Classic Constructed');
  const [picked, setPicked] = useState('iyslander');

  const eligible = HERO_IDS.filter((id) => HEROES[id]?.formats.includes(format));
  const ineligible = HERO_IDS.filter((id) => !HEROES[id]?.formats.includes(format));

  return (
    <div className="flex min-h-dvh flex-col overflow-auto bg-bg-base text-text-primary">
      <GlobalHeader active="decks" />
      <main
        id="main-content"
        aria-label={t('hero_select.title')}
        className="mx-auto w-full flex-1"
        style={{ maxWidth: 1200, padding: '32px 40px' }}
      >
        <div className="mb-2">
          <button
            type="button"
            className="mb-2 inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
          >
            <Icon.arrowLeft /> {t('hero_select.back_to_decks')}
          </button>
          <h1
            className="m-0 font-semibold"
            style={{ fontSize: 26, letterSpacing: '-0.015em' }}
          >
            {t('hero_select.title')}
          </h1>
          <p className="mt-1 text-[13px] text-text-muted">{t('hero_select.subtitle')}</p>
        </div>

        {/* Format segmented control */}
        <div
          className="mb-4 mt-6 inline-flex w-fit gap-1.5 rounded-full border border-border-subtle bg-bg-raised p-1"
        >
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              aria-pressed={format === f}
              className="rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors duration-fast"
              style={{
                background: format === f ? 'var(--accent-brand)' : 'transparent',
                color: format === f ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {tCommon(formatI18nKey(f))}
            </button>
          ))}
        </div>

        {/* Search + filter chips */}
        <div className="mb-5 flex items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Icon.search />
            </span>
            <input
              placeholder={t('hero_select.search_placeholder')}
              aria-label={t('hero_select.search_placeholder')}
              className="block h-9 w-full rounded-md border border-border-subtle bg-bg-input px-3 ps-8 text-[12.5px] text-text-primary outline-none"
            />
          </div>
          <Pill>
            {t('hero_select.filter.class', { value: t('hero_select.filter.any') })}{' '}
            <Icon.chevron />
          </Pill>
          <Pill>
            {t('hero_select.filter.talent', { value: t('hero_select.filter.any') })}{' '}
            <Icon.chevron />
          </Pill>
        </div>

        {/* Eligible heroes */}
        <div
          className="grid gap-3.5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}
        >
          {eligible.map((id) => {
            const hero = HEROES[id];
            if (!hero) return null;
            return (
              <HeroTile
                key={id}
                hero={hero}
                format={format}
                isPicked={picked === id}
                onPick={setPicked}
              />
            );
          })}
        </div>

        {/* Ineligible heroes — visible but locked */}
        {ineligible.length > 0 && (
          <>
            <div
              className="my-6 flex items-center gap-2.5 font-medium uppercase text-text-muted"
              style={{ fontSize: 11, letterSpacing: '0.5em' }}
            >
              <span>{t('hero_select.ineligible_heading', { format })}</span>
              <div className="h-px flex-1 bg-border-subtle" />
              <span className="font-mono text-text-faint" style={{ letterSpacing: 0 }}>
                {ineligible.length}
              </span>
            </div>
            <div
              className="grid gap-3.5"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}
            >
              {ineligible.map((id) => {
                const hero = HEROES[id];
                if (!hero) return null;
                return (
                  <HeroTile
                    key={id}
                    hero={hero}
                    format={format}
                    isPicked={false}
                    onPick={setPicked}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function formatI18nKey(format: Format): 'format.classic_constructed' | 'format.blitz' | 'format.commoner' {
  if (format === 'Classic Constructed') return 'format.classic_constructed';
  if (format === 'Blitz') return 'format.blitz';
  return 'format.commoner';
}
