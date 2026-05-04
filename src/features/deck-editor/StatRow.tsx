type Props = {
  label: string;
  value: string;
  accent?: string;
};

export function StatRow({ label, value, accent }: Props) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-[11.5px] text-text-secondary">{label}</span>
      <span
        className="font-mono text-[12.5px] font-medium"
        style={{ color: accent ?? 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  );
}
