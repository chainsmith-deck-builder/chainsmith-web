// UI-facing format adapter. Per .claude/rules/fab-domain.md, the deck builder
// surfaces three formats (Classic Constructed, Blitz, Commoner). The backend
// `FormatId` enum has more (silver_age, living_legend, ultimate_pit_fight)
// that we deliberately do not expose.

import type { FormatStatus, LegalitySummary } from './types';

export const UI_FORMATS = ['classic_constructed', 'blitz', 'commoner'] as const;
export type UiFormatId = (typeof UI_FORMATS)[number];

export type UiFormatI18nKey =
  | 'format.classic_constructed'
  | 'format.blitz'
  | 'format.commoner';

export function formatI18nKey(format: UiFormatId): UiFormatI18nKey {
  switch (format) {
    case 'classic_constructed':
      return 'format.classic_constructed';
    case 'blitz':
      return 'format.blitz';
    case 'commoner':
      return 'format.commoner';
  }
}

export function legalityFor(summary: LegalitySummary, format: UiFormatId): FormatStatus {
  switch (format) {
    case 'classic_constructed':
      return summary.cc;
    case 'blitz':
      return summary.blitz;
    case 'commoner':
      return summary.commoner;
  }
}

export function isLegalIn(summary: LegalitySummary, format: UiFormatId): boolean {
  return legalityFor(summary, format) === 'legal';
}

// Three-state collapse of FormatStatus tailored to the hero picker. The
// builder cares about three buckets:
//   - `legal` — selectable in this format
//   - `retired` — was legal in this format, retired to Living Legend
//   - `ineligible` — never legal here (banned, suspended, not_eligible, …)
// Commoner has no Living Legend rotation, so `retired` only ever lights up
// for CC and Blitz.
export type PresentationStatus = 'legal' | 'retired' | 'ineligible';

export function presentationStatusFor(
  summary: LegalitySummary,
  format: UiFormatId,
): PresentationStatus {
  const status = legalityFor(summary, format);
  if (status === 'legal') return 'legal';
  if (status === 'living_legend_retired') return 'retired';
  return 'ineligible';
}
