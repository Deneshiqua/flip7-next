import { Card, NumberCard, ModifierCard, ActionCard, ActionType } from '@/types/game';

const NUMBER_DISTRIBUTION = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const ACTION_TYPES: ActionType[] = ['freeze', 'flipThree', 'secondChance'];
const MODIFIER_VALUES: (number | 'x2')[] = [2, 4, 6, 8, 10, 'x2'];

export function buildDeck(): Card[] {
  const deck: Card[] = [];

  // Number cards: count equals the number (one 0, two 1s, three 2s, etc.)
  for (const num of NUMBER_DISTRIBUTION) {
    const count = num === 0 ? 1 : num;
    for (let i = 0; i < count; i++) {
      deck.push({ type: 'number', value: num } as NumberCard);
    }
  }

  // Modifier cards: +2, +4, +6, +8, +10, x2 (one each)
  for (const mod of MODIFIER_VALUES) {
    deck.push({ type: 'modifier', value: mod } as ModifierCard);
  }

  // Action cards: 3 of each type
  for (const action of ACTION_TYPES) {
    for (let i = 0; i < 3; i++) {
      deck.push({ type: 'action', actionType: action } as ActionCard);
    }
  }

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateScore(numberCards: NumberCard[], modifierCards: ModifierCard[]): number {
  let sum = numberCards.reduce((acc, c) => acc + c.value, 0);

  // Apply x2 multiplier first
  const hasX2 = modifierCards.some(c => c.value === 'x2');
  if (hasX2) sum *= 2;

  // Add flat modifiers
  for (const card of modifierCards) {
    if (card.value !== 'x2') {
      sum += card.value;
    }
  }

  return sum;
}
