'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { CharacterInfo } from './character-info';
import type { Character } from './character-data';

type CharacterCarouselProps = {
  character: Character;
  characters: Character[];
  onSelect: (index: number) => void;
  activeIndex: number;
};

export function CharacterCarousel({ character, characters, onSelect, activeIndex }: CharacterCarouselProps) {
  return (
    <section
      className="character-showcase"
      data-character={character.id}
      style={{ '--character-accent': character.accent } as React.CSSProperties}
      aria-label="Straw Hat crew showcase"
    >
      <div className="showcase-fallback" aria-hidden="true" />
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={character.id}
          className="character-image-wrap"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="character-image-motion"
            animate={{ scale: [1, 1.06], x: [0, -9] }}
            transition={{ duration: 4, ease: 'linear' }}
          >
            <Image
              src={character.image}
              alt={character.name}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 60vw"
              className="character-image"
              onError={(event) => event.currentTarget.classList.add('image-unavailable')}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="showcase-colorwash" aria-hidden="true" />
      <div className="showcase-grain" aria-hidden="true" />

      <CharacterInfo character={character} />

      <nav className="carousel-dots" aria-label="Choose a crew member">
        {characters.map((item, index) => (
          <button
            key={item.id}
            className={`carousel-dot${index === activeIndex ? ' is-active' : ''}`}
            type="button"
            aria-label={`Show ${item.name}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => onSelect(index)}
          >
            <span />
          </button>
        ))}
      </nav>
    </section>
  );
}