import { useTranslation } from 'react-i18next';
import { GlobalHeader } from '../../components/GlobalHeader';
import { CardTile } from '../../components/CardTile';
import { Pill } from '../../components/Pill';
import { PitchDot } from '../../components/PitchDot';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { CARDS } from '../../domain/cards';

export function BrowseCardsScreen() {
  const { t } = useTranslation('catalog');
  return (
    <div className="flex min-h-dvh flex-col overflow-auto bg-bg-base text-text-primary">
      <GlobalHeader active="browse" />
      <main
        id="main-content"
        aria-label={t('browse.title')}
        className="mx-auto w-full flex-1"
        style={{ maxWidth: 1200, padding: '28px 40px' }}
      >
        <h1
          className="m-0 mb-1.5 font-semibold"
          style={{ fontSize: 26, letterSpacing: '-0.015em' }}
        >
          {t('browse.title')}
        </h1>
        <p className="m-0 mb-5 text-[13px] text-text-muted">
          {t('browse.subtitle_prefix')}{' '}
          <span className="font-mono">{t('browse.subtitle_total', { total: '1,247' })}</span>
        </p>

        <div className="relative mb-3">
          <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon.search />
          </span>
          <input
            placeholder={t('browse.search_placeholder')}
            aria-label={t('browse.search_placeholder')}
            className="block h-10 w-full rounded-md border border-border-subtle bg-bg-input ps-9 pe-3 text-[13.5px] text-text-primary outline-none"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          <Pill>
            {t('browse.filter.class')} <Icon.chevron />
          </Pill>
          <Pill>
            {t('browse.filter.type')} <Icon.chevron />
          </Pill>
          <Pill>
            {t('browse.filter.pitch')}
            <span className="inline-flex items-center gap-1">
              <PitchDot pitch={1} size={6} />
              <PitchDot pitch={2} size={6} />
              <PitchDot pitch={3} size={6} />
              <span className="ms-1 text-text-muted">{t('browse.filter.any')}</span>
            </span>{' '}
            <Icon.chevron />
          </Pill>
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
          >
            <Icon.filter /> {t('browse.filter.advanced')}
          </button>
          <span className="ms-auto self-center font-mono text-[11.5px] text-text-muted">
            {t('browse.result_count', { total: '1,247', shown: 24 })}
          </span>
        </div>

        <div
          className="grid gap-3.5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
        >
          {CARDS.slice(0, 18).map((c) => (
            <CardTile key={c.id} card={c} />
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <Button variant="secondary">{t('browse.load_more', { remaining: '1,229' })}</Button>
        </div>
      </main>
    </div>
  );
}
