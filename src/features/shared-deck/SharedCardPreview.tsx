import { useTranslation } from 'react-i18next';
import type { Card } from '../../domain/types';
import { CardArt } from '../../components/CardArt';
import { PitchDot } from '../../components/PitchDot';
import { Icon } from '../../components/Icon';

type Props = {
  card: Card;
  onClose: () => void;
};

export function SharedCardPreview({ card, onClose }: Props) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-end bg-black/55 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label={t('shared.preview_close')}
        onClick={onClose}
        className="absolute inset-0 bg-transparent"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shared-preview-title"
        className="relative flex h-full w-sidebar-wide max-w-full flex-col gap-3.5 border-s border-border-default bg-bg-base p-5 shadow-drawer"
      >
        <div className="flex items-center gap-2">
          <span className="text-tiny font-medium uppercase tracking-spread text-text-muted">
            {t('shared.preview_label')}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={tCommon('actions.close')}
            className="ms-auto inline-flex h-6 w-6 items-center justify-center rounded-md border border-border-subtle bg-bg-raised text-text-secondary"
          >
            <Icon.x />
          </button>
        </div>
        <div className="aspect-card overflow-hidden rounded-lg">
          <CardArt card={card} size="tile" />
        </div>
        <div>
          <div
            id="shared-preview-title"
            className="text-base font-semibold tracking-heading"
          >
            {card.name}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
            <PitchDot pitch={card.pitch} size={6} />
            <span>{tCommon('pitch.label', { n: card.pitch })}</span>
            <span>·</span>
            <span>{card.type}</span>
            {card.cost != null && (
              <>
                <span>·</span>
                <span className="font-mono">{t('shared.preview_cost', { n: card.cost })}</span>
              </>
            )}
          </div>
        </div>
        <div className="mt-auto border-t border-border-subtle py-3 text-tiny text-text-faint">
          {t('shared.sign_in_callout_body')}
        </div>
      </div>
    </div>
  );
}
