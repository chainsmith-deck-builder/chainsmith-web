import { useTranslation } from 'react-i18next';
import { HeroBlock } from '../../components/HeroBlock';

export function EmptyDeckSidebar() {
  const { t } = useTranslation('deck');
  return (
    <aside
      className="flex flex-shrink-0 flex-col border-s border-border-subtle bg-bg-base"
      style={{ width: 360 }}
    >
      <div className="border-b border-border-subtle px-4 pb-3 pt-3.5">
        <HeroBlock heroId="iyslander" compact />
      </div>
      <div className="flex flex-1 items-center justify-center p-6 text-center">
        <div>
          <div className="mb-1 text-[13.5px] font-medium text-text-secondary">
            {t('editor.empty.heading')}
          </div>
          <div
            className="mx-auto max-w-[220px] text-[11.5px] text-text-muted"
            style={{ lineHeight: 1.5 }}
          >
            {t('editor.empty.body')}
          </div>
        </div>
      </div>
    </aside>
  );
}
