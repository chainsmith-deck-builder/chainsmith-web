import { useTranslation } from 'react-i18next';
import type { Card, EquipmentLoadout } from '../../domain/types';
import { CardArt } from '../../components/CardArt';
import { PitchDistribution } from './PitchDistribution';
import { StatRow } from './StatRow';
import { EquipmentCoverage } from './EquipmentCoverage';
import { DefenseBars } from './DefenseBars';

type Props = {
  previewCard: Card | null;
  validation: 'legal' | 'illegal';
  slots: EquipmentLoadout;
};

export function LeftSidebar({ previewCard, validation, slots }: Props) {
  const { t } = useTranslation('deck');
  return (
    <aside
      className="flex flex-shrink-0 flex-col gap-4 overflow-auto border-e border-border-subtle bg-bg-base p-4"
      style={{ width: 260 }}
    >
      {/* Preview slot */}
      <div>
        <SectionHead label={t('editor.preview.heading')} />
        {previewCard ? (
          <div>
            <div className="aspect-card overflow-hidden rounded-md">
              <CardArt card={previewCard} size="tile" />
            </div>
            <div className="mt-2.5">
              <div
                className="text-[13px] font-semibold text-text-primary"
                style={{ letterSpacing: '-0.005em' }}
              >
                {previewCard.name}
              </div>
              <div className="mt-0.5 text-[11px] text-text-muted">
                {previewCard.type}
                {previewCard.subtype ? ` · ${previewCard.subtype}` : ''}
              </div>
              <div className="mt-2 flex gap-2.5 text-[11.5px]">
                {previewCard.power != null && (
                  <span className="font-mono">
                    <span className="text-text-muted">{t('editor.preview.stat_pow')} </span>
                    {previewCard.power}
                  </span>
                )}
                {previewCard.defense != null && (
                  <span className="font-mono">
                    <span className="text-text-muted">{t('editor.preview.stat_def')} </span>
                    {previewCard.defense}
                  </span>
                )}
                {previewCard.cost != null && (
                  <span className="font-mono">
                    <span className="text-text-muted">{t('editor.preview.stat_cost')} </span>
                    {previewCard.cost}
                  </span>
                )}
              </div>
              {previewCard.go && (
                <div className="mt-2 text-[11px] text-text-secondary" style={{ lineHeight: 1.5 }}>
                  <em className="not-italic text-text-muted">{t('editor.preview.go_again')} </em>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="flex aspect-card items-center justify-center rounded-md border border-dashed border-border-default bg-bg-raised p-5 text-center text-[11.5px] text-text-muted"
          >
            {t('editor.preview.empty')}
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="flex flex-col gap-4">
        <SectionHead label={t('editor.analytics.heading')} />

        <div>
          <div className="mb-1.5 text-[11px] text-text-muted">
            {t('editor.analytics.pitch_distribution')}
          </div>
          <PitchDistribution data={{ p1: 16, p2: 16, p3: 9 }} />
        </div>

        <div className="border-t border-border-subtle pt-2.5">
          <StatRow label={t('editor.analytics.avg_pitch_value')} value="2.1" />
          <StatRow
            label={t('editor.analytics.net_resource')}
            value="+4"
            accent="var(--state-success)"
          />
          <StatRow label={t('editor.analytics.zero_cost_cards')} value="62%" />
          <StatRow label={t('editor.analytics.go_again_count')} value="14" />
        </div>

        <div className="border-t border-border-subtle pt-2.5">
          <div className="mb-2 text-[11px] text-text-muted">{t('editor.analytics.card_types')}</div>
          <div className="flex flex-col gap-1">
            <StatRow label={t('editor.analytics.type_action')} value="22" />
            <StatRow label={t('editor.analytics.type_attack_action')} value="18" />
            <StatRow label={t('editor.analytics.type_defense_reaction')} value="6" />
            <StatRow label={t('editor.analytics.type_instant')} value="3" />
            <StatRow label={t('editor.analytics.type_equipment')} value="5" />
          </div>
        </div>

        <div className="border-t border-border-subtle pt-2.5">
          <div className="mb-2 text-[11px] text-text-muted">
            {t('editor.analytics.equipment_slots')}
          </div>
          <EquipmentCoverage slots={slots} />
        </div>

        <div className="border-t border-border-subtle pt-2.5">
          <div className="mb-2 text-[11px] text-text-muted">
            {t('editor.analytics.defense_distribution')}
          </div>
          <DefenseBars data={{ 0: 5, 1: 8, 2: 18, 3: 10 }} />
        </div>
      </div>

      {validation === 'illegal' && <ViolationsList />}
    </aside>
  );
}

function SectionHead({ label, count }: { label: string; count?: number }) {
  return (
    <div
      className="mb-2 flex items-center gap-2 font-semibold uppercase text-text-muted"
      style={{ fontSize: 10.5, letterSpacing: '0.12em' }}
    >
      <span>{label}</span>
      {count != null && (
        <span className="ms-auto font-mono text-text-faint" style={{ letterSpacing: 0 }}>
          {count}
        </span>
      )}
    </div>
  );
}

function ViolationsList() {
  const { t } = useTranslation('deck');
  return (
    <div className="border-t border-border-subtle pt-3.5">
      <div
        className="mb-2 flex items-center gap-2 font-semibold uppercase text-state-danger"
        style={{ fontSize: 10.5, letterSpacing: '0.12em' }}
      >
        <span>{t('editor.violations.heading')}</span>
        <span className="ms-auto font-mono text-text-faint" style={{ letterSpacing: 0 }}>
          3
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          t('editor.violations.deck_short_count', { actual: 54, target: 60 }),
          t('editor.violations.card_not_in_talent', { card: 'Voltaire Strikes' }),
          t('editor.violations.equipment_slot_empty', { slot: 'chest' }),
        ].map((m) => (
          <button
            key={m}
            type="button"
            className="rounded-md border border-state-danger/30 bg-state-danger-soft px-2.5 py-1.5 text-start text-[11.5px] text-text-secondary"
            style={{ lineHeight: 1.35 }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
