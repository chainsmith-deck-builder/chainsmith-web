import { useTranslation } from 'react-i18next';

import { FilterMenu } from '../../components/FilterMenu';
import { PitchDot } from '../../components/PitchDot';
import type { CardType, Class } from '../../api/types';
import type { FilterValues } from './filterValues';

const ALL_CLASSES: readonly Class[] = [
  'assassin',
  'bard',
  'brute',
  'guardian',
  'illusionist',
  'mechanologist',
  'merchant',
  'ninja',
  'ranger',
  'runeblade',
  'shapeshifter',
  'warrior',
  'wizard',
];

// Card types are listed in roughly play-frequency order so the most
// commonly-used filters surface first. Heroes are deliberately last —
// most browsing happens against the non-hero catalog.
const ALL_TYPES: readonly CardType[] = [
  'action',
  'attack_action',
  'attack_reaction',
  'defense_reaction',
  'instant',
  'equipment',
  'weapon',
  'mentor',
  'resource',
  'token',
  'hero',
];

const PITCH_OPTIONS: readonly (1 | 2 | 3)[] = [1, 2, 3];

type Props = {
  values: FilterValues;
  onChange: (next: FilterValues) => void;
};

export function BrowseFilters({ values, onChange }: Props) {
  const { t } = useTranslation('catalog');

  const toggleClass = (cls: Class) => {
    const next = values.classes.includes(cls)
      ? values.classes.filter((c) => c !== cls)
      : [...values.classes, cls];
    onChange({ ...values, classes: next });
  };
  const toggleType = (ty: CardType) => {
    const next = values.types.includes(ty)
      ? values.types.filter((c) => c !== ty)
      : [...values.types, ty];
    onChange({ ...values, types: next });
  };
  const setPitch = (pitch: 1 | 2 | 3 | undefined) => {
    onChange({ ...values, pitch });
  };

  const classLabel =
    values.classes.length === 0
      ? t('browse.filter.class')
      : t('browse.filter.class_active', { count: values.classes.length });
  const typeLabel =
    values.types.length === 0
      ? t('browse.filter.type')
      : t('browse.filter.type_active', { count: values.types.length });

  return (
    <>
      <FilterMenu label={classLabel} active={values.classes.length > 0}>
        <CheckboxList>
          {ALL_CLASSES.map((cls) => (
            <CheckboxItem
              key={cls}
              checked={values.classes.includes(cls)}
              onToggle={() => toggleClass(cls)}
              label={t(`class.${cls}`)}
            />
          ))}
          {values.classes.length > 0 && (
            <ClearButton onClick={() => onChange({ ...values, classes: [] })} />
          )}
        </CheckboxList>
      </FilterMenu>

      <FilterMenu label={typeLabel} active={values.types.length > 0}>
        <CheckboxList>
          {ALL_TYPES.map((ty) => (
            <CheckboxItem
              key={ty}
              checked={values.types.includes(ty)}
              onToggle={() => toggleType(ty)}
              label={t(`type.${ty}`)}
            />
          ))}
          {values.types.length > 0 && (
            <ClearButton onClick={() => onChange({ ...values, types: [] })} />
          )}
        </CheckboxList>
      </FilterMenu>

      <FilterMenu
        label={
          values.pitch === undefined ? (
            <>
              <span>{t('browse.filter.pitch')}</span>
              <span className="inline-flex items-center gap-1">
                <PitchDot pitch={1} size={6} />
                <PitchDot pitch={2} size={6} />
                <PitchDot pitch={3} size={6} />
                <span className="ms-1 text-text-muted">{t('browse.filter.any')}</span>
              </span>
            </>
          ) : (
            <>
              <PitchDot pitch={values.pitch} size={7} />
              <span>{t('browse.filter.pitch_active', { value: values.pitch })}</span>
            </>
          )
        }
        active={values.pitch !== undefined}
      >
        <RadioList>
          <RadioItem
            checked={values.pitch === undefined}
            onSelect={() => setPitch(undefined)}
            label={t('browse.filter.any')}
          />
          {PITCH_OPTIONS.map((p) => (
            <RadioItem
              key={p}
              checked={values.pitch === p}
              onSelect={() => setPitch(p)}
              label={
                <span className="inline-flex items-center gap-1.5">
                  <PitchDot pitch={p} size={8} />
                  {t('browse.filter.pitch_active', { value: p })}
                </span>
              }
            />
          ))}
        </RadioList>
      </FilterMenu>
    </>
  );
}

function CheckboxList({ children }: { children: React.ReactNode }) {
  return <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto">{children}</div>;
}

function CheckboxItem({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-start text-[12.5px] text-text-primary hover:bg-bg-raised"
    >
      <span
        aria-hidden="true"
        className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-sm border"
        style={{
          background: checked ? 'var(--accent-brand)' : 'transparent',
          borderColor: checked ? 'var(--accent-brand)' : 'var(--border-default)',
        }}
      >
        {checked && (
          <svg
            viewBox="0 0 12 12"
            width="10"
            height="10"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m2.5 6.5 2.5 2.5 4.5-5" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

function RadioList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

function RadioItem({
  checked,
  onSelect,
  label,
}: {
  checked: boolean;
  onSelect: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      onClick={onSelect}
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-start text-[12.5px] text-text-primary hover:bg-bg-raised"
      style={{
        background: checked ? 'var(--bg-raised)' : 'transparent',
        fontWeight: checked ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation('catalog');
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 border-t border-border-subtle px-2 py-1.5 text-start text-[12px] font-medium text-text-secondary hover:text-text-primary"
    >
      {t('browse.filter.clear')}
    </button>
  );
}
