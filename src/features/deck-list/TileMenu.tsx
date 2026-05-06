import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export function TileMenu({ onClose }: Props) {
  const { t } = useTranslation('deck');
  const items: { key: 'open' | 'duplicate' | 'rename' | 'delete'; danger: boolean }[] = [
    { key: 'open', danger: false },
    { key: 'duplicate', danger: false },
    { key: 'rename', danger: false },
    { key: 'delete', danger: true },
  ];
  return (
    <div className="absolute end-0 top-7 z-30 min-w-40 rounded-md border border-border-default bg-bg-overlay p-1 shadow-dropdown">
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        const tone = it.danger ? 'text-state-danger' : 'text-text-primary';
        const separator = isLast ? 'mt-1 border-t border-border-subtle pt-2' : 'pt-1.5';
        return (
          <button
            key={it.key}
            type="button"
            onClick={onClose}
            className={`block w-full rounded-sm px-2.5 pb-1.5 text-start text-xs hover:bg-bg-elevated ${tone} ${separator}`}
          >
            {t(`list.tile.${it.key}`)}
          </button>
        );
      })}
    </div>
  );
}
