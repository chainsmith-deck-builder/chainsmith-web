import { describe, expect, it } from 'vitest';
import { clamp } from './clamp';

describe('clamp', () => {
  it('returns the value when it sits inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('returns the lower bound when the value falls below', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('returns the upper bound when the value goes above', () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it('returns the bound when the value sits exactly on it', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
