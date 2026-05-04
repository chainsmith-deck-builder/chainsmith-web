import { useTranslation } from 'react-i18next';
import type { Card, EquipmentSlotKey } from '../../domain/types';
import { CardArt } from '../../components/CardArt';
import { Icon } from '../../components/Icon';

type Props = {
  slot: EquipmentSlotKey;
  card: Card | null;
};

export function EquipmentSlot({ slot, card }: Props) {
  const { t } = useTranslation('deck');
  const label = slotLabel(slot, t);

  if (card) {
    return (
      <div className="relative aspect-card overflow-hidden rounded-md">
        <CardArt card={card} size="tile" />
        <span
          className="absolute bottom-1 start-1 rounded-sm bg-black/65 px-1.5 py-0.5 font-medium uppercase text-[#F2EEE6]"
          style={{ fontSize: 9, letterSpacing: '0.08em' }}
        >
          {label}
        </span>
      </div>
    );
  }
  return (
    <button
      type="button"
      aria-label={label}
      className="flex aspect-card flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border-default bg-transparent text-[10.5px] text-text-muted transition-colors duration-fast hover:bg-bg-overlay hover:text-text-secondary"
    >
      <Icon.plus />
      <span>{label}</span>
    </button>
  );
}

function slotLabel(slot: EquipmentSlotKey, t: ReturnType<typeof useTranslation<'deck'>>['t']): string {
  switch (slot) {
    case 'head':
      return t('editor.slot.head');
    case 'chest':
      return t('editor.slot.chest');
    case 'arms':
      return t('editor.slot.arms');
    case 'legs':
      return t('editor.slot.legs');
    case 'mainHand':
      return t('editor.slot.main_hand');
    case 'offHand':
      return t('editor.slot.off_hand');
  }
}
