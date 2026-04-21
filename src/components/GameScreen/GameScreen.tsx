'use client';

import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import Card from '@/components/Card';
import styles from './GameScreen.module.css';

export default function GameScreen() {
  const { state, playerHit, playerStay, aiTurn, nextRound, resetGame } = useGame();
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

  // Check for round end
  useEffect(() => {
    if (human.status === 'busted' || human.status === 'winner' ||
        opponent.status === 'busted' || opponent.status === 'winner') {
      const timer = setTimeout(() => {
        // Would dispatch END_ROUND here
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [human.status, opponent.status]);

  if (screen !== 'playing') return null;

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.gameTitle}>🃏 Flip 7</div>
        <div className={styles.roundBadge}>Round {round}</div>
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
        <StatusBadge status={opponent.status} frozen={opponent.frozen} />
      </section>

      {/* Divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerIcon}>♦️</span>
        <span className={styles.dividerLine} />
      </div>

      {/* Player Area */}
      <section className={styles.playerAreaMain}>
        <StatusBadge status={human.status} frozen={human.frozen} />
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
              🔄 Next Round
            </button>
            <button onClick={resetGame} className={`${styles.btn} ${styles.btnSecondary}`}>
              🏠 New Game
            </button>
          </>
        ) : (
          <>
            <button
              onClick={playerHit}
              disabled={!canAct}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              🃏 Hit
            </button>
            <button
              onClick={playerStay}
              disabled={!canAct}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              💾 Stay
            </button>
          </>
        )}
      </div>

      {/* Bottom Bar */}
      <footer className={styles.bottomBar}>
        <span>🃏 Deck: {deck.length}</span>
        <span className={styles.turnIndicator}>
          {currentPlayer === 0 ? 'Your Turn' : 'Opponent Turn'}
        </span>
        <span></span>
      </footer>
    </div>
  );
}

function StatusBadge({ status, frozen }: { status: string; frozen: boolean }) {
  if (status === 'stayed') return <span className={`${styles.badge} ${styles.stayed}`}>💾 Stayed</span>;
  if (status === 'busted') return <span className={`${styles.badge} ${styles.busted}`}>💥 Busted</span>;
  if (frozen) return <span className={`${styles.badge} ${styles.frozen}`}>❄️ Frozen</span>;
  if (status === 'winner') return <span className={`${styles.badge} ${styles.winner}`}>🏆 Winner!</span>;
  return null;
}
