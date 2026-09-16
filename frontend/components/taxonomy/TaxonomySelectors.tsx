'use client';

import React from 'react';
import type { TaxonomyItem } from '@/lib/hooks/useTaxonomy';

interface Props {
  label?: string;
  items: TaxonomyItem[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  multiSelect?: boolean;
  selectedMulti?: string[];
  compact?: boolean;
}

const C = { rose: '#D98C95', gold: '#C8A46A', bg: '#FFF8F5', border: '#EFE8E4', text: '#262626', muted: '#8B8B8B' };

export function OccasionSelector({ label = 'Select Occasion', items, selected, onSelect, compact }: Props) {
  return (
    <div>
      {label && <p style={{ fontSize: '12px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{label}</p>}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        overflowX: compact ? 'auto' : 'visible',
        scrollbarWidth: 'none',
      }}>
        {items.map((item) => {
          const active = selected === item.slug;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(active ? null : item.slug)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: compact ? '7px 14px' : '10px 18px',
                borderRadius: '100px', border: `1.5px solid ${active ? C.rose : C.border}`,
                background: active ? '#FEF0F0' : 'white',
                color: active ? C.rose : C.text,
                fontSize: compact ? '12px' : '13px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.2s',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {item.emoji && <span>{item.emoji}</span>}
              {item.icon && !item.emoji && <span>{item.icon}</span>}
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function GiftTypeSelector({ label = 'Select Gift Type', items, selected, onSelect, multiSelect, selectedMulti = [], compact }: Props) {
  const isSelected = (slug: string) => multiSelect ? selectedMulti.includes(slug) : selected === slug;

  return (
    <div>
      {label && <p style={{ fontSize: '12px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{label}</p>}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        overflowX: compact ? 'auto' : 'visible',
      }}>
        {items.map((item) => {
          const active = isSelected(item.slug);
          return (
            <button
              key={item.id}
              onClick={() => {
                if (multiSelect) {
                  // This would need a separate handler — for simplicity fall through to single
                  onSelect(active ? null : item.slug);
                } else {
                  onSelect(active ? null : item.slug);
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: compact ? '7px 14px' : '10px 18px',
                borderRadius: '100px', border: `1.5px solid ${active ? C.rose : C.border}`,
                background: active ? '#FEF0F0' : 'white',
                color: active ? C.rose : C.text,
                fontSize: compact ? '12px' : '13px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.2s',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RecipientSelector({ label = 'Who is this for?', items, selected, onSelect, compact }: Props) {
  return (
    <div>
      {label && <p style={{ fontSize: '12px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{label}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map((item) => {
          const active = selected === item.slug;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(active ? null : item.slug)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: compact ? '6px 12px' : '8px 16px',
                borderRadius: '100px', border: `1.5px solid ${active ? C.rose : C.border}`,
                background: active ? '#FEF0F0' : 'white',
                color: active ? C.rose : C.text,
                fontSize: compact ? '11px' : '12px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {item.emoji && <span style={{ fontSize: '14px' }}>{item.emoji}</span>}
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * TaxonomyFilter — sidebar or inline filter combining occasion + gift type + recipient
 */
interface FilterProps {
  occasionTypes: TaxonomyItem[];
  giftTypes: TaxonomyItem[];
  recipientTypes: TaxonomyItem[];
  selectedOccasion: string | null;
  selectedGiftType: string | null;
  selectedRecipient: string | null;
  onOccasionChange: (slug: string | null) => void;
  onGiftTypeChange: (slug: string | null) => void;
  onRecipientChange: (slug: string | null) => void;
  onClear: () => void;
}

export function TaxonomyFilter({
  occasionTypes, giftTypes, recipientTypes,
  selectedOccasion, selectedGiftType, selectedRecipient,
  onOccasionChange, onGiftTypeChange, onRecipientChange, onClear,
}: FilterProps) {
  const hasFilter = selectedOccasion || selectedGiftType || selectedRecipient;

  return (
    <div style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: C.text }}>Filter Gifts</h3>
        {hasFilter && (
          <button onClick={onClear} style={{ fontSize: '11px', color: C.rose, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
        )}
      </div>
      <OccasionSelector label="Occasion" items={occasionTypes} selected={selectedOccasion} onSelect={onOccasionChange} compact />
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '16px' }}>
        <GiftTypeSelector label="Gift Type" items={giftTypes} selected={selectedGiftType} onSelect={onGiftTypeChange} compact />
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '16px' }}>
        <RecipientSelector label="For Who?" items={recipientTypes} selected={selectedRecipient} onSelect={onRecipientChange} compact />
      </div>
    </div>
  );
}
