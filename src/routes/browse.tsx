import { createFileRoute } from '@tanstack/react-router';
import { BrowseCardsScreen } from '../features/browse/BrowseCardsScreen';

export const Route = createFileRoute('/browse')({
  component: BrowseCardsScreen,
});
