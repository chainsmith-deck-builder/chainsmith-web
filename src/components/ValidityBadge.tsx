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
  return (
    <span
      className="inline-flex items-center gap-1.5 font-medium"
      style={{
        fontSize: compact ? 10.5 : 11.5,
        color: legal ? 'var(--state-success)' : 'var(--state-danger)',
        letterSpacing: '0.01em',
      }}
    >
      <span
        aria-hidden="true"
        className="block h-1.5 w-1.5 rounded-full"
        style={{
          background: legal ? 'var(--state-success)' : 'var(--state-danger)',
          boxShadow: legal
            ? '0 0 0 3px var(--state-success-soft)'
            : '0 0 0 3px var(--state-danger-soft)',
        }}
      />
      {label}
    </span>
  );
}
