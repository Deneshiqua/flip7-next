'use client';

import { GameProvider, useGame } from '@/context/GameContext';
import StartScreen from '@/components/StartScreen/StartScreen';
import GameScreen from '@/components/GameScreen/GameScreen';
import styles from './page.module.css';

function GameRouter() {
  const { state } = useGame();

  if (state.screen === 'start') {
    return <StartScreen />;
  }

  return <GameScreen />;
}

export default function Home() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
