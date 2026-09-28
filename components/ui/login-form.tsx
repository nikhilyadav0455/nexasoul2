'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoginFormProps = { accent: string; onSuccess: () => void };

export function LoginForm({ accent, onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setIsComplete(true);
      window.setTimeout(() => {
        try {
          sessionStorage.setItem('grand-line-auth', 'true');
          localStorage.setItem('grand-line-auth', 'true');
        } catch {}
        onSuccess();
      }, 600);
    }, 850);
  }

  function handleGoogleLogin() {
    setNotice('');
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setIsComplete(true);
      window.setTimeout(() => {
        try {
          sessionStorage.setItem('grand-line-auth', 'true');
          localStorage.setItem('grand-line-auth', 'true');
        } catch {}
        onSuccess();
      }, 600);
    }, 700);
  }

  function showNotice(message: string) {
    setNotice(message);
  }

  return (
    <motion.section
      className="login-card"
      style={{ '--character-accent': accent } as React.CSSProperties}
      initial={{ opacity: 0, x: 36, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(event) => {
        event.currentTarget.style.setProperty('--card-shift-y', '-2px');
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty('--card-shift-y', '0px');
      }}
    >
      <div className="card-topline">
        <div className="mini-skull">☠</div>
        <div>
          <p className="card-brand">GRAND LINE</p>
          <p className="card-subbrand">ENTER THE NEW WORLD</p>
        </div>
      </div>

      <div className="form-heading">
        <p className="form-overline"><span /> CREW ACCESS</p>
        <h1>WELCOME,<br /><span>PIRATE</span></h1>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="pirate-email">EMAIL ADDRESS</label>
        <div className="input-shell">
          <Mail size={17} aria-hidden="true" />
          <input
            id="pirate-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="captain@grandline.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="password-label-row">
          <label className="field-label" htmlFor="pirate-password">PASSWORD</label>
          <button className="text-link" type="button" onClick={() => showNotice('Password recovery is ready to connect to your crew account.')}>FORGOT PASSWORD?</button>
        </div>
        <div className="input-shell">
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            id="pirate-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="At least 8 characters"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            className="visibility-button"
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        <div className="form-options">
          <label className="remember-label">
            <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
            <span className="custom-check" />
            Remember me
          </label>
          <span className="security-note"><span /> SECURE CHANNEL</span>
        </div>

        <AnimatePresence mode="wait">
          {notice && (
            <motion.p className="form-notice" role="status" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {notice}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          className={cn('sail-button', isComplete && 'is-complete')}
          type="submit"
          disabled={isLoading || isComplete}
          whileHover={!isLoading && !isComplete ? { filter: 'brightness(1.08)' } : undefined}
          whileTap={!isLoading && !isComplete ? { filter: 'brightness(.94)' } : undefined}
        >
          <span>{isLoading ? 'SETTING SAIL...' : isComplete ? 'WELCOME ABOARD' : 'SET SAIL'}</span>
          {!isLoading && <span className="sail-arrow" aria-hidden="true">↗</span>}
          {isLoading && <span className="loading-mark" aria-hidden="true" />}
        </motion.button>
      </form>

      <div className="divider"><span /> OR CHART A DIFFERENT COURSE <span /></div>

      <motion.button
        className="google-button"
        type="button"
        disabled={isLoading || isComplete}
        whileHover={!isLoading && !isComplete ? { y: -1, borderColor: 'rgba(255,255,255,.28)' } : undefined}
        whileTap={!isLoading && !isComplete ? { scale: 0.99 } : undefined}
        onClick={handleGoogleLogin}
      >
        <span className="google-mark" aria-hidden="true">G</span>
        Continue with Google
      </motion.button>

      <p className="join-crew">Don&apos;t have an account? <button type="button" onClick={() => showNotice('Crew recruitment is open. Account creation can be connected here.')}>Join the Crew <span aria-hidden="true">→</span></button></p>
    </motion.section>
  );
}