'use client';

import type { CSSProperties } from 'react';

const particles = Array.from({ length: 28 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 61 + 7) % 100}%`,
  delay: `${(index % 9) * -0.8}s`,
  duration: `${7 + (index % 6)}s`,
  size: `${1 + (index % 3)}px`,
}));

export function ParticleBackground({ accent }: { accent: string }) {
  return (
    <div className="particle-field" aria-hidden="true" style={{ '--particle-accent': accent } as CSSProperties}>
      {particles.map((particle, index) => (
        <span
          key={index}
          className="particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}