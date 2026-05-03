import { Outlet, createRootRoute } from '@tanstack/react-router';
import { SkipToContent } from '../components/SkipToContent';

export const Route = createRootRoute({
  component: RootLayout,
});

export function RootLayout() {
  return (
    <>
      <SkipToContent />
      <Outlet />
    </>
  );
}
