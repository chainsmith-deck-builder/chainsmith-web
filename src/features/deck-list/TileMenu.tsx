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
    <div
      className="absolute right-0 top-7 z-30 min-w-[150px] rounded-md border border-border-default bg-bg-overlay p-1"
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }}
    >
      {items.map((it, i) => (
        <button
          key={it.key}
          type="button"
          onClick={onClose}
          className="block w-full rounded-sm px-2.5 py-1.5 text-left text-[12.5px] hover:bg-bg-elevated"
          style={{
            color: it.danger ? 'var(--state-danger)' : 'var(--text-primary)',
            borderTop: i === items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            marginTop: i === items.length - 1 ? 4 : 0,
            paddingTop: i === items.length - 1 ? 9 : 7,
          }}
        >
          {t(`list.tile.${it.key}`)}
        </button>
      ))}
    </div>
  );
}
