'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const moods = [
  { id: 'anxious',  emoji: '🌪️', title: 'Anxious',     desc: 'Mind racing, overwhelmed',    message: "I've been feeling really anxious and overwhelmed lately. My mind won't stop racing." },
  { id: 'stressed', emoji: '📚', title: 'Stressed',    desc: 'Too much going on',            message: "I'm really stressed right now. There's just too much going on and I can't handle it all." },
  { id: 'lonely',   emoji: '🌧️', title: 'Lonely',      desc: 'Feeling disconnected',         message: "I'm feeling really lonely and disconnected. Like no one really understands me." },
  { id: 'okay',     emoji: '✨', title: 'Pretty Okay', desc: 'Just doing a check-in',        message: "I'm doing okay today, just wanted to check in and talk a bit." },
];

export default function Home() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.id);
    setTimeout(() => {
      router.push(`/chat?mood=${mood.id}&message=${encodeURIComponent(mood.message)}`);
    }, 600);
  };

  return (
    <div className="home-container">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            Your Safe Space to <br />
            <span className="text-accent">Breathe &amp; Reset</span>
          </h1>
          <p className="hero-subtitle">
            School, friends, life... it gets overwhelming. We're here to help you untangle the mess — totally jargon-free and zero pressure. You got this.
          </p>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={() => router.push('/chat')}>Talk to Someone</button>
            <button className="cta-secondary" onClick={() => router.push('/helplines')}>Crisis Helplines</button>
          </div>
        </div>
      </section>

      {/* Mood Check */}
      <section id="mood-check" className="mood-section">
        <div className="container">
          <h2 className="mood-heading">How are you feeling today?</h2>
          <p className="mood-subheading">Tap what matches your vibe — we'll open a chat that fits how you feel.</p>
          <div className="mood-grid">
            {moods.map((mood) => (
              <button
                key={mood.id}
                className={`mood-card glass-card ${selectedMood === mood.id ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood)}
              >
                <div className="mood-emoji">{mood.emoji}</div>
                <h3 className="mood-title">{mood.title}</h3>
                <p className="mood-desc">{mood.desc}</p>
                {selectedMood === mood.id && <div className="mood-loading">Opening chat... 💙</div>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .home-container { padding-bottom: 4rem; }
        .hero { padding: 6rem 0 4rem 0; text-align: center; }
        .hero-content { max-width: 800px; margin: 0 auto; }
        .hero-title { font-size: 3.5rem; font-weight: 700; margin-bottom: 1.5rem; line-height: 1.2; }
        .text-accent { color: var(--accent); }
        .hero-subtitle { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }
        .cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .cta-primary { background-color: var(--accent); color: white; padding: 1rem 2rem; border-radius: 9999px; font-size: 1.1rem; font-weight: 600; transition: transform 0.2s, opacity 0.2s; }
        .cta-primary:hover { opacity: 0.9; transform: translateY(-2px); }
        .cta-secondary { background-color: transparent; color: var(--text-primary); border: 2px solid var(--border-color); padding: 1rem 2rem; border-radius: 9999px; font-size: 1.1rem; font-weight: 600; transition: transform 0.2s, border-color 0.2s; }
        .cta-secondary:hover { border-color: var(--accent); transform: translateY(-2px); }

        .mood-section { padding: 4rem 0; text-align: center; }
        .mood-heading { font-size: 2rem; margin-bottom: 0.5rem; }
        .mood-subheading { color: var(--text-secondary); margin-bottom: 3rem; }
        .mood-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
        .mood-card {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 3rem 2rem; cursor: pointer; text-align: center; background: none;
          width: 100%; font-family: inherit;
          transition: all 0.25s ease;
        }
        .mood-card.selected { border-color: var(--accent) !important; }
        .mood-emoji { font-size: 4rem; margin-bottom: 1rem; transition: transform 0.2s; }
        .mood-card:hover .mood-emoji { transform: scale(1.1) rotate(5deg); }
        .mood-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary); }
        .mood-desc { font-size: 0.9rem; color: var(--text-secondary); }
        .mood-loading { margin-top: 1rem; font-size: 0.85rem; color: var(--accent); font-weight: 600; animation: pulse 1s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        @media (max-width: 600px) {
          .hero-title { font-size: 2.2rem; }
          .cta-buttons { flex-direction: column; max-width: 300px; margin: 0 auto; }
        }
      `}} />
    </div>
  );
}
