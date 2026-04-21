'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import styles from './StartScreen.module.css';

export default function StartScreen() {
  const [name, setName] = useState('');
  const { startGame } = useGame();

  const handleStart = () => {
    const playerName = name.trim() || 'Player';
    startGame(playerName);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>🃏 Flip 7</h1>
        <p className={styles.tagline}>First to 200 wins!</p>

        <div className={styles.form}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            className={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
          <button onClick={handleStart} className={styles.startBtn}>
            Start Game
          </button>
        </div>

        <div className={styles.rules}>
          <h3>How to Play</h3>
          <ul>
            <li>Draw Number cards (0-12) — don&apos;t get duplicates!</li>
            <li>Choose <strong>Hit</strong> to draw or <strong>Stay</strong> to lock in your score</li>
            <li>Flip 7 unique cards = instant win +15 bonus</li>
            <li>Watch out for Action cards: ❄️ Freeze, 🔄 Flip Three, ♻️ Second Chance</li>
            <li>First to 200 points wins!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
