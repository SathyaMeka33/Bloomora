'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp, Zap, Star } from 'lucide-react';
import { useState } from 'react';

interface GiftFitScoreCardProps {
  score: number;
  why: string;
  productName?: string;
  deliveryEstimate?: string;
}

/**
 * GiftFitScoreCard — Shows Gift Fit Score on a product detail page
 * when the user arrived from the Gift Finder.
 */
export default function GiftFitScoreCard({
  score,
  why,
  productName,
  deliveryEstimate,
}: GiftFitScoreCardProps) {
  const [expanded, setExpanded] = useState(true);

  const color =
    score >= 85 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444';
  const label =
    score >= 85 ? 'Excellent Fit' : score >= 70 ? 'Good Fit' : 'Possible Fit';
  const bgGradient =
    score >= 85
      ? 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.05) 100%)'
      : score >= 70
      ? 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.05) 100%)'
      : 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.05) 100%)';

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: bgGradient,
        border: `1px solid ${color}33`,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '24px',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Score display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: `${color}22`,
              border: `2px solid ${color}55`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color,
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 700, color, opacity: 0.8 }}>
              %
            </span>
          </div>
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color,
                marginBottom: '4px',
              }}
            >
              Gift Fit Score™
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#F5F5F0',
              }}
            >
              {label}
            </div>
            {deliveryEstimate && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: 'rgba(245,245,240,0.6)',
                  marginTop: '4px',
                }}
              >
                <Zap size={11} />
                Ready in {deliveryEstimate}
              </div>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: `1px solid ${color}44`,
            borderRadius: '100px',
            padding: '8px 14px',
            color,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Brain size={14} />
          Why this gift?
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Why explanation */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: `1px solid ${color}22`,
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(245,245,240,0.75)',
                  lineHeight: 1.7,
                }}
              >
                {why}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score bar */}
      <div
        style={{
          marginTop: '16px',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: color,
            borderRadius: '2px',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px',
        }}
      >
        <span style={{ fontSize: '10px', color: 'rgba(245,245,240,0.4)' }}>
          Match score
        </span>
        <span style={{ fontSize: '10px', color, fontWeight: 700 }}>
          {score}/100
        </span>
      </div>
    </motion.div>
  );
}
