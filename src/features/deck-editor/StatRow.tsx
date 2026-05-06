type Props = {
  label: string;
  value: string;
  accent?: string;
};

export function StatRow({ label, value, accent }: Props) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-tiny text-text-secondary">{label}</span>
      <span
        className="font-mono text-xs font-medium text-text-primary"
        // eslint-disable-next-line react/forbid-dom-props -- caller-provided accent overrides the default token color
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
