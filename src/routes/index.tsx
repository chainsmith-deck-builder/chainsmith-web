import { createFileRoute } from '@tanstack/react-router';
import { DeckListScreen } from '../features/deck-list/DeckListScreen';

export const Route = createFileRoute('/')({
  component: DeckListScreen,
});
