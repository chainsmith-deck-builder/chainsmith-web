import { useTranslation } from 'react-i18next';
import type { Card, DeckEntry, EquipmentLoadout, EquipmentSlotKey, Pitch } from '../../domain/types';
import { findCard } from '../../domain/cards';
import { HeroBlock } from '../../components/HeroBlock';
import { DeckRow } from '../../components/DeckRow';
import { PitchDot } from '../../components/PitchDot';
import { Icon } from '../../components/Icon';
import { EquipmentSlot } from './EquipmentSlot';

type VariantTab = 'Pool' | 'Main' | 'vs. Bravo';

type Props = {
  deck: readonly DeckEntry[];
  poolDeck: readonly DeckEntry[];
  loadoutDecks: Readonly<Record<string, readonly DeckEntry[]>>;
  slots: EquipmentLoadout;
  grouping: 'pitch' | 'type';
  variants: boolean;
  validation: 'legal' | 'illegal';
  focused: string | null;
  onHover: (card: Card) => void;
  onSetFocused: (id: string) => void;
  onShowVariantModal: () => void;
  activeTab: VariantTab;
  onSetActiveTab: (tab: VariantTab) => void;
};

const SLOT_KEYS: readonly EquipmentSlotKey[] = [
  'head',
  'chest',
  'arms',
  'legs',
  'mainHand',
  'offHand',
];

