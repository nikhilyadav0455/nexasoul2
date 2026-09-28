'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const voyageClips = [
  { src: '/assets/ship-flag.mp4', label: 'The Straw Hat flag' },
  { src: '/assets/ship-sailing.mp4', label: 'A ship crossing the Grand Line' },
];

type DepartureSceneProps = { onReturn: () => void };

export function DepartureScene({ onReturn }: DepartureSceneProps) {
  const [activeClip, setActiveClip] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  function advanceVoyage() {
    if (activeClip < voyageClips.length - 1) {
      setActiveClip((clip) => clip + 1);
    } else {
      setIsComplete(true);
    }
  }

  return (
    <motion.main
      className="departure-scene"
      aria-label="Grand Line departure"
      initial={{ opacity: 0, scale: 1.025 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence mode="sync" initial={false}>
        {!isComplete && (
          <motion.video
            key={voyageClips[activeClip].src}
            className="departure-video"
            src={voyageClips[activeClip].src}
            aria-label={voyageClips[activeClip].label}
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            onEnded={advanceVoyage}
            onError={() => setIsComplete(true)}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <div className="departure-scrim" aria-hidden="true" />
      <div className="departure-grain" aria-hidden="true" />

      <header className="departure-header">
        <div className="departure-brand"><span>☠</span> GRAND LINE <i>|</i> LOG 001</div>
        <button className="departure-audio" type="button" onClick={() => setIsMuted((muted) => !muted)}>
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          {isMuted ? 'SOUND OFF' : 'SOUND ON'}
        </button>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={isComplete ? 'arrived' : voyageClips[activeClip].src}
          className="departure-copy"
          initial={{ opacity: 0, y: 18, filter: 'blur(7px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(5px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="departure-overline"><span /> THE VOYAGE BEGINS</p>
          <h1>{isComplete ? 'THE GRAND LINE\nAWAITS' : 'WELCOME\nABOARD'}</h1>
          {isComplete && (
            <p className="departure-caption">YOUR CREW IS WAITING, CAPTAIN.</p>
          )}
          <div className="departure-actions">
            {isComplete ? (
              <>
                <button
                  className="departure-primary"
                  type="button"
                  onClick={() => {
                    try {
                      sessionStorage.setItem('grand-line-auth', 'true');
                      localStorage.setItem('grand-line-auth', 'true');
                    } catch {}
                    window.location.assign(new URL('/index.html', window.location.href).toString());
                  }}
                >
                  <ArrowRight size={18} /> OPEN EXPENSE CALCULATOR
                </button>
                <button className="departure-secondary" type="button" onClick={() => { setActiveClip(0); setIsComplete(false); }}>
                  <RotateCcw size={18} /> REPLAY VOYAGE
                </button>
              </>
            ) : (
              <button
                className="departure-secondary"
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.setItem('grand-line-auth', 'true');
                    localStorage.setItem('grand-line-auth', 'true');
                  } catch {}
                  setIsComplete(true);
                }}
              >
                SKIP VOYAGE
              </button>
            )}
            <button className="departure-secondary" type="button" onClick={onReturn}>
              <ArrowLeft size={18} /> BACK TO LOGIN
            </button>
          </div>
        </motion.section>
      </AnimatePresence>

      {!isComplete && (
        <div className="voyage-progress" aria-label={`Clip ${activeClip + 1} of ${voyageClips.length}`}>
          {voyageClips.map((clip, index) => (
            <span key={clip.src} className={index <= activeClip ? 'is-active' : ''} />
          ))}
          <span className="voyage-progress-label">{String(activeClip + 1).padStart(2, '0')} / 02</span>
        </div>
      )}
    </motion.main>
  );
}