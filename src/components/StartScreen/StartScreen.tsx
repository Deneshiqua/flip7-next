'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useI18n } from '@/context/I18nContext';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/Header/Header';
import Leaderboard from '@/components/Leaderboard/Leaderboard';
import styles from './StartScreen.module.css';

export default function StartScreen() {
  const [name, setName] = useState('');
  const { startGame } = useGame();
  const { t } = useI18n();

  const handleStart = async () => {
    const playerName = name.trim() || 'Player';
    startGame(playerName);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <h1 className={styles.logo}>{t.logo}</h1>
        <p className={styles.tagline}>{t.tagline}</p>

        <div className={styles.form}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.yourName}
            maxLength={20}
            className={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
          <button onClick={handleStart} className={styles.startBtn}>
            {t.startGame}
          </button>
        </div>

        <div className={styles.rules}>
          <h3>{t.howToPlay}</h3>
          <ul>
            <li>{t.hit === 'Hit' ? 'Draw Number cards (0-12) — don\'t get duplicates!' : 'Numara kartları çek (0-12) — Kopya çekme!'}</li>
            <li>{t.hit === 'Hit' ? 'Choose Hit to draw or Stay to lock in score' : 'Kart Çek veya Kal'}</li>
            <li>{t.hit === 'Hit' ? 'Flip 7 unique cards = instant win +15 bonus' : '7 benzersiz kart = anında kazanırsın +15 bonus'}</li>
            <li>{t.hit === 'Hit' ? 'Watch out for ❄️ Freeze, 🔄 Flip Three, ♻️ Second Chance' : '❄️ Donma, 🔄 3 Kart Çevir, ♻️ 2. Şans kartlarına dikkat!'}</li>
            <li>{t.hit === 'Hit' ? 'First to 200 points wins!' : 'İlk 200 puana ulaşan kazanır!'}</li>
          </ul>
        </div>

        <Leaderboard />
      </div>
    </div>
  );
}
