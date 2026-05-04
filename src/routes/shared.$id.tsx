import { createFileRoute } from '@tanstack/react-router';
import { SharedDeckScreen } from '../features/shared-deck/SharedDeckScreen';

export const Route = createFileRoute('/shared/$id')({
  component: SharedDeckScreen,
});
