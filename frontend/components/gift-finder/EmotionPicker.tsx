'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const EMOTIONS = [
  { id: 'loved', label: 'Loved', color: '#FF4B6B', bg: 'rgba(255,75,107,0.08)', emoji: '💕' },
  { id: 'appreciated', label: 'Appreciated', color: '#FF8C42', bg: 'rgba(255,140,66,0.08)', emoji: '✨' },
  { id: 'surprised', label: 'Surprised', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', emoji: '🎊' },
  { id: 'celebrated', label: 'Celebrated', color: '#D97706', bg: 'rgba(217,119,6,0.08)', emoji: '🥂' },
  { id: 'cherished', label: 'Cherished', color: '#059669', bg: 'rgba(5,150,105,0.08)', emoji: '🌿' },
  { id: 'remembered', label: 'Remembered', color: '#2563EB', bg: 'rgba(37,99,235,0.08)', emoji: '💙' },
];

interface EmotionPickerProps {
  /** If provided, clicking will pre-fill emotion in gift finder URL */
  onSelect?: (emotion: string) => void;
  selectedEmotion?: string;
  compact?: boolean;
}

/**
 * EmotionPicker — Emotion-first gifting selector.
 * Can be embedded on product pages or used standalone.
 */
export default function EmotionPicker({
  onSelect,
  selectedEmotion,
  compact = false,
}: EmotionPickerProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: compact
          ? 'repeat(3, 1fr)'
          : 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px',
      }}
    >
      {EMOTIONS.map((em, i) => {
        const isSelected = selectedEmotion === em.id;
        const content = (
          <motion.div
            key={em.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect?.(em.id)}
            style={{
              background: isSelected ? em.bg : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isSelected ? em.color : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '16px',
              padding: compact ? '14px 10px' : '20px 16px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 0.2s, background 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: compact ? '22px' : '28px' }}>{em.emoji}</span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: isSelected ? em.color : 'rgba(245,245,240,0.8)',
                transition: 'color 0.2s',
              }}
            >
              {em.label}
            </span>
          </motion.div>
        );

        if (!onSelect) {
          return (
            <Link
              key={em.id}
              href={`/gift-finder`}
              style={{ textDecoration: 'none' }}
            >
              {content}
            </Link>
          );
        }
        return <div key={em.id}>{content}</div>;
      })}
    </div>
  );
}
