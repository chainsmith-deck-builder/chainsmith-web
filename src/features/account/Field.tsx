import { Icon } from '../../components/Icon';

type Props = {
  label: string;
  value: string;
  readOnly?: boolean;
  select?: boolean;
};

export function Field({ label, value, readOnly = false, select = false }: Props) {
  const valueTone = readOnly
    ? 'bg-transparent text-text-muted'
    : 'bg-bg-input text-text-primary';
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-tiny font-medium uppercase tracking-widest text-text-muted">
        {label}
      </label>
      <div
        className={`flex h-9 items-center rounded-md border border-border-subtle px-3 text-sm ${valueTone}`}
      >
        <span>{value}</span>
        {select && (
          <span aria-hidden="true" className="ms-auto text-text-muted">
            <Icon.chevron />
          </span>
        )}
      </div>
    </div>
  );
}
