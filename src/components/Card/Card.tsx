'use client';

import React from 'react';
import { Card as CardType, ActionType } from '@/types/game';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  small?: boolean;
  busted?: boolean;
  frozen?: boolean;
  triggering?: boolean;
}

const ACTION_ICONS: Record<ActionType, string> = {
  freeze: '❄️',
  flipThree: '🔄',
  secondChance: '♻️',
};

const ACTION_LABELS: Record<ActionType, string> = {
  freeze: 'Freeze',
  flipThree: 'Flip 3',
  secondChance: '2nd Chance',
};

export default function Card({ card, faceDown, small, busted, frozen, triggering }: CardProps) {
  if (faceDown) {
    return <div className={`${styles.card} ${styles.faceDown}`} />;
  }

  if (card.type === 'number') {
    const classes = [
      styles.card,
      styles.number,
      styles[`n${card.value}`],
      busted && styles.busted,
      frozen && styles.frozen,
    ].filter(Boolean).join(' ');
    return (
      <div className={classes}>
        <span className={styles.value}>{card.value}</span>
      </div>
    );
  }

  if (card.type === 'modifier') {
    const isX2 = card.value === 'x2';
    return (
      <div className={`${styles.card} ${styles.modifier} ${isX2 ? styles.x2 : ''}`}>
        <span className={styles.value}>{isX2 ? '×2' : `+${card.value}`}</span>
      </div>
    );
  }

  if (card.type === 'action') {
    return (
      <div className={`${styles.card} ${styles.action} ${triggering ? styles.triggering : ''}`}>
        <span className={styles.icon}>{ACTION_ICONS[card.actionType]}</span>
        <span className={styles.label}>{ACTION_LABELS[card.actionType]}</span>
      </div>
    );
  }

  return null;
}
