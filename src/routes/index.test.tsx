import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from './index';

describe('HomePage', () => {
  it('renders the welcome heading using a translated string', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /welcome to chainsmith/i }),
    ).toBeInTheDocument();
  });

  it('exposes a labelled main landmark for screen-reader navigation', () => {
    render(<HomePage />);
    expect(screen.getByRole('main', { name: /welcome page/i })).toBeInTheDocument();
  });

  it('renders one item per scaffold checklist entry', () => {
    render(<HomePage />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll('li')).toHaveLength(6);
  });
});
