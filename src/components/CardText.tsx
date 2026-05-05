import { Fragment, type ReactNode } from 'react';

type Props = {
  /** Raw rules / flavor text from the backend, in upstream FaB-cube format. */
  text: string;
};

// Render upstream FaB card text as React nodes. The dataset uses markdown
// bold (`**foo**`) to emphasize keywords (e.g. "Whenever you play a card
// with **contract**…"); rendering raw shows the literal asterisks.
//
// Per .claude/rules/security.md this never builds an HTML string — output
// is ReactNode[] so React escapes everything else by default. FaB-specific
// inline symbols (resource icons `{r}`, pitch pips `[1]`, +1 counters
// `+1{p}`) aren't handled here yet; that's a separate symbol-replacer
// when we standardize the icon set.
export function CardText({ text }: Props): ReactNode {
  if (text.trim().length === 0) return null;
  // Split on `**foo**` and rebuild as an alternating sequence: even
  // indices are plain text, odd indices are bold matches.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        // Index-as-key is acceptable here: the parts array is derived
        // from a single immutable text input — it's static for this
        // render and never reordered (per .claude/rules/react.md).
        if (i % 2 === 1) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
