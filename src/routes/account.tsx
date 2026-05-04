import { createFileRoute } from '@tanstack/react-router';
import { AccountScreen } from '../features/account/AccountScreen';

export const Route = createFileRoute('/account')({
  component: AccountScreen,
});
