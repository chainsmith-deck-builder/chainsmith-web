import { useTranslation } from 'react-i18next';
import { Icon } from '../../components/Icon';

type Props = {
  remaining: number;
};

export function BottomActionBar({ remaining }: Props) {
  const { t } = useTranslation('deck');
  const { t: tCommon } = useTranslation('common');
  return (
    <div className="relative flex h-14 flex-shrink-0 items-center border-t border-border-subtle bg-bg-base px-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
        >
          {t('editor.empty.shortcut_help')}
          <span className="ms-1 rounded-sm bg-bg-elevated px-1 py-px font-mono text-[10px]">
            ?
          </span>
        </button>
      </div>
      <div className="absolute start-1/2 -translate-x-1/2">
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-subtle bg-bg-raised px-3 text-[13px] font-medium text-text-primary transition-colors duration-fast hover:bg-bg-overlay"
        >
          {t('editor.footer.load_more_remaining', { remaining: remaining.toLocaleString() })}
        </button>
      </div>
      <div className="ms-auto flex gap-2">
        <button
          type="button"
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
        >
          <Icon.copy /> {tCommon('actions.duplicate')}
        </button>
        <button
          type="button"
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] text-text-secondary transition-colors duration-fast hover:bg-bg-raised hover:text-text-primary"
        >
          <Icon.download /> {tCommon('actions.export')}
        </button>
      </div>
    </div>
  );
}
