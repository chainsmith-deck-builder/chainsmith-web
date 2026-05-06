import { useTranslation } from 'react-i18next';
import { PitchDot } from '../../components/PitchDot';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

export function EmptyState() {
  const { t } = useTranslation('deck');
  return (
    <div className="px-5 py-16 text-center">
      <div className="mb-6 inline-flex gap-2">
        {([1, 2, 3] as const).map((p) => (
          <div
            key={p}
            className="flex h-12 w-9 items-center justify-center rounded-md border border-border-subtle bg-bg-raised"
          >
            <PitchDot pitch={p} size={14} />
          </div>
        ))}
      </div>
      <h2 className="mb-2 text-xl font-semibold tracking-heading">{t('list.empty.title')}</h2>
      <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-text-muted">
        {t('list.empty.body')}
      </p>
      <Button variant="primary" size="lg">
        <Icon.plus /> {t('list.new_deck')}
      </Button>
    </div>
  );
}
