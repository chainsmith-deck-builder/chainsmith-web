import { createFileRoute } from '@tanstack/react-router';
import { HeroSelectScreen } from '../features/hero-select/HeroSelectScreen';

export const Route = createFileRoute('/decks/new')({
  component: HeroSelectScreen,
});
