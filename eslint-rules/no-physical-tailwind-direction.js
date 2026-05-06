/**
 * Bans physical-direction Tailwind utilities (`ml-`, `mr-`, `pl-`, `pr-`,
 * `left-`, `right-`, `border-l-`, `border-r-`, `rounded-l/r/tl/tr/bl/br-`)
 * in favor of logical equivalents (`ms-`, `me-`, `ps-`, `pe-`, `start-`,
 * `end-`, `border-s-`, `border-e-`, `rounded-s/e/ss/se/es/ee-`). This pays
 * the styling debt for RTL up front; see .claude/rules/css.md.
 *
 * Scans string literals and template-literal quasis. Variant prefixes like
 * `hover:`, `md:`, `motion-safe:`, `dark:` are accepted before the utility.
 */

const PHYSICAL = String.raw`(?<![\w-])(?:[a-z][\w-]*:)*(?:ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)-(?:\d|\[|px\b|auto\b|full\b)`;
const PHYSICAL_RE = new RegExp(PHYSICAL);

const SUGGESTIONS = {
  ml: 'ms',
  mr: 'me',
  pl: 'ps',
  pr: 'pe',
  left: 'start',
  right: 'end',
  'border-l': 'border-s',
  'border-r': 'border-e',
  'rounded-l': 'rounded-s',
  'rounded-r': 'rounded-e',
  'rounded-tl': 'rounded-ss',
  'rounded-tr': 'rounded-se',
  'rounded-bl': 'rounded-es',
  'rounded-br': 'rounded-ee',
};

function findHit(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(PHYSICAL_RE);
  if (!match) return null;
  const utility = match[0].split(':').pop().split('-').slice(0, -1).join('-');
  return { match: match[0], utility, replacement: SUGGESTIONS[utility] };
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid physical-direction Tailwind utilities; use logical (ms/me/ps/pe/start/end) instead.',
    },
    schema: [],
    messages: {
      physical:
        "Use logical Tailwind utilities ('{{replacement}}-' instead of '{{utility}}-'). Found '{{match}}'. See .claude/rules/css.md.",
    },
  },
  create(context) {
    return {
      Literal(node) {
        const hit = findHit(node.value);
        if (hit && hit.replacement) {
          context.report({ node, messageId: 'physical', data: hit });
        }
      },
      TemplateElement(node) {
        const hit = findHit(node.value && node.value.cooked);
        if (hit && hit.replacement) {
          context.report({ node, messageId: 'physical', data: hit });
        }
      },
    };
  },
};
