'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { GameState, Player, Card, NumberCard, ModifierCard, ActionCard } from '@/types/game';
import { buildDeck, calculateScore } from '@/lib/game';
import { Flip7AI } from '@/lib/ai';
import { WINNING_SCORE, FLIP7_BONUS } from '@/types/game';

type GameAction =
  | { type: 'START_GAME'; playerName: string }
  | { type: 'PLAYER_HIT' }
  | { type: 'PLAYER_STAY' }
  | { type: 'AI_TURN' }
  | { type: 'AI_STAY' }
  | { type: 'RESOLVE_CARD'; playerIndex: number; card: Card }
  | { type: 'END_ROUND' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_GAME' }
  | { type: 'SHOW_ROUND_RESULT'; humanScore: number; opponentScore: number }
  | { type: 'HIDE_ROUND_RESULT' }
  | { type: 'SET_GAME_OVER'; winner: Player };

const initialState: GameState = {
  screen: 'start',
  round: 1,
  deck: [],
  players: [],
  currentPlayer: 0,
  phase: 'waiting',
  pendingFlipThree: 0,
  secondChanceUsed: false,
  winner: null,
};

function createPlayer(id: number, name: string, isAI: boolean = false): Player {
  return {
    id,
    name,
    totalScore: 0,
    numberCards: [],
    modifierCards: [],
    actionCards: [],
    status: 'playing',
    frozen: false,
    isAI,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const deck = buildDeck();
      const players = [
        createPlayer(0, action.playerName),
        createPlayer(1, 'Computer', true),
      ];
      // Deal initial cards - type-safe
      const p1Card1 = deck.pop();
      const p1Card2 = deck.pop();
      const p2Card1 = deck.pop();
      const p2Card2 = deck.pop();
      if (p1Card1) players[0].numberCards.push(p1Card1 as NumberCard);
      if (p1Card2) players[0].numberCards.push(p1Card2 as NumberCard);
      if (p2Card1) players[1].numberCards.push(p2Card1 as NumberCard);
      if (p2Card2) players[1].numberCards.push(p2Card2 as NumberCard);

      return {
        ...state,
        screen: 'playing',
        round: 1,
        deck,
        players,
        currentPlayer: 0,
        phase: 'waiting',
        pendingFlipThree: 0,
        secondChanceUsed: false,
        winner: null,
      };
    }

    case 'RESOLVE_CARD': {
      const { playerIndex, card } = action;
      const player = state.players[playerIndex];
      const newPlayers = [...state.players];

      if (card.type === 'number') {
        const numCard = card as NumberCard;
        const duplicate = player.numberCards.some(c => c.value === numCard.value);
        player.numberCards.push(numCard);

        if (duplicate) {
          player.status = 'busted';
          newPlayers[playerIndex] = { ...player };
          return { ...state, players: newPlayers };
        }

        if (player.numberCards.length === 7) {
          player.status = 'winner';
          const roundScore = calculateScore(player.numberCards, player.modifierCards) + FLIP7_BONUS;
          player.totalScore += roundScore;
          newPlayers[playerIndex] = { ...player };
          return { ...state, players: newPlayers };
        }
      } else if (card.type === 'modifier') {
        player.modifierCards.push(card as ModifierCard);
      } else if (card.type === 'action') {
        player.actionCards.push(card as ActionCard);
        // Handle freeze action - freeze the OTHER player
        if (card.actionType === 'freeze') {
          const opponentIndex = playerIndex === 0 ? 1 : 0;
          newPlayers[opponentIndex] = { ...newPlayers[opponentIndex], frozen: true };
        }
      }

      newPlayers[playerIndex] = { ...player };
      return { ...state, players: newPlayers };
    }

    case 'PLAYER_STAY': {
      const newPlayers = [...state.players];
      newPlayers[0] = { ...newPlayers[0], status: 'stayed' };
      return { ...state, players: newPlayers };
    }

    case 'AI_STAY': {
      const newPlayers = [...state.players];
      newPlayers[1] = { ...newPlayers[1], status: 'stayed' };
      return { ...state, players: newPlayers };
    }

    case 'END_ROUND': {
      const newPlayers = state.players.map(p => {
        if (p.status === 'busted') return p;
        const roundScore = calculateScore(p.numberCards, p.modifierCards) +
          (p.numberCards.length === 7 ? FLIP7_BONUS : 0);
        return { ...p, totalScore: p.totalScore + roundScore };
      });

      // Check for game winner
      const winner = newPlayers.find(p => p.totalScore >= WINNING_SCORE);
      if (winner) {
        return { ...state, screen: 'gameOver', players: newPlayers, winner };
      }

      // Reset for next round
      const deck = buildDeck();
      const resetPlayers = newPlayers.map(p => ({
        ...p,
        numberCards: [],
        modifierCards: [],
        actionCards: [],
        status: 'playing' as const,
        frozen: false,
      }));

      return {
        ...state,
        round: state.round + 1,
        deck,
        players: resetPlayers,
        currentPlayer: 0,
        phase: 'waiting',
      };
    }

    case 'NEXT_ROUND': {
      const deck = buildDeck();
      const resetPlayers: Player[] = state.players.map(p => ({
        ...p,
        numberCards: [] as NumberCard[],
        modifierCards: [] as ModifierCard[],
        actionCards: [] as ActionCard[],
        status: 'playing',
        frozen: false,
      }));

      // Deal initial cards - type-safe
      const p1Card1 = deck.pop();
      const p1Card2 = deck.pop();
      const p2Card1 = deck.pop();
      const p2Card2 = deck.pop();
      if (p1Card1) resetPlayers[0].numberCards.push(p1Card1 as NumberCard);
      if (p1Card2) resetPlayers[0].numberCards.push(p1Card2 as NumberCard);
      if (p2Card1) resetPlayers[1].numberCards.push(p2Card1 as NumberCard);
      if (p2Card2) resetPlayers[1].numberCards.push(p2Card2 as NumberCard);

      return {
        ...state,
        round: state.round + 1,
        deck,
        players: resetPlayers,
        currentPlayer: 0,
        phase: 'waiting',
        screen: 'playing',
      };
    }

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  startGame: (playerName: string) => void;
  playerHit: () => void;
  playerStay: () => void;
  aiTurn: () => void;
  aiStay: () => void;
  endRound: () => void;
  nextRound: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const aiRef = useRef<Flip7AI | null>(null);

  const startGame = useCallback((playerName: string) => {
    aiRef.current = new Flip7AI();
    dispatch({ type: 'START_GAME', playerName });
  }, []);

  const playerHit = useCallback(() => {
    if (state.players[0].status !== 'playing') return;
    if (state.deck.length === 0) return;
    const card = state.deck.pop()!;
    dispatch({ type: 'RESOLVE_CARD', playerIndex: 0, card });
  }, [state.deck, state.players]);

  const playerStay = useCallback(() => {
    dispatch({ type: 'PLAYER_STAY' });
  }, []);

  const aiStay = useCallback(() => {
    dispatch({ type: 'AI_STAY' });
  }, []);

  const aiTurn = useCallback(() => {
    if (!aiRef.current) return;
    
    const aiPlayer = state.players[1];
    if (aiPlayer.status !== 'playing') return;
    if (aiPlayer.frozen) {
      // Unfreeze and stay
      const newPlayers = [...state.players];
      newPlayers[1] = { ...newPlayers[1], frozen: false };
      dispatch({ type: 'AI_STAY' });
      return;
    }

    const decision = aiRef.current.decide(state, 1);
    if (decision.action === 'stay') {
      dispatch({ type: 'AI_STAY' });
    } else {
      if (state.deck.length === 0) return;
      const card = state.deck.pop()!;
      dispatch({ type: 'RESOLVE_CARD', playerIndex: 1, card });
    }
  }, [state, aiStay]);

  const endRound = useCallback(() => {
    dispatch({ type: 'END_ROUND' });
  }, []);

  const nextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      startGame,
      playerHit,
      playerStay,
      aiTurn,
      aiStay,
      endRound,
      nextRound,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
