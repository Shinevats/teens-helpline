const helplines = [
  {
    name: "iCall",
    number: "9152987821",
    desc: "Psychosocial helpline by TISS. Free, confidential.",
    hours: "Mon–Sat, 8am–10pm",
    emoji: "📞",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    desc: "24/7 mental health support in multiple languages.",
    hours: "24 hours, 7 days",
    emoji: "🌙",
  },
  {
    name: "AASRA",
    number: "9820466627",
    desc: "For people in emotional distress and suicidal crisis.",
    hours: "24 hours, 7 days",
    emoji: "🤝",
  },
  {
    name: "Snehi",
    number: "044-24640050",
    desc: "Emotional support and suicide prevention helpline.",
    hours: "24 hours, 7 days",
    emoji: "💛",
  },
  {
    name: "Mann Talks",
    number: "8686139139",
    desc: "Mental health helpline for teens and young adults.",
    hours: "Mon–Sat, 10am–6pm",
    emoji: "🧠",
  },
  {
    name: "National Emergency",
    number: "112",
    desc: "If you or someone is in immediate danger, call now.",
    hours: "24 hours, 7 days",
    emoji: "🚨",
  },
];

export default function HelplinesPage() {
  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>📞 Crisis Helplines</h1>
          <p className="page-subtitle">
            If you need to talk to a real person right now — here are the numbers.
            All calls are free and confidential.
          </p>
        </div>

        <div className="helplines-grid">
          {helplines.map((h, i) => (
            <div key={i} className="helpline-card glass-card">
              <div className="helpline-emoji">{h.emoji}</div>
              <h3 className="helpline-name">{h.name}</h3>
              <p className="helpline-desc">{h.desc}</p>
              <p className="helpline-hours">🕐 {h.hours}</p>
              <a href={`tel:${h.number}`} className="helpline-number">
                {h.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .page-container { padding: 4rem 0; }
        .page-header { text-align: center; margin-bottom: 3rem; }
        .page-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
        .page-subtitle { color: var(--text-secondary); font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
        .helplines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .helpline-card { padding: 2rem; text-align: center; }
        .helpline-emoji { font-size: 2.5rem; margin-bottom: 1rem; }
        .helpline-name { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem; }
        .helpline-desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.75rem; }
        .helpline-hours { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; }
        .helpline-number {
          display: inline-block;
          background-color: var(--accent);
          color: white;
          padding: 0.7rem 1.5rem;
          border-radius: 9999px;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          transition: opacity 0.2s, transform 0.2s;
        }
        .helpline-number:hover { opacity: 0.85; transform: translateY(-2px); }
      `}} />
    </div>
  );
}
