import { getHero } from '../domain/heroes';

type Props = {
  heroId: string;
  size?: number;
};

// Procedural avatar — radial gradient keyed off the hero's hue with the first
// letter of the hero name in the center. Replace with a real portrait when the
// backend exposes one. The visual letter is decorative; the parent block carries
// the accessible name.
export function HeroAvatar({ heroId, size = 40 }: Props) {
  const hero = getHero(heroId);
  return (
    <div
      aria-hidden="true"
      className="flex flex-shrink-0 items-center justify-center rounded-full font-sans font-semibold text-[#F2EEE6]"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(60% 60% at 30% 25%, oklch(0.62 0.14 ${hero.hue}) 0%, oklch(0.32 0.10 ${hero.hue}) 60%, oklch(0.18 0.06 ${hero.hue}) 100%)`,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
        fontSize: size * 0.42,
        letterSpacing: '-0.02em',
      }}
    >
      {hero.initial}
    </div>
  );
}
