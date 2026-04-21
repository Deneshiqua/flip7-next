'use client';

import React, { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useI18n } from '@/context/I18nContext';
import Card from '@/components/Card';
import GameTable from '@/components/GameTable/GameTable';
import styles from './GameScreen.module.css';

export default function GameScreen() {
  const { state, playerHit, playerStay, aiTurn, nextRound, resetGame, endRound } = useGame();
  const { t } = useI18n();
  const { players, currentPlayer, round, deck, screen } = state;
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [roundScores, setRoundScores] = useState({ human: 0, opponent: 0 });

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

  // Check for round end and show result
  useEffect(() => {
    const humanDone = human.status !== 'playing';
    const opponentDone = opponent.status !== 'playing';
    
    if (humanDone && opponentDone && !showRoundResult) {
      // Both players done - calculate scores
      const humanScore = human.status === 'busted' ? 0 : 
        human.numberCards.reduce((sum, c) => sum + c.value, 0) +
        human.modifierCards.reduce((sum, c) => sum + (c.value === 'x2' ? 0 : c.value as number), 0) +
        (human.numberCards.length === 7 ? 15 : 0);
      const opponentScore = opponent.status === 'busted' ? 0 :
        opponent.numberCards.reduce((sum, c) => sum + c.value, 0) +
        opponent.modifierCards.reduce((sum, c) => sum + (c.value === 'x2' ? 0 : c.value as number), 0) +
        (opponent.numberCards.length === 7 ? 15 : 0);
      
      setRoundScores({ human: humanScore, opponent: opponentScore });
      setShowRoundResult(true);
    }
  }, [human.status, opponent.status, showRoundResult]);

  if (screen !== 'playing') return null;

  return (
    <GameTable>
      <div className={styles.container}>
        {/* Round Badge - Positioned on table */}
        <div className={styles.roundBadge}>{t.round} {round}</div>

        {/* Opponent Area - Top of table */}
        <section className={styles.playerAreaOpponent}>
          <div className={styles.playerLabel}>
            <span className={styles.playerName}>{opponent.name}</span>
            <StatusBadge status={opponent.status} frozen={opponent.frozen} t={t} />
            <span className={styles.playerScore}>{opponent.totalScore}</span>
          </div>
          <div className={styles.cardsRow}>
            {opponent.numberCards.map((card, i) => (
              <Card key={i} card={card} />
            ))}
            {[...Array(Math.max(0, 5 - opponent.numberCards.length))].map((_, i) => (
              <Card key={`facedown-${i}`} card={{ type: 'number', value: 0 }} faceDown />
            ))}
          </div>
        </section>

        {/* Center divider */}
        <div className={styles.centerArea}>
          <div className={styles.potArea}>
            <span className={styles.potIcon}>🎴</span>
            <span className={styles.deckCount}>{deck.length}</span>
          </div>
          {currentPlayer === 0 ? (
            <span className={styles.turnBadge}>{t.yourTurn}</span>
          ) : (
            <span className={styles.turnBadgeOpponent}>{t.opponentTurn}</span>
          )}
        </div>

        {/* Player Area - Bottom of table */}
        <section className={styles.playerAreaPlayer}>
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
            <StatusBadge status={human.status} frozen={human.frozen} t={t} />
            <span className={styles.playerScore}>{human.totalScore}</span>
          </div>
        </section>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {showPlayAgain ? (
            <>
              <button onClick={() => setShowRoundResult(true)} className={`${styles.btn} ${styles.btnPrimary}`}>
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

        {/* Round Result Modal */}
        {showRoundResult && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>{t.roundComplete}</h2>
              <div className={styles.scores}>
                <div className={styles.scoreCard}>
                  <span className={styles.scoreName}>{human.name}</span>
                  <span className={styles.scoreValue}>{roundScores.human}</span>
                  <span className={styles.scoreTotal}>Total: {human.totalScore}</span>
                </div>
                <div className={styles.vs}>VS</div>
                <div className={`${styles.scoreCard} ${styles.opponent}`}>
                  <span className={styles.scoreName}>{opponent.name}</span>
                  <span className={styles.scoreValue}>{roundScores.opponent}</span>
                  <span className={styles.scoreTotal}>Total: {opponent.totalScore}</span>
                </div>
              </div>
              <div className={styles.resultText}>
                {human.status === 'winner' && t.youWin}
                {opponent.status === 'winner' && t.computerWins}
                {human.status === 'busted' && t.busted}
                {opponent.status === 'busted' && (t.hit === 'Hit' ? '💻 Busted!' : '💻 Bilgisayar Patladı!')}
              </div>
              <button onClick={() => { setShowRoundResult(false); endRound(); }} className={`${styles.btn} ${styles.btnPrimary}`}>
                {t.nextRound}
              </button>
            </div>
          </div>
        )}
      </div>
    </GameTable>
  );
}

function StatusBadge({ status, frozen, t }: { status: string; frozen: boolean; t: any }) {
  if (status === 'stayed') return <span className={`${styles.badge} ${styles.stayed}`}>{t.stayed}</span>;
  if (status === 'busted') return <span className={`${styles.badge} ${styles.busted}`}>{t.busted}</span>;
  if (frozen) return <span className={`${styles.badge} ${styles.frozen}`}>{t.frozen}</span>;
  if (status === 'winner') return <span className={`${styles.badge} ${styles.winner}`}>{t.winner}</span>;
  return null;
}
