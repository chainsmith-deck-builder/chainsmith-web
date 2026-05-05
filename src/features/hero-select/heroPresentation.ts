// Procedural avatar accents derived from a hero's name. The deck-builder
// design uses a colored gradient + the hero's first initial for the picker
// tile. Once the backend exposes hero portrait imagery via
// `defaultPrinting.imageUrl` and we have the rights to display it, the UI
// prefers the portrait and these helpers become a fallback.

export function heroInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : '?';
}

// Stable hue (0-359) derived from the hero name so two heroes with the same
// initial still get distinct gradients and the same hero gets the same hue
// across renders.
export function heroHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const positive = hash < 0 ? -hash : hash;
  return positive % 360;
}
