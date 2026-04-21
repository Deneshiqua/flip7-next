'use client';

import React from 'react';
import { useI18n } from '@/context/I18nContext';
import styles from './GameTable.module.css';

export default function GameTable({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.felt}>
        <div className={styles.rail} />
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.rail} />
      </div>
    </div>
  );
}
