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
        className="relative flex h-full w-[360px] max-w-full flex-col gap-3.5 border-s border-border-default bg-bg-base p-5"
        style={{ boxShadow: '-20px 0 40px rgba(0,0,0,0.4)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-medium uppercase text-text-muted"
            style={{ fontSize: 11, letterSpacing: '0.5em' }}
          >
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
            className="text-[16px] font-semibold"
            style={{ letterSpacing: '-0.01em' }}
          >
            {card.name}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-text-muted">
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
        <div
          className="mt-auto border-t border-border-subtle py-3 text-[11px] text-text-faint"
        >
          {t('shared.sign_in_callout_body')}
        </div>
      </div>
    </div>
  );
}
