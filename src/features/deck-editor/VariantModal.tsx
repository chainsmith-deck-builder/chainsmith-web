import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

type Props = {
  onClose: () => void;
};

export function VariantModal({ onClose }: Props) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label={tCommon('actions.close')}
        onClick={onClose}
        className="absolute inset-0 z-[200] bg-black/55"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="variant-modal-title"
        className="absolute start-1/2 top-1/2 z-[201] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border-subtle bg-bg-raised"
        style={{ width: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center border-b border-border-subtle px-5 py-3.5">
          <h2 id="variant-modal-title" className="m-0 text-[14px] font-semibold">
            {t('editor.variant_modal.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={tCommon('actions.close')}
            className="ms-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-bg-overlay hover:text-text-primary"
          >
            <Icon.x />
          </button>
        </div>
        <div className="p-5">
          <p
            className="m-0 mb-3.5 text-[12.5px] text-text-secondary"
            style={{ lineHeight: 1.5 }}
          >
            {t('editor.variant_modal.intro')}
          </p>
          <label
            className="mb-1.5 block font-medium uppercase text-text-muted"
            style={{ fontSize: 11, letterSpacing: '0.1em' }}
          >
            {t('editor.variant_modal.name_label')}
          </label>
          <input
            ref={(el) => el?.focus()}
            defaultValue={t('editor.variant_modal.default_name')}
            aria-label={t('editor.variant_modal.name_label')}
            className="block h-9 w-full rounded-md border border-border-subtle bg-bg-input px-3 text-[13px] text-text-primary outline-none"
          />
          <div className="mt-2.5 text-[11.5px] text-text-muted">
            {t('editor.variant_modal.hint')}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border-subtle px-5 py-3">
          <Button variant="secondary" onClick={onClose}>
            {tCommon('actions.cancel')}
          </Button>
          <Button variant="primary" onClick={onClose}>
            {t('editor.variant_modal.create')}
          </Button>
        </div>
      </div>
    </>
  );
}
