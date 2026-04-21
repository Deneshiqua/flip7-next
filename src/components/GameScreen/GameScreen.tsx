'use client';

import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { useI18n } from '@/context/I18nContext';
import Card from '@/components/Card';
import styles from './GameScreen.module.css';

export default function GameScreen() {
  const { state, playerHit, playerStay, aiTurn, nextRound, resetGame } = useGame();
  const { t } = useI18n();
  const { players, currentPlayer, round, deck, screen } = state;

  const human = players[0];
  const opponent = players[1];

  const canAct = currentPlayer === 0 && human.status === 'playing';
  const showPlayAgain = human.status === 'busted' || human.status === 'winner' || opponent.status === 'winner';

  // AI turn effect
  useEffect(() => {
    if (currentPlayer === 1 && human.status !== 'busted' && human.status !== 'winner') {
      const timer = setTimeout(() => {
        aiTurn();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, aiTurn, human.status]);

  if (screen !== 'playing') return null;

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.gameTitle}>🃏 Flip 7</div>
        <div className={styles.roundBadge}>{t.round} {round}</div>
      </header>

      {/* Opponent Area */}
      <section className={styles.playerArea}>
        <div className={styles.playerLabel}>
          <span className={styles.playerName}>{opponent.name}</span>
          <span className={styles.playerScore}>{opponent.totalScore}</span>
        </div>
        <div className={styles.cardsRow}>
          {opponent.numberCards.map((card, i) => (
            <Card key={i} card={card} />
          ))}
          {[...Array(Math.max(0, 3 - opponent.numberCards.length))].map((_, i) => (
            <Card key={`facedown-${i}`} card={{ type: 'number', value: 0 }} faceDown />
          ))}
        </div>
        <StatusBadge status={opponent.status} frozen={opponent.frozen} t={t} />
      </section>

      {/* Divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerIcon}>♦️</span>
        <span className={styles.dividerLine} />
      </div>

      {/* Player Area */}
      <section className={styles.playerAreaMain}>
        <StatusBadge status={human.status} frozen={human.frozen} t={t} />
        <div className={styles.cardsRow}>
          {human.numberCards.map((card, i) => (
            <Card key={i} card={card} busted={human.status === 'busted'} frozen={human.frozen} />
          ))}
        </div>
        <div className={styles.modifiersRow}>
          {human.modifierCards.map((card, i) => (
            <Card key={i} card={card} small />
          ))}
        </div>
        <div className={styles.playerLabel}>
          <span className={styles.playerName}>{human.name}</span>
          <span className={styles.playerScore}>{human.totalScore}</span>
        </div>
      </section>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {showPlayAgain ? (
          <>
            <button onClick={nextRound} className={`${styles.btn} ${styles.btnPrimary}`}>
              {t.nextRound}
            </button>
            <button onClick={resetGame} className={`${styles.btn} ${styles.btnSecondary}`}>
              {t.newGame}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={playerHit}
              disabled={!canAct}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              🃏 {t.hit}
            </button>
            <button
              onClick={playerStay}
              disabled={!canAct}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              💾 {t.stay}
            </button>
          </>
        )}
      </div>

      {/* Bottom Bar */}
      <footer className={styles.bottomBar}>
        <span>🃏 {t.deck}: {deck.length}</span>
        <span className={styles.turnIndicator}>
          {currentPlayer === 0 ? t.yourTurn : t.opponentTurn}
        </span>
        <span></span>
      </footer>
    </div>
  );
}

function StatusBadge({ status, frozen, t }: { status: string; frozen: boolean; t: any }) {
  if (status === 'stayed') return <span className={`${styles.badge} ${styles.stayed}`}>{t.stayed}</span>;
  if (status === 'busted') return <span className={`${styles.badge} ${styles.busted}`}>{t.busted}</span>;
  if (frozen) return <span className={`${styles.badge} ${styles.frozen}`}>{t.frozen}</span>;
  if (status === 'winner') return <span className={`${styles.badge} ${styles.winner}`}>{t.winner}</span>;
  return null;
}
