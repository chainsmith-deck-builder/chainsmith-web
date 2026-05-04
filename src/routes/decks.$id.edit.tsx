import { createFileRoute } from '@tanstack/react-router';
import { DeckEditor, type EditorTweaks } from '../features/deck-editor/DeckEditor';

// The deck-editor tweak panel is a prototype-only affordance. The real
// editor will read its state from the deck-editor store + URL params.
const PROTOTYPE_TWEAKS: EditorTweaks = {
  theme: 'dark',
  grouping: 'pitch',
  validation: 'legal',
  variants: false,
  empty: false,
};

export const Route = createFileRoute('/decks/$id/edit')({
  component: () => <DeckEditor tweaks={PROTOTYPE_TWEAKS} />,
});
