import { useTranslation } from 'react-i18next';

type Props = {
  /** Whether the deck passes validation. */
  legal: boolean;
  /** Override the right-side text. Useful for "3 violations" etc. */
  customLabel?: string | undefined;
  /** Smaller variant used inline in tile cards. */
  compact?: boolean;
};

// Legality dot + label. Color and the textual label both convey the state
// (color alone is insufficient per .claude/rules/accessibility.md).
export function ValidityBadge({ legal, customLabel, compact = false }: Props) {
  const { t } = useTranslation('common');
  const label = customLabel ?? (legal ? t('validity.legal') : t('validity.illegal'));
  const fontSize = compact ? 'text-2xs' : 'text-tiny';
  const tone = legal ? 'text-state-success' : 'text-state-danger';
  const dotBg = legal ? 'bg-state-success' : 'bg-state-danger';
  const dotRing = legal
    ? 'ring-state-success-soft'
    : 'ring-state-danger-soft';
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium tracking-wide ${fontSize} ${tone}`}>
      <span
        aria-hidden="true"
        className={`block h-1.5 w-1.5 rounded-full ring-3 ${dotBg} ${dotRing}`}
      />
      {label}
    </span>
  );
}
