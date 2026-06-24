'use client';
import { useState, useEffect } from 'react';

export default function CopingPage() {
  const [breathPhase, setBreathPhase] = useState('ready');
  const [isRunning, setIsRunning] = useState(false);
  const [groundStep, setGroundStep] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // Load saved journal from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('teen-journal');
    if (saved) setJournalText(saved);
  }, []);

  // Auto-save journal as user types
  const handleJournalChange = (e) => {
    setJournalText(e.target.value);
    localStorage.setItem('teen-journal', e.target.value);
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2000);
  };

  const groundingSteps = [
    { num: 5, sense: "SEE", instruction: "Name 5 things you can see right now.", emoji: "👁️" },
    { num: 4, sense: "TOUCH", instruction: "Name 4 things you can physically feel.", emoji: "✋" },
    { num: 3, sense: "HEAR", instruction: "Name 3 things you can hear.", emoji: "👂" },
    { num: 2, sense: "SMELL", instruction: "Name 2 things you can smell.", emoji: "👃" },
    { num: 1, sense: "TASTE", instruction: "Name 1 thing you can taste.", emoji: "👅" },
  ];

  const phaseConfig = {
    ready:  { label: 'Press Start to Begin', scale: '1',   bg: 'var(--surface-color)', border: '3px solid var(--accent)' },
    inhale: { label: '😮‍💨 Breathe IN...', scale: '1.2', bg: '#0D9488', border: 'none' },
    hold:   { label: '🤐 Hold...', scale: '1.2', bg: '#0f766e', border: 'none' },
    exhale: { label: '💨 Breathe OUT...', scale: '0.85', bg: '#134e4a', border: 'none' },
    hold2:  { label: '🤐 Hold...', scale: '0.85', bg: '#0f766e', border: 'none' },
  };

  const startBreathing = () => {
    if (isRunning) return;
    setIsRunning(true);
    const sequence = [
      { phase: 'inhale', duration: 4000 },
      { phase: 'hold',   duration: 7000 },
      { phase: 'exhale', duration: 8000 },
      { phase: 'hold2',  duration: 1000 },
    ];
    let i = 0;
    const next = () => {
      const current = sequence[i % sequence.length];
      setBreathPhase(current.phase);
      setTimeout(next, current.duration);
      i++;
    };
    next();
  };

  const cfg = phaseConfig[breathPhase] || phaseConfig.ready;

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>🧘 Coping Tools</h1>
          <p className="page-subtitle">
            Quick, science-backed techniques to calm your mind in minutes.
          </p>
        </div>

        {/* Box Breathing */}
        <section className="tool-section glass-card">
          <h2>🌬️ Box Breathing (4-7-8 Technique)</h2>
          <p className="tool-desc">
            Used by athletes and therapists. Takes 60 seconds. Works instantly on anxiety.
          </p>
          <div
            className="breath-circle"
            style={{
              backgroundColor: cfg.bg,
              transform: `scale(${cfg.scale})`,
              border: cfg.border,
              color: breathPhase === 'ready' ? 'var(--text-primary)' : 'white',
            }}
          >
            <span>{cfg.label}</span>
          </div>
          <div className="breath-guide">
            <span className={breathPhase === 'inhale' ? 'active-phase' : ''}>Inhale 4s</span>
            <span>→</span>
            <span className={breathPhase === 'hold' ? 'active-phase' : ''}>Hold 7s</span>
            <span>→</span>
            <span className={breathPhase === 'exhale' ? 'active-phase' : ''}>Exhale 8s</span>
          </div>
          {!isRunning && (
            <button className="tool-btn" onClick={startBreathing}>
              Start Breathing Exercise
            </button>
          )}
          {isRunning && (
            <button className="tool-btn-outline" onClick={() => { setIsRunning(false); setBreathPhase('ready'); }}>
              Stop
            </button>
          )}
        </section>

        {/* Grounding */}
        <section className="tool-section glass-card">
          <h2>⚓ 5-4-3-2-1 Grounding</h2>
          <p className="tool-desc">
            Instantly pulls you out of anxiety and back into the present moment. Click each step.
          </p>
          <div className="grounding-steps">
            {groundingSteps.map((step, i) => (
              <div
                key={i}
                className={`ground-step ${groundStep > i ? 'done' : ''} ${groundStep === i ? 'active' : ''}`}
                onClick={() => setGroundStep(Math.max(groundStep, i + 1))}
              >
                <span className="ground-emoji">{step.emoji}</span>
                <span className="ground-num">{step.num}</span>
                <div className="ground-text">
                  <span className="ground-sense">{step.sense}</span>
                  <p className="ground-instruction">{step.instruction}</p>
                </div>
                {groundStep > i && <span className="check">✓</span>}
              </div>
            ))}
          </div>
          {groundStep >= 5 && (
            <div className="grounding-done">
              <p>✅ You did it! You're grounded now.</p>
              <button className="tool-btn-outline" style={{marginTop:'1rem'}} onClick={() => setGroundStep(0)}>Reset</button>
            </div>
          )}
        </section>

        {/* Journal */}
        <section className="tool-section glass-card">
          <div className="journal-header">
            <h2>📓 Daily Journal Prompt</h2>
            {journalSaved && <span className="saved-badge">✓ Saved</span>}
          </div>
          <p className="tool-desc">Write for 5 minutes. It saves automatically in your browser only — no one else can read it.</p>
          <div className="prompt-box">
            <p>"What is one small thing that made today slightly better — even if it was tiny?"</p>
          </div>
          <textarea
            className="journal-textarea"
            placeholder="Start writing here... it stays in your browser only."
            rows={6}
            value={journalText}
            onChange={handleJournalChange}
          />
          <p className="journal-privacy">🔒 Your journal is stored only on your device. We never see it.</p>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .page-container { padding: 4rem 0; }
        .page-header { text-align: center; margin-bottom: 3rem; }
        .page-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
        .page-subtitle { color: var(--text-secondary); font-size: 1.1rem; max-width: 600px; margin: 0 auto; }

        .tool-section { padding: 2.5rem; margin-bottom: 2rem; }
        .tool-section h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.75rem; }
        .tool-desc { color: var(--text-secondary); margin-bottom: 2rem; }

        .breath-circle {
          width: 200px; height: 200px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 1rem; font-weight: 600; text-align: center; padding: 1rem;
          transition: background-color 2s ease, transform 2s ease;
        }
        .breath-guide {
          display: flex; justify-content: center; gap: 1rem;
          margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.9rem;
        }
        .active-phase { color: var(--accent); font-weight: 700; }

        .tool-btn {
          display: block; margin: 0 auto;
          background-color: var(--accent); color: white;
          padding: 0.9rem 2rem; border-radius: 9999px;
          font-size: 1rem; font-weight: 600;
          transition: opacity 0.2s, transform 0.2s;
        }
        .tool-btn:hover { opacity: 0.85; transform: translateY(-2px); }
        .tool-btn-outline {
          display: block; margin: 0 auto;
          background: transparent; color: var(--accent);
          border: 2px solid var(--accent);
          padding: 0.7rem 1.8rem; border-radius: 9999px;
          font-size: 0.95rem; font-weight: 600;
          transition: all 0.2s;
        }
        .tool-btn-outline:hover { background-color: var(--accent); color: white; }

        .grounding-steps { display: flex; flex-direction: column; gap: 0.75rem; }
        .ground-step {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.5rem; border-radius: 12px;
          border: 1px solid var(--border-color); cursor: pointer;
          transition: all 0.25s; background-color: var(--bg-color);
        }
        .ground-step.active { border-color: var(--accent); background-color: var(--surface-color); }
        .ground-step.done { opacity: 0.45; }
        .ground-emoji { font-size: 1.5rem; }
        .ground-num { font-size: 2rem; font-weight: 700; color: var(--accent); min-width: 36px; }
        .ground-text { flex: 1; }
        .ground-sense { font-weight: 700; font-size: 0.85rem; display: block; }
        .ground-instruction { color: var(--text-secondary); font-size: 0.9rem; }
        .check { color: var(--accent); font-size: 1.2rem; font-weight: 700; }
        .grounding-done { text-align: center; margin-top: 1.5rem; font-weight: 600; color: var(--accent); font-size: 1.1rem; }

        .journal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .journal-header h2 { margin-bottom: 0; }
        .saved-badge {
          background-color: var(--accent); color: white;
          padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;
        }
        .prompt-box {
          background-color: var(--bg-color);
          border-left: 4px solid var(--accent);
          padding: 1.25rem 1.5rem; border-radius: 8px;
          font-size: 1.05rem; font-style: italic; margin-bottom: 1rem;
          color: var(--text-primary);
        }
        .journal-textarea {
          width: 100%; background-color: var(--bg-color);
          border: 1px solid var(--border-color); border-radius: 12px;
          padding: 1rem; font-family: inherit; font-size: 1rem;
          color: var(--text-primary); resize: vertical; outline: none;
          transition: border-color 0.2s; margin-bottom: 0.75rem;
        }
        .journal-textarea:focus { border-color: var(--accent); }
        .journal-privacy { font-size: 0.8rem; color: var(--text-secondary); }
      `}} />
    </div>
  );
}
