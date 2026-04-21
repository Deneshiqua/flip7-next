import { GameState, Card } from '@/types/game';
import { calculateScore } from './game';

interface AIDecision {
  action: 'hit' | 'stay';
  reason: string;
}

export class Flip7AI {
  name = 'Computer';

  decide(gameState: GameState, playerIndex: number): AIDecision {
    const player = gameState.players[playerIndex];

    if (player.status !== 'playing') {
      return { action: 'stay', reason: 'not playing' };
    }

    if (player.frozen) {
      return { action: 'stay', reason: 'frozen' };
    }

    const bustRisk = this.calculateBustRisk(gameState, playerIndex);
    const currentScore = calculateScore(player.numberCards, player.modifierCards);
    const opponent = gameState.players[playerIndex === 0 ? 1 : 0];

    // Stay on high scores
    if (currentScore >= 40) {
      return { action: 'stay', reason: `high score: ${currentScore}` };
    }

    // Stay if bust risk is very high
    if (bustRisk > 0.5) {
      return { action: 'stay', reason: `bust risk: ${(bustRisk * 100).toFixed(0)}%` };
    }

    // Moderate play: stay if bust risk > 30% and score >= 25
    if (bustRisk > 0.3 && currentScore >= 25) {
      return { action: 'stay', reason: `moderate risk at good score` };
    }

    // Behind opponent - be more aggressive
    const scoreDiff = opponent.totalScore - player.totalScore;
    if (scoreDiff > 30 && bustRisk < 0.6) {
      return { action: 'hit', reason: 'chasing opponent' };
    }

    // Ahead of opponent - play safe
    if (scoreDiff < -20 && bustRisk > 0.15) {
      return { action: 'stay', reason: 'safe play, ahead' };
    }

    // Default: hit if bust risk < 35%
    if (bustRisk < 0.35) {
      return { action: 'hit', reason: `low bust risk: ${(bustRisk * 100).toFixed(0)}%` };
    }

    return { action: 'stay', reason: 'default safe' };
  }

  private calculateBustRisk(gameState: GameState, playerIndex: number): number {
    const player = gameState.players[playerIndex];
    const drawnNumbers = player.numberCards.map(c => c.value);

    if (drawnNumbers.length === 0) return 0;

    const deck = gameState.deck;
    const numberCounts: Record<number, number> = {};

    for (const card of deck) {
      if (card.type === 'number') {
        const num = (card as Card & { type: 'number' }).value;
        numberCounts[num] = (numberCounts[num] || 0) + 1;
      }
    }

    let bustCards = 0;
    for (const num of drawnNumbers) {
      bustCards += numberCounts[num] || 0;
    }

    const totalCards = deck.length;
    if (totalCards === 0) return 1;

    return bustCards / totalCards;
  }
}
