// Card types
export type CardType = 'number' | 'modifier' | 'action';
export type ActionType = 'freeze' | 'flipThree' | 'secondChance';

export interface NumberCard {
  type: 'number';
  value: number;
}

export interface ModifierCard {
  type: 'modifier';
  value: number | 'x2';
}

export interface ActionCard {
  type: 'action';
  actionType: ActionType;
}

export type Card = NumberCard | ModifierCard | ActionCard;

// Player state
export interface Player {
  id: number;
  name: string;
  totalScore: number;
  numberCards: NumberCard[];
  modifierCards: ModifierCard[];
  actionCards: ActionCard[];
  status: 'playing' | 'stayed' | 'busted' | 'frozen' | 'winner';
  frozen: boolean;
  isAI: boolean;
}

// Game state
export interface GameState {
  screen: 'start' | 'playing' | 'roundEnd' | 'gameOver';
  round: number;
  deck: Card[];
  players: Player[];
  currentPlayer: number;
  phase: 'waiting' | 'acting';
  pendingFlipThree: number;
  secondChanceUsed: boolean;
  winner: Player | null;
}

export const WINNING_SCORE = 200;
export const FLIP7_BONUS = 15;
