'use client';

import React from 'react';
import { useI18n } from '@/context/I18nContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
  const { lang, t, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.logo}>🃏 Flip 7</span>
      </div>
      <div className={styles.right}>
        <button onClick={toggleTheme} className={styles.iconBtn} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button onClick={toggleLang} className={styles.iconBtn}>
          {lang === 'tr' ? '🇹🇷' : '🇬🇧'}
        </button>
      </div>
    </header>
  );
}
