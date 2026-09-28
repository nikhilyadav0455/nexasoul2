'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { Character } from './character-data';

export function CharacterInfo({ character }: { character: Character }) {
  return (
    <div className="character-info" style={{ '--character-accent': character.accent } as React.CSSProperties}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={character.id}
          className="character-info-copy"
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="character-rank">{character.rank}</p>
          <h2>{character.name}</h2>
          <p className="character-title">{character.title}</p>
          <div className="bounty-stamp" aria-label={`Bounty ${character.bounty}`}>
            <span className="bounty-label">BOUNTY</span>
            <span className="bounty-value">{character.bounty}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}