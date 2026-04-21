'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';
import { createClient } from '@/utils/supabase/client';
import styles from './Leaderboard.module.css';

interface LeaderboardEntry {
  player_name: string;
  score: number;
  status: string;
  created_at: string;
}

export default function Leaderboard() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('game_players')
        .select('player_name, score, status, created_at')
        .eq('is_ai', false)
        .order('score', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Failed to load leaderboard:', error);
        setLoading(false);
        return;
      }

      setEntries(data || []);
    } catch (e) {
      console.error('Leaderboard error:', e);
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏆 {t.leaderboard || 'Leaderboard'}</h2>
      
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : entries.length === 0 ? (
        <div className={styles.empty}>No scores yet. Play a game!</div>
      ) : (
        <div className={styles.list}>
          {entries.map((entry, index) => (
            <div key={index} className={styles.row}>
              <span className={styles.rank}>#{index + 1}</span>
              <span className={styles.name}>{entry.player_name}</span>
              <span className={styles.score}>{entry.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
