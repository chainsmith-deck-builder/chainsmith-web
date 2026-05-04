// Domain types for the design prototype. Once the backend's openapi.json is
// pinned for these resources, replace these shapes with the generated types
// from src/api/schema.d.ts. Field names follow the FaB vocabulary in
// .claude/rules/fab-domain.md (hero, class, talent, pitch, equipment).

export type Pitch = 1 | 2 | 3;

export type Format = 'Classic Constructed' | 'Blitz' | 'Commoner';

export type EquipmentSlotKey = 'head' | 'chest' | 'arms' | 'legs' | 'mainHand' | 'offHand';

export type Hero = {
  readonly id: string;
  readonly name: string;
  readonly cls: string;
  readonly talents: readonly string[];
  readonly life: number;
  readonly intellect: number;
  readonly initial: string;
  // Hue used by the procedural avatar gradient. Replace with a real portrait
  // URL when the backend exposes one.
  readonly hue: number;
  readonly formats: readonly Format[];
};

export type CardType =
  | 'Wizard Action'
  | 'Wizard Attack'
  | 'Equipment'
  | 'Action'
  | 'Attack'
  | 'Reaction'
  | 'Instant';

export type Card = {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly pitch: Pitch;
  readonly cost: number | null;
  readonly type: CardType;
  readonly subtype: string | null;
  readonly power: number | null;
  readonly defense: number | null;
  readonly talent: string | null;
  readonly go: boolean;
};

export type DeckEntry = {
  readonly id: string;
  readonly qty: number;
};

export type EquipmentLoadout = Readonly<Record<EquipmentSlotKey, string | null>>;

export type DeckSummary = {
  readonly id: string;
  readonly name: string;
  readonly heroId: string;
  readonly format: Format;
  readonly count: string;
  readonly editedRelative: string;
  readonly valid: boolean;
  readonly visibility: 'private' | 'unlisted' | 'public';
};
