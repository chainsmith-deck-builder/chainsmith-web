import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';

import { GlobalHeader } from '../../components/GlobalHeader';
import { Pill } from '../../components/Pill';
import { Icon } from '../../components/Icon';
import {
  UI_FORMATS,
  formatI18nKey,
  presentationStatusFor,
  type UiFormatId,
} from '../../api/format';
import type { Hero } from '../../api/types';
import { useHeroes } from './useHeroes';
import { HeroTile } from './HeroTile';

export function HeroSelectScreen() {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  const [format, setFormat] = useState<UiFormatId>('classic_constructed');
  const [picked, setPicked] = useState<string | undefined>(undefined);

  const heroesQuery = useHeroes();

  const { eligible, retired, ineligible } = useMemo(() => {
    const items = heroesQuery.data ?? [];
    const eligibleList: Hero[] = [];
    const retiredList: Hero[] = [];
    const ineligibleList: Hero[] = [];
    for (const hero of items) {
      const status = presentationStatusFor(hero.legalitySummary, format);
      if (status === 'legal') eligibleList.push(hero);
      else if (status === 'retired') retiredList.push(hero);
      else ineligibleList.push(hero);
    }
    return { eligible: eligibleList, retired: retiredList, ineligible: ineligibleList };
  }, [heroesQuery.data, format]);

  return (
    <div className="flex min-h-dvh flex-col overflow-auto bg-bg-base text-text-primary">
      <GlobalHeader active="decks" />
      <main
        id="main-content"
        aria-label={t('hero_select.title')}
        className="mx-auto w-full max-w-6xl flex-1 px-10 py-8"
      >
        <div className="mb-2">
          <Link
            to="/"
            className="mb-2 inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
          >
            <Icon.arrowLeft /> {t('hero_select.back_to_decks')}
          </Link>
          <h1 className="m-0 text-display font-semibold tracking-heading">
            {t('hero_select.title')}
          </h1>
          <p className="mt-1 text-sm text-text-muted">{t('hero_select.subtitle')}</p>
        </div>

        {/* Format segmented control */}
        <div className="mb-4 mt-6 inline-flex w-fit gap-1.5 rounded-full border border-border-subtle bg-bg-raised p-1">
          {UI_FORMATS.map((f) => {
            const active = format === f;
            const tone = active
              ? 'bg-accent-brand text-white'
              : 'bg-transparent text-text-secondary';
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-fast ${tone}`}
              >
                {tCommon(formatI18nKey(f))}
              </button>
            );
          })}
        </div>

        {/* Search + filter chips. The filters themselves are not yet wired
            to the query — phase 2 work, when text/class/talent filters earn
            their keep with a real backend. */}
        <div className="mb-5 flex items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Icon.search />
            </span>
            <input
              placeholder={t('hero_select.search_placeholder')}
              aria-label={t('hero_select.search_placeholder')}
              className="block h-9 w-full rounded-md border border-border-subtle bg-bg-input px-3 ps-8 text-xs text-text-primary outline-none"
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

        {heroesQuery.isPending && (
          <div role="status" className="py-8 text-sm text-text-muted">
            {t('hero_select.loading')}
          </div>
        )}

        {heroesQuery.isError && (
          <div
            role="alert"
            className="rounded-xl border border-border-subtle bg-bg-raised p-6 text-sm text-text-secondary"
          >
            <p className="m-0 font-semibold text-text-primary">
              {t('hero_select.error.title')}
            </p>
            <button
              type="button"
              onClick={() => void heroesQuery.refetch()}
              className="mt-3 inline-flex h-8 items-center rounded-md border border-border-subtle bg-bg-base px-3 text-xs font-medium hover:bg-bg-overlay"
            >
              {t('hero_select.error.retry')}
            </button>
          </div>
        )}

        {heroesQuery.isSuccess &&
          eligible.length === 0 &&
          retired.length === 0 &&
          ineligible.length === 0 && (
            <p className="py-8 text-sm text-text-muted">{t('hero_select.empty')}</p>
          )}

        {heroesQuery.isSuccess && eligible.length > 0 && (
          <HeroGrid
            heroes={eligible}
            format={format}
            picked={picked}
            onPick={setPicked}
          />
        )}

        {heroesQuery.isSuccess && retired.length > 0 && (
          <HeroSubsection
            heading={t('hero_select.retired_heading')}
            count={retired.length}
            heroes={retired}
            format={format}
            onPick={setPicked}
          />
        )}

        {heroesQuery.isSuccess && ineligible.length > 0 && (
          <HeroSubsection
            heading={t('hero_select.ineligible_heading', {
              format: tCommon(formatI18nKey(format)),
            })}
            count={ineligible.length}
            heroes={ineligible}
            format={format}
            onPick={setPicked}
          />
        )}
      </main>
    </div>
  );
}

function HeroGrid({
  heroes,
  format,
  picked,
  onPick,
}: {
  heroes: readonly Hero[];
  format: UiFormatId;
  picked: string | undefined;
  onPick: (id: string) => void;
}) {
  return (
    <div
      className="grid gap-4"
      // eslint-disable-next-line react/forbid-dom-props -- responsive auto-fill grid template; no Tailwind utility
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
    >
      {heroes.map((hero) => (
        <HeroTile
          key={hero.id}
          hero={hero}
          format={format}
          isPicked={picked === hero.id}
          onPick={onPick}
        />
      ))}
    </div>
  );
}

function HeroSubsection({
  heading,
  count,
  heroes,
  format,
  onPick,
}: {
  heading: string;
  count: number;
  heroes: readonly Hero[];
  format: UiFormatId;
  onPick: (id: string) => void;
}) {
  return (
    <>
      <div className="my-6 flex items-center gap-2.5 text-tiny font-medium uppercase tracking-spread text-text-muted">
        <span>{heading}</span>
        <div className="h-px flex-1 bg-border-subtle" />
        <span className="font-mono tracking-normal text-text-faint">{count}</span>
      </div>
      <HeroGrid heroes={heroes} format={format} picked={undefined} onPick={onPick} />
    </>
  );
}
