import type { Pitch } from '../domain/types';

type Props = {
  pitch: Pitch;
  size?: number;
  /** Hide from AT — caller already labels the pitch elsewhere. Default: true. */
  decorative?: boolean;
};

// Color-only pitch indicator. Per .claude/rules/fab-domain.md, anywhere this
// renders the surrounding chrome must include a numeric or textual signal so
// pitch information is not conveyed by color alone.
export function PitchDot({ pitch, size = 10, decorative = true }: Props) {
  const labelProps = decorative
    ? { 'aria-hidden': true as const }
    : { 'aria-label': `Pitch ${pitch}` };
  return (
    <span
      data-pitch={pitch}
      className="cs-pitch-dot"
      style={{ width: size, height: size }}
      {...labelProps}
    />
  );
}
