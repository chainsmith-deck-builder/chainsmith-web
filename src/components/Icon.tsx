import { IconSvg, type IconProps } from './IconBase';

// Line icons in a single module so consumers import { Icon } and pick one.
// Stroke 1.7 / 1.8 to match the prototype. Icons are decorative by default
// (aria-hidden via IconSvg); icon-only buttons must carry their own aria-label
// per .claude/rules/accessibility.md.

export const Icon = {
  search: (props: IconProps) => (
    <IconSvg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconSvg>
  ),
  plus: (props: IconProps) => (
    <IconSvg strokeWidth={1.8} {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconSvg>
  ),
  minus: (props: IconProps) => (
    <IconSvg strokeWidth={1.8} {...props}>
      <path d="M5 12h14" />
    </IconSvg>
  ),
  chevron: (props: IconProps) => (
    <IconSvg size={12} strokeWidth={1.8} {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconSvg>
  ),
  chevronLeft: (props: IconProps) => (
    <IconSvg strokeWidth={1.8} {...props}>
      <path d="m15 18-6-6 6-6" />
    </IconSvg>
  ),
  chevronRight: (props: IconProps) => (
    <IconSvg strokeWidth={1.8} {...props}>
      <path d="m9 18 6-6-6-6" />
    </IconSvg>
  ),
  x: (props: IconProps) => (
    <IconSvg strokeWidth={1.8} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </IconSvg>
  ),
  grid: (props: IconProps) => (
    <IconSvg {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </IconSvg>
  ),
  list: (props: IconProps) => (
    <IconSvg {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </IconSvg>
  ),
  share: (props: IconProps) => (
    <IconSvg {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </IconSvg>
  ),
  download: (props: IconProps) => (
    <IconSvg {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </IconSvg>
  ),
  arrowLeft: (props: IconProps) => (
    <IconSvg {...props}>
      <path d="m12 19-7-7 7-7M19 12H5" />
    </IconSvg>
  ),
  more: (props: IconProps) => (
    <IconSvg strokeWidth={1.8} {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </IconSvg>
  ),
  user: (props: IconProps) => (
    <IconSvg {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconSvg>
  ),
  filter: (props: IconProps) => (
    <IconSvg {...props}>
      <path d="M3 6h18M7 12h10M10 18h4" />
    </IconSvg>
  ),
  alert: (props: IconProps) => (
    <IconSvg {...props}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </IconSvg>
  ),
  check: (props: IconProps) => (
    <IconSvg strokeWidth={1.8} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </IconSvg>
  ),
  lock: (props: IconProps) => (
    <IconSvg size={12} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </IconSvg>
  ),
  link: (props: IconProps) => (
    <IconSvg size={12} {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </IconSvg>
  ),
  globe: (props: IconProps) => (
    <IconSvg size={12} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
    </IconSvg>
  ),
  copy: (props: IconProps) => (
    <IconSvg {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </IconSvg>
  ),
  google: (props: IconProps) => (
    <svg viewBox="0 0 24 24" width={props.size ?? 14} height={props.size ?? 14} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4-5.5 4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.3 14.5 2.4 12 2.4 6.5 2.4 2 6.9 2 12.4S6.5 22.4 12 22.4c6.9 0 11.5-4.8 11.5-11.7 0-.8-.1-1.4-.2-2H12Z"
      />
    </svg>
  ),
  discord: (props: IconProps) => (
    <svg viewBox="0 0 24 24" width={props.size ?? 14} height={props.size ?? 14} aria-hidden="true">
      <path
        fill="#5865F2"
        d="M19.3 5.3a17 17 0 0 0-4.2-1.3l-.2.4c1.5.4 2.9 1 4.1 1.7a14.5 14.5 0 0 0-13.4 0c1.2-.7 2.6-1.3 4.1-1.7l-.2-.4a16.6 16.6 0 0 0-4.2 1.3C2.5 9.3 1.7 13.2 2 17a17 17 0 0 0 5.2 2.6l.4-.6c-.9-.3-1.8-.8-2.6-1.4l.6-.4a12.6 12.6 0 0 0 12.8 0l.6.4c-.8.6-1.7 1-2.6 1.4l.4.6A17 17 0 0 0 22 17c.5-4.2-.6-8-2.7-11.7ZM8.5 14.6c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"
      />
    </svg>
  ),
};
