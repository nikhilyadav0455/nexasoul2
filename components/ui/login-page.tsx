'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CharacterCarousel } from './character-carousel';
import { characters } from './character-data';
import { DepartureScene } from './departure-scene';
import { LoginForm } from './login-form';
import { ParticleBackground } from './particle-background';

export function LoginPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasSetSail, setHasSetSail] = useState(false);
  const activeCharacter = characters[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % characters.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  function handleLoginSuccess() {
    try {
      sessionStorage.setItem('grand-line-auth', 'true');
      localStorage.setItem('grand-line-auth', 'true');
    } catch {}
    setHasSetSail(true);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {hasSetSail ? (
        <DepartureScene key="departure" onReturn={() => setHasSetSail(false)} />
      ) : (
        <motion.main
          key="login"
          className="login-page"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <ParticleBackground accent={activeCharacter.accent} />
          <CharacterCarousel
            character={activeCharacter}
            characters={characters}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
          <aside className="login-side" aria-label="Pirate account sign in">
            <div className="panel-light-streak streak-one" aria-hidden="true" />
            <div className="panel-light-streak streak-two" aria-hidden="true" />
            <LoginForm accent={activeCharacter.accent} onSuccess={handleLoginSuccess} />
            <p className="panel-footer">GRAND LINE ARCHIVE <span>•</span> EST. 1520</p>
          </aside>
        </motion.main>
      )}
    </AnimatePresence>
  );
}