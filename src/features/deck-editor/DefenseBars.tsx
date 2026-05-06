import { useTranslation } from 'react-i18next';

type Props = {
  data: Readonly<Record<number, number>>;
};

export function DefenseBars({ data }: Props) {
  const { t } = useTranslation('deck');
  const values = Object.values(data);
  const max = values.length > 0 ? Math.max(...values) : 0;
  return (
    <div className="flex h-12 items-end gap-1.5 px-1">
      {[0, 1, 2, 3].map((d) => {
        const v = data[d] ?? 0;
        const h = max > 0 ? (v / max) * 100 : 0;
        return (
          <div key={d} className="flex flex-1 flex-col items-center gap-1">
            <span className="font-mono text-2xs text-text-muted">{v}</span>
            <div
              className="w-full rounded-sm bg-text-faint"
              // eslint-disable-next-line react/forbid-dom-props -- runtime-computed bar height percentage
              style={{ height: `${h}%`, minHeight: v > 0 ? 4 : 0 }}
            />
            <span className="text-2xs text-text-faint">
              {t('editor.analytics.slot_d_label', { n: d })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
