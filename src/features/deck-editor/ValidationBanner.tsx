import { useTranslation } from 'react-i18next';
import { Icon } from '../../components/Icon';

type Props = {
  onDismiss: () => void;
  count: number;
};

export function ValidationBanner({ onDismiss, count }: Props) {
  const { t } = useTranslation('common');
  const { t: tDeck } = useTranslation('deck');
  return (
    <div
      role="alert"
      className="flex items-center gap-2.5 border-b border-state-danger/30 bg-state-danger-soft px-5 py-2.5 text-xs"
    >
      <span className="text-state-danger">
        <Icon.alert />
      </span>
      <span className="text-text-primary">
        <strong className="font-semibold">{t('validity.violations', { count })}</strong>
        <span className="ms-1.5 text-text-secondary">— {tDeck('editor.violations.banner_short')}</span>
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t('actions.close')}
        className="ms-auto inline-flex h-5 w-5 items-center justify-center rounded-md text-state-danger hover:bg-state-danger-soft"
      >
        <Icon.x />
      </button>
    </div>
  );
}
