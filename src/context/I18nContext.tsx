'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'tr' | 'en';

interface Translations {
  // Start Screen
  logo: string;
  tagline: string;
  yourName: string;
  startGame: string;
  howToPlay: string;
  
  // Game
  round: string;
  yourTurn: string;
  opponentTurn: string;
  deck: string;
  hit: string;
  stay: string;
  busted: string;
  stayed: string;
  frozen: string;
  winner: string;
  flip7: string;
  flip7Bonus: string;
  
  // Buttons
  nextRound: string;
  newGame: string;
  
  // Modals
  roundComplete: string;
  gameOver: string;
  youWin: string;
  computerWins: string;
  finalScore: string;
}

const translations: Record<Language, Translations> = {
  tr: {
    logo: '🃏 Flip 7',
    tagline: 'İlk 200 puan kazanır!',
    yourName: 'Adın',
    startGame: 'Oyunu Başlat',
    howToPlay: 'Nasıl Oynanır',
    round: 'Raunt',
    yourTurn: 'Senin Sıran',
    opponentTurn: 'Rakip Sırası',
    deck: 'Deste',
    hit: 'Kart Çek',
    stay: 'Kal',
    busted: '💥 Patladın!',
    stayed: '💾 Kaldı',
    frozen: '❄️ Donmuş',
    winner: '🏆 Kazandın!',
    flip7: '🎉 FLIP 7!',
    flip7Bonus: '+15 Bonus!',
    nextRound: '🔄 Sonraki Raunt',
    newGame: '🏠 Yeni Oyun',
    roundComplete: 'Raunt Bitti!',
    gameOver: 'Oyun Bitti!',
    youWin: '🎉 Sen Kazandın!',
    computerWins: '💻 Bilgisayar Kazandı!',
    finalScore: 'Final Puanı',
  },
  en: {
    logo: '🃏 Flip 7',
    tagline: 'First to 200 wins!',
    yourName: 'Your name',
    startGame: 'Start Game',
    howToPlay: 'How to Play',
    round: 'Round',
    yourTurn: 'Your Turn',
    opponentTurn: 'Opponent Turn',
    deck: 'Deck',
    hit: 'Hit',
    stay: 'Stay',
    busted: '💥 Busted!',
    stayed: '💾 Stayed',
    frozen: '❄️ Frozen',
    winner: '🏆 Winner!',
    flip7: '🎉 FLIP 7!',
    flip7Bonus: '+15 Bonus!',
    nextRound: '🔄 Next Round',
    newGame: '🏠 New Game',
    roundComplete: 'Round Complete!',
    gameOver: 'Game Over!',
    youWin: '🎉 You Win!',
    computerWins: '💻 Computer Wins!',
    finalScore: 'Final Score',
  },
};

interface I18nContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('tr');
  
  const t = translations[lang];
  
  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'tr' ? 'en' : 'tr');
  }, []);
  
  return (
    <I18nContext.Provider value={{ lang, t, setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
