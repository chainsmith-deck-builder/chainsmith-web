import { useTranslation } from 'react-i18next';

import { UI_FORMATS, formatI18nKey, type UiFormatId } from '../../api/format';
import type { Talent } from '../../api/types';
import { EMPTY_FILTERS, countAdvancedActive, type FilterValues } from './filterValues';

const ALL_TALENTS: readonly Talent[] = [
  'draconic',
  'earth',
  'elemental',
  'ice',
  'light',
  'lightning',
  'shadow',
  'wind',
];

type Props = {
  values: FilterValues;
  onChange: (next: FilterValues) => void;
};

// Expandable advanced-filters panel. Rendered between the chip row and the
// card grid when the "Advanced filters" trigger is open. Wires the typed
// `useCards` params the chip-row pills don't cover: talent, cost min/max,
// format.
export function AdvancedFilters({ values, onChange }: Props) {
  const { t } = useTranslation('catalog');

  const toggleTalent = (talent: Talent) => {
    const next = values.talents.includes(talent)
      ? values.talents.filter((t) => t !== talent)
      : [...values.talents, talent];
    onChange({ ...values, talents: next });
  };

  const setCost = (key: 'costMin' | 'costMax', raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === '') {
      onChange({ ...values, [key]: undefined });
      return;
    }
    const parsed = Number.parseInt(trimmed, 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    onChange({ ...values, [key]: parsed });
  };

  const setFormat = (format: UiFormatId | undefined) => {
    onChange({ ...values, format });
  };

  const clearAll = () =>
    onChange({
      ...values,
      talents: EMPTY_FILTERS.talents,
      costMin: EMPTY_FILTERS.costMin,
      costMax: EMPTY_FILTERS.costMax,
      format: EMPTY_FILTERS.format,
    });

  const hasAny = countAdvancedActive(values) > 0;

  return (
    <section
      aria-label={t('browse.filter.advanced')}
      className="mb-4 rounded-lg border border-border-subtle bg-bg-raised p-4"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <FieldGroup label={t('browse.advanced.talent')}>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TALENTS.map((talent) => {
              const selected = values.talents.includes(talent);
              return (
                <button
                  key={talent}
                  type="button"
                  role="switch"
                  aria-checked={selected}
                  onClick={() => toggleTalent(talent)}
                  className="inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-medium transition-colors duration-fast"
                  style={{
                    background: selected ? 'var(--accent-brand-soft)' : 'var(--bg-overlay)',
                    borderColor: selected ? 'var(--accent-brand-dim)' : 'var(--border-subtle)',
                    color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {t(`talent.${talent}`)}
                </button>
              );
            })}
          </div>
        </FieldGroup>

        <FieldGroup label={t('browse.advanced.cost')}>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={values.costMin ?? ''}
              onChange={(e) => setCost('costMin', e.target.value)}
              aria-label={t('browse.advanced.cost_min_placeholder')}
              placeholder={t('browse.advanced.cost_min_placeholder')}
              className="h-8 w-20 rounded-md border border-border-subtle bg-bg-input px-2 font-mono text-[12.5px] text-text-primary outline-none"
            />
            <span aria-hidden="true" className="text-text-muted">
              –
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={values.costMax ?? ''}
              onChange={(e) => setCost('costMax', e.target.value)}
              aria-label={t('browse.advanced.cost_max_placeholder')}
              placeholder={t('browse.advanced.cost_max_placeholder')}
              className="h-8 w-20 rounded-md border border-border-subtle bg-bg-input px-2 font-mono text-[12.5px] text-text-primary outline-none"
            />
          </div>
        </FieldGroup>

        <FieldGroup label={t('browse.advanced.format')}>
          <div role="radiogroup" className="flex flex-wrap gap-1.5">
            <FormatRadio
              checked={values.format === undefined}
              onSelect={() => setFormat(undefined)}
              label={t('browse.advanced.format_any')}
            />
            {UI_FORMATS.map((f) => (
              <FormatRadio
                key={f}
                checked={values.format === f}
                onSelect={() => setFormat(f)}
                label={t(formatI18nKey(f), { ns: 'common' })}
              />
            ))}
          </div>
        </FieldGroup>
      </div>

      {hasAny && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={clearAll}
            className="text-[12px] font-medium text-text-secondary hover:text-text-primary"
          >
            {t('browse.advanced.clear')}
          </button>
        </div>
      )}
    </section>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="mb-2 font-medium uppercase text-text-muted"
        style={{ fontSize: 10.5, letterSpacing: '0.18em' }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function FormatRadio({
  checked,
  onSelect,
  label,
}: {
  checked: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className="inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-medium transition-colors duration-fast"
      style={{
        background: checked ? 'var(--accent-brand-soft)' : 'var(--bg-overlay)',
        borderColor: checked ? 'var(--accent-brand-dim)' : 'var(--border-subtle)',
        color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
      }}
    >
      {label}
    </button>
  );
}

