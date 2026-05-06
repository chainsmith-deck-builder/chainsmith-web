import { useTranslation } from 'react-i18next';
import type { Card } from '../../domain/types';
import { CardArt } from '../../components/CardArt';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';

type Props = {
  card: Card;
  onClose: () => void;
  readOnly?: boolean;
  showRemoveFromPool?: boolean;
};

type Printing = {
  set: string;
  edition: 'first' | 'unlimited';
  rarity: 'common';
  cn: string;
  selected?: boolean;
};

const DEMO_PRINTINGS: readonly Printing[] = [
  { set: 'UPR', edition: 'first', rarity: 'common', cn: '083', selected: true },
  { set: 'UPR', edition: 'unlimited', rarity: 'common', cn: '083' },
  { set: 'CRU', edition: 'first', rarity: 'common', cn: '062' },
];

const DEMO_LEGALITY: readonly { format: string; legal: boolean }[] = [
  { format: 'Classic Constructed', legal: true },
  { format: 'Blitz', legal: true },
  { format: 'Commoner', legal: false },
];

export function CardDrawer({ card, onClose, readOnly = false, showRemoveFromPool = false }: Props) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label={tCommon('actions.close')}
        onClick={onClose}
        className="absolute inset-0 z-100 bg-black/50"
      />
      <aside className="absolute bottom-0 end-0 top-0 z-101 flex w-drawer flex-col overflow-hidden border-s border-border-subtle bg-bg-raised shadow-drawer">
        <div className="flex items-center border-b border-border-subtle px-5 py-3.5">
          <div className="text-sm font-semibold">{t('editor.card_drawer.title')}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tCommon('actions.close')}
            className="ms-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors duration-fast hover:bg-bg-overlay hover:text-text-primary"
          >
            <Icon.x />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {/* Hero card art */}
          <div className="mb-4 flex justify-center">
            <div className="aspect-card w-60">
              <CardArt card={card} size="tile" />
            </div>
          </div>
          <div className="mb-3.5">
            <h3 className="m-0 text-lg font-semibold tracking-heading">{card.name}</h3>
            <div className="mt-0.5 text-xs text-text-muted">
              {card.type}
              {card.subtype ? ` · ${card.subtype}` : ''}
            </div>
          </div>

          {!readOnly && (
            <div
              className={`flex items-center gap-1 rounded-md border border-border-subtle bg-bg-base p-2.5 ${showRemoveFromPool ? 'mb-2' : 'mb-4'}`}
            >
              <button
                type="button"
                aria-label={t('editor.card_drawer.remove_one')}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-bg-overlay hover:text-text-primary"
              >
                <Icon.minus />
              </button>
              <span className="min-w-8 text-center font-mono text-sm font-semibold">
                {showRemoveFromPool ? '0' : '3'}
              </span>
              <button
                type="button"
                aria-label={t('editor.card_drawer.add_one')}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-bg-overlay hover:text-text-primary"
              >
                <Icon.plus />
              </button>
              <span className="ms-2.5 text-tiny text-text-muted">
                {showRemoveFromPool
                  ? t('editor.card_drawer.in_active_loadout')
                  : t('editor.card_drawer.copies_in_deck')}
              </span>
            </div>
          )}

          {!readOnly && showRemoveFromPool && (
            <div className="mb-4 rounded-md border border-state-danger/25 bg-state-danger-soft px-3 py-2.5">
              <div className="mb-2 text-tiny leading-normal text-text-secondary">
                {t('editor.card_drawer.orphaned_pool', { qty: 2 })}
              </div>
              <Button variant="secondary" className="border-state-danger/40 text-state-danger">
                <Icon.x /> {t('editor.card_drawer.remove_from_pool')}
              </Button>
            </div>
          )}

          <SectionHead label={t('editor.card_drawer.rules_text')} />
          <div className="mb-4 text-xs leading-relaxed text-text-secondary">
            <em className="not-italic text-text-muted">
              {t('editor.card_drawer.rules_text_label_instant')}
            </em>
            {t('editor.card_drawer.rules_text_demo').replace(
              t('editor.card_drawer.rules_text_label_instant'),
              '',
            )}
          </div>

          <SectionHead label={t('editor.card_drawer.printings')} count={DEMO_PRINTINGS.length} />
          <div className="flex flex-col gap-1.5">
            {DEMO_PRINTINGS.map((p, i) => (
              <PrintingRow key={i} printing={p} readOnly={readOnly} />
            ))}
          </div>

          <div className="mt-4">
            <SectionHead label={t('editor.card_drawer.format_legality')} />
            <div className="flex flex-col gap-1 text-tiny">
              {DEMO_LEGALITY.map(({ format, legal }) => (
                <div key={format} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`block h-1.5 w-1.5 rounded-full ${legal ? 'bg-state-success' : 'bg-text-faint'}`}
                  />
                  <span className={legal ? 'text-text-secondary' : 'text-text-muted'}>
                    {format}
                  </span>
                  {!legal && (
                    <span className="ms-auto text-2xs text-text-faint">
                      {t('editor.card_drawer.not_legal_short')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function PrintingRow({ printing, readOnly }: { printing: Printing; readOnly: boolean }) {
  const { t } = useTranslation('deck');
  const editionLabel =
    printing.edition === 'first'
      ? t('editor.card_drawer.edition_first')
      : t('editor.card_drawer.edition_unlimited');
  const tone = printing.selected
    ? 'bg-accent-brand-soft border-accent-brand-dim'
    : 'bg-bg-base border-border-subtle';
  return (
    <div className={`flex items-center gap-2.5 rounded-md border px-2.5 py-2 ${tone}`}>
      <div className="font-mono text-tiny text-text-secondary">
        {printing.set}-{printing.cn}
      </div>
      <div className="text-tiny text-text-secondary">
        {editionLabel} · {t('editor.card_drawer.rarity_common')}
      </div>
      {printing.selected ? (
        <span className="ms-auto inline-flex items-center gap-1 text-2xs font-semibold text-accent-brand">
          <Icon.check />
          {readOnly
            ? t('editor.card_drawer.printing_used')
            : t('editor.card_drawer.printing_selected')}
        </span>
      ) : (
        !readOnly && (
          <button
            type="button"
            className="ms-auto inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-tiny text-text-secondary transition-colors duration-fast hover:bg-bg-overlay hover:text-text-primary"
          >
            {t('editor.card_drawer.printing_use_this')}
          </button>
        )
      )}
    </div>
  );
}

function SectionHead({ label, count }: { label: string; count?: number }) {
  return (
    <div className="mb-2 flex items-center gap-2 text-2xs font-semibold uppercase tracking-label text-text-muted">
      <span>{label}</span>
      {count != null && (
        <span className="ms-auto font-mono tracking-normal text-text-faint">{count}</span>
      )}
    </div>
  );
}
