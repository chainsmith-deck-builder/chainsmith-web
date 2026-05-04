import { Icon } from '../../components/Icon';

type Props = {
  label: string;
  value: string;
  readOnly?: boolean;
  select?: boolean;
};

export function Field({ label, value, readOnly = false, select = false }: Props) {
  return (
    <div className="mb-3">
      <label
        className="mb-1.5 block font-medium uppercase text-text-muted"
        style={{ fontSize: 11.5, letterSpacing: '0.1em' }}
      >
        {label}
      </label>
      <div
        className="flex h-9 items-center rounded-md border border-border-subtle px-3 text-[13px]"
        style={{
          background: readOnly ? 'transparent' : 'var(--bg-input)',
          color: readOnly ? 'var(--text-muted)' : 'var(--text-primary)',
        }}
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
