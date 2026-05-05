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
import { makeCard } from '../../test/fixtures/cards';
import type { CardSummary } from '../../api/types';
import { BrowseCardsScreen } from './BrowseCardsScreen';

function renderScreen(Screen: FC = BrowseCardsScreen) {
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

const blazingAether: CardSummary = makeCard({
  id: 'blazing-aether',
  name: 'Blazing Aether',
  pitch: 1,
  cost: 0,
  defense: 2,
  classes: ['wizard'],
  talents: ['elemental'],
  types: ['action'],
});

const frostbite: CardSummary = makeCard({
  id: 'frostbite',
  name: 'Frostbite',
  pitch: 2,
  cost: 1,
  defense: 2,
  classes: ['wizard'],
  talents: ['ice'],
  types: ['action'],
});

const wanigMoon: CardSummary = makeCard({
  id: 'waning-moon',
  name: 'Waning Moon',
  pitch: 1,
  cost: 1,
  power: 4,
  defense: 3,
  classes: ['wizard'],
  talents: ['ice'],
  types: ['attack_action'],
});

describe('BrowseCardsScreen', () => {
  it('renders cards returned by the catalog endpoint', async () => {
    server.use(
      http.get(apiUrl('/cards'), () =>
        HttpResponse.json({ items: [blazingAether, frostbite], nextCursor: null }),
      ),
    );
    renderScreen();

    expect(await screen.findByRole('button', { name: 'Blazing Aether' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Frostbite' })).toBeInTheDocument();
    expect(screen.getByText(/2 cards/i)).toBeInTheDocument();
  });

  it('debounces the search input and re-queries with the typed text', async () => {
    let lastQuery: URLSearchParams | undefined;
    server.use(
      http.get(apiUrl('/cards'), ({ request }) => {
        lastQuery = new URL(request.url).searchParams;
        const text = lastQuery.get('text');
        const items = text === 'frost' ? [frostbite] : [blazingAether, frostbite, wanigMoon];
        return HttpResponse.json({ items, nextCursor: null });
      }),
    );
    renderScreen();

    await screen.findByRole('button', { name: 'Blazing Aether' });
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'frost');

    await waitFor(() => expect(lastQuery?.get('text')).toBe('frost'));
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Blazing Aether' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Frostbite' })).toBeInTheDocument();
    });
  });

  it('paginates with cursor: load more appends the next page', async () => {
    server.use(
      http.get(apiUrl('/cards'), ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');
        if (cursor === null) {
          return HttpResponse.json({ items: [blazingAether], nextCursor: 'p2' });
        }
        if (cursor === 'p2') {
          return HttpResponse.json({ items: [frostbite], nextCursor: null });
        }
        return new HttpResponse('unexpected cursor', { status: 500 });
      }),
    );
    renderScreen();

    expect(await screen.findByRole('button', { name: 'Blazing Aether' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /load more/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Frostbite' })).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: 'Blazing Aether' })).toBeInTheDocument();
    // Once the last page returns nextCursor: null the load-more button hides.
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('shows an alert with retry when the request fails', async () => {
    let calls = 0;
    server.use(
      http.get(apiUrl('/cards'), () => {
        calls += 1;
        if (calls === 1) return new HttpResponse('boom', { status: 500 });
        return HttpResponse.json({ items: [blazingAether], nextCursor: null });
      }),
    );
    renderScreen();

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't load/i);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Blazing Aether' })).toBeInTheDocument(),
    );
  });

  it('renders the empty state when the catalog returns no cards', async () => {
    server.use(
      http.get(apiUrl('/cards'), () => HttpResponse.json({ items: [], nextCursor: null })),
    );
    renderScreen();
    expect(await screen.findByText(/no cards match/i)).toBeInTheDocument();
  });

  it('passes selected class filters as a comma-separated query param', async () => {
    let lastQuery: URLSearchParams | undefined;
    server.use(
      http.get(apiUrl('/cards'), ({ request }) => {
        lastQuery = new URL(request.url).searchParams;
        const classes = lastQuery.get('classes');
        const items =
          classes === null || classes === ''
            ? [blazingAether, frostbite, wanigMoon]
            : [blazingAether, frostbite];
        return HttpResponse.json({ items, nextCursor: null });
      }),
    );
    renderScreen();
    await screen.findByRole('button', { name: 'Blazing Aether' });

    await userEvent.click(screen.getByRole('button', { name: 'Class' }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Wizard' }));

    await waitFor(() => expect(lastQuery?.get('classes')).toBe('wizard'));
    // The pill swaps to its active "Class · 1 selected" label.
    expect(
      await screen.findByRole('button', { name: /class · 1 selected/i }),
    ).toBeInTheDocument();
  });

  it('passes a selected pitch as a numeric query param and updates the pill', async () => {
    let lastQuery: URLSearchParams | undefined;
    server.use(
      http.get(apiUrl('/cards'), ({ request }) => {
        lastQuery = new URL(request.url).searchParams;
        return HttpResponse.json({ items: [blazingAether], nextCursor: null });
      }),
    );
    renderScreen();
    await screen.findByRole('button', { name: 'Blazing Aether' });

    await userEvent.click(screen.getByRole('button', { name: /pitch/i }));
    await userEvent.click(screen.getByRole('menuitemradio', { name: /pitch · 2/i }));

    await waitFor(() => expect(lastQuery?.get('pitch')).toBe('2'));
    expect(await screen.findByRole('button', { name: /pitch · 2/i })).toBeInTheDocument();
  });
});
