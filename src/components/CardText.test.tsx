import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { CardText } from './CardText';

describe('CardText', () => {
  it('renders plain text as-is', () => {
    render(<CardText text="Deal 4 damage to target hero." />);
    expect(screen.getByText('Deal 4 damage to target hero.')).toBeInTheDocument();
  });

  it('wraps **bold** segments in <strong>', () => {
    render(<CardText text="Whenever you play a card with **contract**, you may look." />);
    const strong = screen.getByText('contract');
    expect(strong.tagName).toBe('STRONG');
    // Surrounding text remains as text nodes within the same flow.
    expect(strong.parentElement).toHaveTextContent(
      'Whenever you play a card with contract, you may look.',
    );
  });

  it('handles multiple bold spans in one string', () => {
    render(<CardText text="**Go again** if you have **earth**." />);
    const matches = screen.getAllByText((_, el) => el?.tagName === 'STRONG');
    expect(matches.map((m) => m.textContent)).toEqual(['Go again', 'earth']);
  });

  it('does not interpret a stray single asterisk as markdown', () => {
    render(<CardText text="Cost is *not* a stat. Star: *." />);
    expect(screen.queryByText('not')).not.toBeInTheDocument();
    expect(screen.getByText('Cost is *not* a stat. Star: *.')).toBeInTheDocument();
  });

  it('renders nothing for an empty / whitespace-only string', () => {
    const { container } = render(<CardText text="   " />);
    expect(container.firstChild).toBeNull();
  });
});