export function RightSidebar({
  deck,
  poolDeck,
  loadoutDecks,
  slots,
  grouping,
  variants,
  validation,
  focused,
  onHover,
  onSetFocused,
  onShowVariantModal,
  activeTab,
  onSetActiveTab,
}: Props) {
  const { t } = useTranslation('deck');

  const groups = computeGroups(deck, grouping);
  const totalCards = sumNonEquip(deck);
  const isPool = variants && activeTab === 'Pool';

  return (
    <aside className="flex w-sidebar-wide flex-shrink-0 flex-col overflow-hidden border-s border-border-subtle bg-bg-base">
      {/* Variant tabs */}
      {variants && (
        <div className="flex gap-0 border-b border-border-subtle bg-bg-base px-2 pt-2">
          {(['Pool', 'Main', 'vs. Bravo'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const tone = isActive
              ? 'border-accent-brand text-text-primary'
              : 'border-transparent text-text-muted';
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onSetActiveTab(tab)}
                aria-pressed={isActive}
                className={`-mb-px border-b-2 bg-transparent px-3 py-2 text-xs font-medium ${tone}`}
              >
                {tab === 'Pool'
                  ? t('editor.variant_tabs.pool')
                  : tab === 'Main'
                    ? t('editor.variant_tabs.main')
                    : t('editor.variant_tabs.vs_bravo')}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onShowVariantModal}
            aria-label={t('editor.variant_tabs.add_variant')}
            className="px-2.5 py-2 text-text-muted"
          >
            <Icon.plus />
          </button>
        </div>
      )}

      {/* Hero block */}
      <div className="border-b border-border-subtle px-4 pb-3 pt-3.5">
        <HeroBlock heroId="iyslander" compact />
      </div>

      <div className="flex-1 overflow-auto">
        {/* Equipment & Other */}
        <div className="px-4 pb-3.5 pt-3.5">
          <SectionHead
            label={t('editor.deck_panel.equipment')}
            count={t('editor.deck_panel.equipment_count', {
              filled: SLOT_KEYS.filter((k) => slots[k] != null).length,
              total: 6,
            })}
          />
          <div className="grid grid-cols-3 gap-2">
            {SLOT_KEYS.map((slot) => {
              const cardId = slots[slot];
              return (
                <EquipmentSlot
                  key={slot}
                  slot={slot}
                  card={cardId ? findCard(cardId) : null}
                />
              );
            })}
          </div>
        </div>

        {/* Deck section */}
        <div className="px-3 pb-4 pt-1">
          {isPool && (
            <PoolCapacityReadout
              poolDeck={poolDeck}
              loadoutDecks={loadoutDecks}
            />
          )}
          <div className="flex items-center px-1 pb-2">
            <div className="text-tiny font-semibold uppercase tracking-widest text-text-secondary">
              {isPool ? t('editor.deck_panel.pool') : t('editor.deck_panel.deck')}
              <span className="ms-1.5 font-mono tracking-normal text-text-muted">
                {t('editor.deck_panel.deck_capacity', {
                  n: totalCards,
                  cap: isPool ? 80 : 60,
                })}
              </span>
            </div>
            <div className="ms-auto flex gap-0.5 rounded-sm bg-bg-raised p-0.5">
              <GroupToggle active={grouping === 'pitch'}>
                {t('editor.deck_panel.group_pitch')}
              </GroupToggle>
              <GroupToggle active={grouping === 'type'}>
                {t('editor.deck_panel.group_type')}
              </GroupToggle>
            </div>
          </div>

          {Object.entries(groups).map(([groupName, rows]) => {
            if (rows.length === 0) return null;
            const totalQty = rows.reduce((s, r) => s + r.qty, 0);
            return (
              <div key={groupName} className="mb-2.5">
                <div className="flex items-center gap-2 px-2 pb-1 pt-1.5 text-2xs font-semibold uppercase tracking-label text-text-muted">
                  {grouping === 'pitch' && <PitchDotForGroup name={groupName} />}
                  {groupName}
                  <span className="ms-auto font-mono tracking-normal text-text-faint">
                    {totalQty}
                  </span>
                </div>
                <div>
                  {rows.map((entry, i) => {
                    const card = findCard(entry.id);
                    if (!card) return null;
                    const hasViolation =
                      validation === 'illegal' && card.name === 'Voltaire Strikes';
                    return (
                      <DeckRow
                        key={entry.id + i}
                        card={card}
                        qty={entry.qty}
                        focused={focused === entry.id}
                        hasViolation={hasViolation}
                        onHover={() => onHover(card)}
                        onSelect={() => onSetFocused(entry.id)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function GroupToggle({ active, children }: { active: boolean; children: React.ReactNode }) {
  const tone = active ? 'bg-bg-elevated text-text-primary' : 'bg-transparent text-text-muted';
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`rounded-sm px-1.5 py-0.5 text-2xs font-medium ${tone}`}
    >
      {children}
    </button>
  );
}

function PoolCapacityReadout({
  poolDeck,
  loadoutDecks,
}: {
  poolDeck: readonly DeckEntry[];
  loadoutDecks: Readonly<Record<string, readonly DeckEntry[]>>;
}) {
  const { t } = useTranslation('deck');
  const poolTotal = sumNonEquip(poolDeck);
  const mainTotal = sumNonEquip(loadoutDecks['Main'] ?? []);
  const bravoTotal = sumNonEquip(loadoutDecks['vs. Bravo'] ?? []);
  return (
    <div className="mx-1 mb-2.5 flex flex-wrap items-center gap-2 rounded-md border border-border-subtle bg-bg-raised px-2.5 py-2 text-tiny text-text-secondary">
      <span>
        <span className="font-mono font-semibold text-text-primary">{poolTotal}/80</span>{' '}
        <span className="text-text-muted">{t('editor.capacity.pool')}</span>
      </span>
      <span className="block h-0.5 w-0.5 rounded-full bg-text-faint" />
      <span>
        <span className="font-mono">{mainTotal}/60</span>{' '}
        <span className="text-text-muted">
          {t('editor.capacity.in_label', { label: t('editor.variant_tabs.main') })}
        </span>
      </span>
      <span className="block h-0.5 w-0.5 rounded-full bg-text-faint" />
      <span>
        <span className="font-mono">{bravoTotal}/60</span>{' '}
        <span className="text-text-muted">
          {t('editor.capacity.in_label', { label: t('editor.variant_tabs.vs_bravo') })}
        </span>
      </span>
    </div>
  );
}

function SectionHead({ label, count }: { label: string; count?: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 text-2xs font-semibold uppercase tracking-label text-text-muted">
      <span>{label}</span>
      {count && (
        <span className="ms-auto font-mono tracking-normal text-text-faint">{count}</span>
      )}
    </div>
  );
}

function PitchDotForGroup({ name }: { name: string }) {
  const match = name.match(/(\d+)/);
  if (!match) return null;
  const pitch = Number.parseInt(match[1] ?? '', 10);
  if (pitch !== 1 && pitch !== 2 && pitch !== 3) return null;
  return <PitchDot pitch={pitch as Pitch} size={6} />;
}

function sumNonEquip(deck: readonly DeckEntry[]): number {
  return deck.reduce((sum, entry) => {
    const card = findCard(entry.id);
    if (!card || card.type === 'Equipment') return sum;
    return sum + entry.qty;
  }, 0);
}

function computeGroups(
  deck: readonly DeckEntry[],
  grouping: 'pitch' | 'type',
): Record<string, readonly DeckEntry[]> {
  if (grouping === 'pitch') {
    return {
      'Pitch 1': deck.filter((d) => {
        const c = findCard(d.id);
        return c && c.pitch === 1 && c.type !== 'Equipment';
      }),
      'Pitch 2': deck.filter((d) => {
        const c = findCard(d.id);
        return c && c.pitch === 2 && c.type !== 'Equipment';
      }),
      'Pitch 3': deck.filter((d) => {
        const c = findCard(d.id);
        return c && c.pitch === 3 && c.type !== 'Equipment';
      }),
    };
  }
  return {
    Action: deck.filter((d) => findCard(d.id)?.type === 'Wizard Action'),
    'Attack action': deck.filter((d) => findCard(d.id)?.type === 'Wizard Attack'),
    Equipment: deck.filter((d) => findCard(d.id)?.type === 'Equipment'),
  };
}
