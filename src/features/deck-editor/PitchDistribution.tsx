import { useTranslation } from 'react-i18next';
import { PitchDot } from '../../components/PitchDot';

type Props = {
  data: { p1: number; p2: number; p3: number };
};

export function PitchDistribution({ data }: Props) {
  const total = data.p1 + data.p2 + data.p3;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-bg-elevated">
        <div style={{ width: `${pct(data.p1)}%`, background: 'var(--viz-pitch-1)' }} />
        <div style={{ width: `${pct(data.p2)}%`, background: 'var(--viz-pitch-2)' }} />
        <div style={{ width: `${pct(data.p3)}%`, background: 'var(--viz-pitch-3)' }} />
      </div>
      <div className="flex justify-between text-[11px]">
        <DistEntry pitch={1} count={data.p1} pct={pct(data.p1)} />
        <DistEntry pitch={2} count={data.p2} pct={pct(data.p2)} />
        <DistEntry pitch={3} count={data.p3} pct={pct(data.p3)} />
      </div>
    </div>
  );
}

function DistEntry({ pitch, count, pct }: { pitch: 1 | 2 | 3; count: number; pct: number }) {
  const { t } = useTranslation('deck');
  return (
    <span className="inline-flex items-center gap-1.5">
      <PitchDot pitch={pitch} size={6} />
      <span className="font-mono">{count}</span>
      <span className="text-text-faint">{t('editor.analytics.pct_paren', { pct })}</span>
    </span>
  );
}
