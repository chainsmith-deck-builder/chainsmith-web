import type { Hero } from './types';

// Sample heroes used across the design prototype. Real hero data will come
// from the backend's catalog endpoint once it lands; until then this matches
// the cast of characters in the design brief example ("Blazing Aether" for
// Iyslander, mixed Young/adult heroes across formats).

export const HEROES: Readonly<Record<string, Hero>> = {
  iyslander: {
    id: 'iyslander',
    name: 'Iyslander, Stormbind',
    cls: 'Wizard',
    talents: ['Ice'],
    life: 18,
    intellect: 4,
    initial: 'I',
    hue: 218,
    formats: ['Blitz'],
  },
  prism: {
    id: 'prism',
    name: 'Prism',
    cls: 'Illusionist',
    talents: ['Light'],
    life: 20,
    intellect: 4,
    initial: 'P',
    hue: 48,
    formats: ['Classic Constructed', 'Blitz'],
  },
  bravo: {
    id: 'bravo',
    name: 'Bravo, Showstopper',
    cls: 'Guardian',
    talents: [],
    life: 20,
    intellect: 4,
    initial: 'B',
    hue: 142,
    formats: ['Blitz'],
  },
  briar: {
    id: 'briar',
    name: 'Briar, Warden of Thorns',
    cls: 'Runeblade',
    talents: ['Earth'],
    life: 38,
    intellect: 4,
    initial: 'B',
    hue: 320,
    formats: ['Classic Constructed'],
  },
  katsu: {
    id: 'katsu',
    name: 'Katsu, the Wanderer',
    cls: 'Ninja',
    talents: [],
    life: 35,
    intellect: 4,
    initial: 'K',
    hue: 12,
    formats: ['Classic Constructed', 'Blitz', 'Commoner'],
  },
  dorinthea: {
    id: 'dorinthea',
    name: 'Dorinthea Ironsong',
    cls: 'Warrior',
    talents: [],
    life: 38,
    intellect: 4,
    initial: 'D',
    hue: 200,
    formats: ['Classic Constructed', 'Blitz'],
  },
  data: {
    id: 'data',
    name: 'Data Doll MKII',
    cls: 'Mechanologist',
    talents: [],
    life: 20,
    intellect: 4,
    initial: 'D',
    hue: 168,
    formats: ['Blitz'],
  },
  oldhim: {
    id: 'oldhim',
    name: 'Oldhim, Grandfather of Eternity',
    cls: 'Guardian',
    talents: ['Earth', 'Ice'],
    life: 40,
    intellect: 4,
    initial: 'O',
    hue: 195,
    formats: ['Classic Constructed'],
  },
};

export function getHero(id: string): Hero {
  const hero = HEROES[id];
  if (!hero) {
    const fallback = HEROES['iyslander'];
    if (!fallback) {
      throw new Error('Hero fixture is missing');
    }
    return fallback;
  }
  return hero;
}
