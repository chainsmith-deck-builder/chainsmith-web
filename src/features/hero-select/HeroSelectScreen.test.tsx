import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import type { FC } from 'react';

import { server } from '../../test/msw/server';
import { apiUrl } from '../../test/msw/handlers';
import { makeHero, makeLegality } from '../../test/fixtures/heroes';
import type { Hero } from '../../api/types';
import { HeroSelectScreen } from './HeroSelectScreen';

function renderScreen(Screen: FC = HeroSelectScreen) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Screen,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

const wizardOnlyCC: Hero = makeHero({
  id: 'iyslander',
  name: 'Iyslander, Stormbind',
  classes: ['wizard'],
  talents: ['ice'],
  life: 18,
  legalitySummary: makeLegality({ blitz: 'not_eligible', commoner: 'not_eligible' }),
});

const guardianAllFormats: Hero = makeHero({
  id: 'bravo-star',
  name: 'Bravo, Star of the Show',
  classes: ['guardian'],
  talents: [],
  life: 20,
});

const ccRetired: Hero = makeHero({
  id: 'oldhim',
  name: 'Oldhim, Grandfather of Eternity',
  classes: ['guardian'],
  talents: ['earth', 'ice'],
  life: 40,
  legalitySummary: makeLegality({
    cc: 'living_legend_retired',
    blitz: 'not_eligible',
    commoner: 'not_eligible',
    livingLegend: 'legal',
  }),
});

describe('HeroSelectScreen', () => {
  it('shows a loading status while heroes are fetching', async () => {
    server.use(
      http.get(apiUrl('/heroes'), async () => {
        await new Promise(() => {
          // never resolves — keeps the query pending
        });
        return HttpResponse.json({ items: [] });
      }),
    );
    renderScreen();
    expect(await screen.findByRole('status')).toHaveTextContent(/loading/i);
  });

  it('renders eligible and ineligible heroes split by format legality', async () => {
    server.use(
      http.get(apiUrl('/heroes'), () =>
        HttpResponse.json({ items: [wizardOnlyCC, guardianAllFormats] }),
      ),
    );
    renderScreen();

    expect(await screen.findByRole('button', { name: 'Iyslander, Stormbind' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Bravo, Star of the Show' })).toBeEnabled();

    // Switch to Blitz: Iyslander becomes ineligible, Bravo stays legal,
    // and the ineligible-section heading announces the active format.
    await userEvent.click(screen.getByRole('button', { name: 'Blitz' }));
    expect(screen.getByRole('button', { name: 'Iyslander, Stormbind' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Bravo, Star of the Show' })).toBeEnabled();
    expect(screen.getAllByText(/not legal in blitz/i).length).toBeGreaterThan(0);
  });

  it('shows an alert with retry when the request fails', async () => {
    let callCount = 0;
    server.use(
      http.get(apiUrl('/heroes'), () => {
        callCount += 1;
        if (callCount === 1) {
          return new HttpResponse('boom', { status: 500 });
        }
        return HttpResponse.json({ items: [guardianAllFormats] });
      }),
    );
    renderScreen();

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't load/i);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Bravo, Star of the Show' })).toBeInTheDocument(),
    );
  });

  it('selects a hero on click and announces it via aria-pressed', async () => {
    // The original assertion read tile.style.borderColor for the picked state.
    // After moving the conditional border from inline style to a Tailwind
    // utility class, that style read is empty. The picked state is now
    // exposed to assistive tech via aria-pressed (eligible heroes only),
    // which is what we assert against.
    server.use(
      http.get(apiUrl('/heroes'), () =>
        HttpResponse.json({ items: [guardianAllFormats] }),
      ),
    );
    renderScreen();

    const tile = await screen.findByRole('button', { name: 'Bravo, Star of the Show' });
    expect(tile).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(tile);
    expect(tile).toHaveAttribute('aria-pressed', 'true');
  });

  it('groups Living-Legend-retired heroes under their own heading', async () => {
    server.use(
      http.get(apiUrl('/heroes'), () =>
        HttpResponse.json({ items: [guardianAllFormats, ccRetired] }),
      ),
    );
    renderScreen();

    // Bravo is CC-legal; Oldhim is retired to LL → disabled, badge says retired.
    expect(await screen.findByRole('button', { name: 'Bravo, Star of the Show' })).toBeEnabled();
    const oldhimTile = screen.getByRole('button', {
      name: 'Oldhim, Grandfather of Eternity',
    });
    expect(oldhimTile).toBeDisabled();
    expect(screen.getByText(/retired to living legend/i)).toBeInTheDocument();
    // Section heading is distinct from the generic "Not legal in X" heading.
    expect(screen.queryByText(/not legal in classic constructed/i)).not.toBeInTheDocument();
  });

  it('does not select an ineligible hero when clicked', async () => {
    // Original asserted on tile.style.borderColor; that's no longer
    // populated since the border color is a utility class. Ineligible
    // tiles are also disabled and intentionally have no aria-pressed
    // (the picked state is meaningless for a non-clickable tile), so
    // we assert that here.
    server.use(
      http.get(apiUrl('/heroes'), () =>
        HttpResponse.json({ items: [wizardOnlyCC, guardianAllFormats] }),
      ),
    );
    renderScreen();

    await userEvent.click(await screen.findByRole('button', { name: 'Blitz' }));

    const lockedTile = screen.getByRole('button', { name: 'Iyslander, Stormbind' });
    expect(lockedTile).toBeDisabled();
    await userEvent.click(lockedTile);
    expect(lockedTile).not.toHaveAttribute('aria-pressed');
  });
});

