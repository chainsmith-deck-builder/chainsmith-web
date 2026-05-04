import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card, DeckEntry, EquipmentLoadout } from '../../domain/types';
import { findCard } from '../../domain/cards';
import { DEMO_DECK, DEMO_EQUIPMENT } from '../../domain/decks';
import { TopChrome } from './TopChrome';
import { ValidationBanner } from './ValidationBanner';
import { LeftSidebar } from './LeftSidebar';
import { CenterColumn } from './CenterColumn';
import { RightSidebar } from './RightSidebar';
import { EmptyDeckSidebar } from './EmptyDeckSidebar';
import { BottomActionBar } from './BottomActionBar';
import { CardDrawer } from './CardDrawer';
import { VariantModal } from './VariantModal';

export type EditorTweaks = {
  /** Render dark or light surface tokens. The route shell sets this on <html>. */
  theme: 'dark' | 'light';
  /** Group deck list rows by pitch color or by card type. */
  grouping: 'pitch' | 'type';
  /** Whether the deck has validation errors. */
  validation: 'legal' | 'illegal';
  /** When true, render variant tabs and pool/loadout slices. */
  variants: boolean;
  /** When true, deck and equipment slots are empty (initial state). */
  empty: boolean;
};

type Props = {
  tweaks: EditorTweaks;
};

const EMPTY_LOADOUT: EquipmentLoadout = {
  head: null,
  chest: null,
  arms: null,
  legs: null,
  mainHand: null,
  offHand: null,
};

export function DeckEditor({ tweaks }: Props) {
  const { t } = useTranslation('deck');

  const [previewCard, setPreviewCard] = useState<Card | null>(() =>
    findCard('blazing-aether-r'),
  );
  const [focusedRow, setFocusedRow] = useState<string | null>(null);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [drawerCard, setDrawerCard] = useState<Card | null>(null);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Pool' | 'Main' | 'vs. Bravo'>('Main');

  const slots = tweaks.empty ? EMPTY_LOADOUT : DEMO_EQUIPMENT;
  const baseDeck = useMemo<readonly DeckEntry[]>(
    () => (tweaks.empty ? [] : DEMO_DECK),
    [tweaks.empty],
  );

  const poolDeck = baseDeck;
  const mainDeck = useMemo<readonly DeckEntry[]>(
    () => baseDeck.filter((d) => d.id !== 'voltaire-strikes-r'),
    [baseDeck],
  );
  const bravoDeck = useMemo<readonly DeckEntry[]>(
    () =>
      baseDeck
        .map((d) => {
          if (d.id === 'frost-hex-b') return { ...d, qty: Math.max(d.qty - 1, 0) };
          if (d.id === 'sigil-of-solace-r') return { ...d, qty: d.qty + 1 };
          if (d.id === 'voltaire-strikes-r') return { ...d, qty: 0 };
          return d;
        })
        .filter((d) => d.qty > 0),
    [baseDeck],
  );
  const loadoutDecks: Readonly<Record<string, readonly DeckEntry[]>> = {
    Main: mainDeck,
    'vs. Bravo': bravoDeck,
  };

  const activeDeck = tweaks.variants
    ? activeTab === 'Pool'
      ? poolDeck
      : (loadoutDecks[activeTab] ?? mainDeck)
    : baseDeck;

  const deckQtyById: Record<string, number> = {};
  for (const entry of activeDeck) {
    deckQtyById[entry.id] = entry.qty;
  }

  const totalNonEquip = (arr: readonly DeckEntry[]) =>
    arr.reduce((sum, d) => {
      const card = findCard(d.id);
      return card && card.type !== 'Equipment' ? sum + d.qty : sum;
    }, 0);
  const poolCount = totalNonEquip(poolDeck);
  const loadoutCount = totalNonEquip(activeTab === 'vs. Bravo' ? bravoDeck : mainDeck);

  const heroName = 'Iyslander';
  const deckTitle = tweaks.empty
    ? t('editor.title_untitled', { hero: heroName })
    : t('editor.title_default');

  return (
    <div
      data-theme={tweaks.theme}
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-bg-base text-text-primary"
    >
      <TopChrome
        deckTitle={deckTitle}
        validation={tweaks.validation}
        variants={tweaks.variants}
        activeTab={activeTab}
        poolCount={poolCount}
        loadoutCount={loadoutCount}
      />
      {tweaks.validation === 'illegal' && bannerOpen && (
        <ValidationBanner onDismiss={() => setBannerOpen(false)} count={3} />
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <LeftSidebar
          previewCard={previewCard}
          validation={tweaks.validation}
          slots={slots}
        />
        <CenterColumn
          deckQtyById={deckQtyById}
          onCardHover={setPreviewCard}
          onCardClick={setDrawerCard}
        />
        {tweaks.empty ? (
          <EmptyDeckSidebar />
        ) : (
          <RightSidebar
            deck={activeDeck}
            poolDeck={poolDeck}
            loadoutDecks={loadoutDecks}
            slots={slots}
            grouping={tweaks.grouping}
            variants={tweaks.variants}
            validation={tweaks.validation}
            focused={focusedRow}
            onHover={setPreviewCard}
            onSetFocused={setFocusedRow}
            onShowVariantModal={() => setVariantModalOpen(true)}
            activeTab={activeTab}
            onSetActiveTab={setActiveTab}
          />
        )}
      </div>

      <BottomActionBar remaining={1228} />

      {drawerCard && (
        <CardDrawer
          card={drawerCard}
          onClose={() => setDrawerCard(null)}
          showRemoveFromPool={
            tweaks.variants && drawerCard.id === 'voltaire-strikes-r'
          }
        />
      )}
      {variantModalOpen && <VariantModal onClose={() => setVariantModalOpen(false)} />}
    </div>
  );
}

