'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useI18n } from '@/context/I18nContext';
import { createClient } from '@/utils/supabase/client';
import styles from './StartScreen.module.css';

export default function StartScreen() {
  const [name, setName] = useState('');
  const { startGame } = useGame();
  const { lang, t, toggleLang } = useI18n();

  const handleStart = async () => {
    const playerName = name.trim() || 'Player';
    startGame(playerName);

    // Save to Supabase if available
    try {
      const supabase = createClient();
      await supabase.from('players').upsert({
        name: playerName,
        last_seen: new Date().toISOString(),
      });
    } catch (e) {
      // Supabase not required for gameplay
    }
  };

  return (
    <div className={styles.container}>
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

        <div className={styles.langToggle}>
          <button onClick={toggleLang} className={styles.langBtn}>
            {lang === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
          </button>
        </div>

        <div className={styles.rules}>
          <h3>{t.howToPlay}</h3>
          <ul>
            <li>{lang === 'tr' ? 'Numara kartları çek (0-12) — Kopya çekme!' : 'Draw Number cards (0-12) — don\'t get duplicates!'}</li>
            <li>{lang === 'tr' ? 'Kart Çek veya Kal' : 'Choose Hit to draw or Stay to lock in score'}</li>
            <li>{lang === 'tr' ? '7 benzersiz kart = anında kazanırsın +15 bonus' : 'Flip 7 unique cards = instant win +15 bonus'}</li>
            <li>{lang === 'tr' ? '❄️ Donma, 🔄 3 Kart Çevir, ♻️ 2. Şans kartlarına dikkat!' : 'Watch out for ❄️ Freeze, 🔄 Flip Three, ♻️ Second Chance'}</li>
            <li>{lang === 'tr' ? 'İlk 200 puana ulaşan kazanır!' : 'First to 200 points wins!'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
