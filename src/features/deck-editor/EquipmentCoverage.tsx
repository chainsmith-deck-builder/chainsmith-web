import { useTranslation } from 'react-i18next';
import type { EquipmentLoadout, EquipmentSlotKey } from '../../domain/types';
import { Icon } from '../../components/Icon';

type Props = {
  slots: EquipmentLoadout;
};

const SLOT_KEYS: readonly EquipmentSlotKey[] = [
  'head',
  'chest',
  'arms',
  'legs',
  'mainHand',
  'offHand',
];

export function EquipmentCoverage({ slots }: Props) {
  const { t } = useTranslation('deck');
  const filled = SLOT_KEYS.filter((k) => slots[k] != null).length;
  const empty = SLOT_KEYS.length - filled;
  return (
    <div>
      <div
        className="mb-1.5 grid gap-1"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          aspectRatio: '3 / 2',
        }}
      >
        {SLOT_KEYS.map((k) => {
          const filled = slots[k] != null;
          return (
            <div
              key={k}
              title={t(`editor.slot.${slotLabelKey(k)}`)}
              className="flex items-center justify-center rounded-sm border text-[10px] font-semibold"
              style={{
                background: filled ? 'var(--accent-brand-soft)' : 'var(--bg-elevated)',
                borderColor: filled ? 'var(--accent-brand-dim)' : 'var(--border-subtle)',
                color: filled ? 'var(--accent-brand)' : 'var(--text-faint)',
              }}
            >
              {t(`editor.slot_short.${slotLabelKey(k)}`)}
            </div>
          );
        })}
      </div>
      {empty > 0 && (
        <div
          className="flex items-center gap-1 text-state-warning"
          style={{ fontSize: 10.5 }}
        >
          <Icon.alert size={12} />
          {empty} {empty > 1 ? 'slots empty' : 'slot empty'}
        </div>
      )}
    </div>
  );
}

function slotLabelKey(slot: EquipmentSlotKey): 'head' | 'chest' | 'arms' | 'legs' | 'main_hand' | 'off_hand' {
  if (slot === 'mainHand') return 'main_hand';
  if (slot === 'offHand') return 'off_hand';
  return slot;
}
