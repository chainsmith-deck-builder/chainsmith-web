import type { DeckEntry, DeckSummary, EquipmentLoadout } from './types';

// A complete demo deck (60 main + equipment) for Iyslander, used to populate
// the editor and shared-deck screens. Pitch totals: 16 / 16 / 9.
export const DEMO_DECK: readonly DeckEntry[] = [
  { id: 'blazing-aether-r', qty: 3 },
  { id: 'channel-lake-frigid-r', qty: 3 },
  { id: 'sigil-of-solace-r', qty: 2 },
  { id: 'icy-encounter-r', qty: 3 },
  { id: 'waning-moon-r', qty: 2 },
  { id: 'voltaire-strikes-r', qty: 3 },
  { id: 'blazing-aether-y', qty: 3 },
  { id: 'channel-lake-frigid-y', qty: 3 },
  { id: 'frostbite-y', qty: 3 },
  { id: 'icy-encounter-y', qty: 3 },
  { id: 'tome-of-aetherwind-y', qty: 2 },
  { id: 'sigil-of-solace-y', qty: 2 },
  { id: 'blazing-aether-b', qty: 3 },
  { id: 'frost-hex-b', qty: 3 },
  { id: 'channel-mount-heroic-b', qty: 3 },
];

export const DEMO_EQUIPMENT: EquipmentLoadout = {
  head: 'frostbite-headwear-r',
  chest: null,
  arms: 'aether-icevein-b',
  legs: 'snapdragon-scalers-y',
  mainHand: null,
  offHand: 'rime-blade-b',
};

export const DEMO_DECKS: readonly DeckSummary[] = [
  {
    id: 'd1',
    name: 'Stormbind Frostlock',
    heroId: 'iyslander',
    format: 'Classic Constructed',
    count: '60/60',
    editedRelative: '2 hours ago',
    valid: true,
    visibility: 'private',
  },
  {
    id: 'd2',
    name: 'Briar Aggro v3',
    heroId: 'briar',
    format: 'Classic Constructed',
    count: '60/60',
    editedRelative: 'Yesterday',
    valid: true,
    visibility: 'unlisted',
  },
  {
    id: 'd3',
    name: 'Prism Spectral Tide',
    heroId: 'prism',
    format: 'Classic Constructed',
    count: '54/60',
    editedRelative: '3 days ago',
    valid: false,
    visibility: 'private',
  },
  {
    id: 'd4',
    name: 'Bravo Mountain',
    heroId: 'bravo',
    format: 'Blitz',
    count: '40/40',
    editedRelative: 'Last week',
    valid: true,
    visibility: 'public',
  },
  {
    id: 'd5',
    name: 'Katsu Pivot',
    heroId: 'katsu',
    format: 'Classic Constructed',
    count: '60/60',
    editedRelative: '2 weeks ago',
    valid: true,
    visibility: 'private',
  },
  {
    id: 'd6',
    name: 'Data Doll Boomtown',
    heroId: 'data',
    format: 'Blitz',
    count: '40/40',
    editedRelative: '3 weeks ago',
    valid: true,
    visibility: 'private',
  },
];
