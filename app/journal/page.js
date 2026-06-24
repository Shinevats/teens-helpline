'use client';
import { useEffect, useState } from 'react';

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('teen-journal-entries');
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  const saveEntry = () => {
    if (!body.trim()) return;
    const newEntry = {
      id: Date.now(),
      title: title.trim() || 'Untitled Entry',
      body: body.trim(),
      date: new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('teen-journal-entries', JSON.stringify(updated));
    setTitle('');
    setBody('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('teen-journal-entries', JSON.stringify(updated));
    if (openId === id) setOpenId(null);
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>📓 My Private Journal</h1>
          <p className="page-subtitle">
            Write what's on your mind. Your entries are saved only on your device — no one else can see them. Ever.
          </p>
          <p className="privacy-note">🔒 Stored locally in your browser only.</p>
        </div>

        {/* Write New Entry */}
        <div className="write-card glass-card">
          <h2>✏️ New Entry</h2>
          <input
            className="title-input"
            placeholder="Give it a title... (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="body-input"
            placeholder="What's on your mind today? What happened? How are you feeling? Write freely — this is just for you."
            rows={7}
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <div className="write-footer">
            <span className="char-count">{body.length} characters</span>
            <button
              className={`save-btn ${!body.trim() ? 'disabled' : ''}`}
              onClick={saveEntry}
              disabled={!body.trim()}
            >
              {saved ? '✓ Saved!' : 'Save Entry'}
            </button>
          </div>
        </div>

        {/* Saved Entries */}
        <div className="entries-section">
          <h2 className="entries-heading">
            📚 Your Entries
            <span className="entry-count">{entries.length}</span>
          </h2>

          {entries.length === 0 ? (
            <div className="empty-state glass-card">
              <p className="empty-emoji">🌱</p>
              <p>No entries yet. Write your first one above.</p>
              <p className="empty-sub">Your journey starts with one honest sentence.</p>
            </div>
          ) : (
            <div className="entries-list">
              {entries.map(entry => (
                <div key={entry.id} className="entry-card glass-card">
                  <div className="entry-header" onClick={() => setOpenId(openId === entry.id ? null : entry.id)}>
                    <div className="entry-meta">
                      <h3 className="entry-title">{entry.title}</h3>
                      <span className="entry-date">{entry.date} · {entry.time}</span>
                    </div>
                    <div className="entry-actions">
                      <button
                        className="delete-btn"
                        onClick={e => { e.stopPropagation(); deleteEntry(entry.id); }}
                        title="Delete entry"
                      >🗑️</button>
                      <span className="toggle-arrow">{openId === entry.id ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {openId === entry.id && (
                    <div className="entry-body">
                      {entry.body.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .page-container { padding: 4rem 0 5rem; }
        .page-header { text-align: center; margin-bottom: 2.5rem; }
        .page-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.75rem; }
        .page-subtitle { color: var(--text-secondary); font-size: 1.05rem; max-width: 580px; margin: 0 auto 0.5rem; }
        .privacy-note { font-size: 0.82rem; color: var(--accent); font-weight: 600; }

        .write-card { padding: 2rem; margin-bottom: 3rem; }
        .write-card h2 { font-size: 1.3rem; margin-bottom: 1.25rem; }
        .title-input {
          width: 100%; background: var(--bg-color); border: 1px solid var(--border-color);
          border-radius: 10px; padding: 0.75rem 1rem; font-family: inherit;
          font-size: 1.05rem; color: var(--text-primary); outline: none;
          margin-bottom: 0.75rem; transition: border-color 0.2s;
        }
        .title-input:focus { border-color: var(--accent); }
        .body-input {
          width: 100%; background: var(--bg-color); border: 1px solid var(--border-color);
          border-radius: 10px; padding: 1rem; font-family: inherit; font-size: 1rem;
          color: var(--text-primary); resize: vertical; outline: none;
          transition: border-color 0.2s; margin-bottom: 1rem; line-height: 1.7;
        }
        .body-input:focus { border-color: var(--accent); }
        .write-footer { display: flex; justify-content: space-between; align-items: center; }
        .char-count { font-size: 0.8rem; color: var(--text-secondary); }
        .save-btn {
          background: var(--accent); color: white; padding: 0.75rem 2rem;
          border-radius: 9999px; font-size: 0.95rem; font-weight: 600;
          transition: opacity 0.2s, transform 0.2s;
        }
        .save-btn:hover:not(.disabled) { opacity: 0.85; transform: translateY(-2px); }
        .save-btn.disabled { opacity: 0.4; cursor: not-allowed; }

        .entries-section {}
        .entries-heading {
          font-size: 1.4rem; font-weight: 700; margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .entry-count {
          background: var(--accent); color: white; font-size: 0.8rem;
          padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 700;
        }
        .entries-list { display: flex; flex-direction: column; gap: 1rem; }
        .entry-card { padding: 0; overflow: hidden; }
        .entry-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 1.5rem; cursor: pointer; transition: background-color 0.2s;
        }
        .entry-header:hover { background-color: var(--bg-color); }
        .entry-meta { flex: 1; }
        .entry-title { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.25rem; }
        .entry-date { font-size: 0.78rem; color: var(--text-secondary); }
        .entry-actions { display: flex; align-items: center; gap: 1rem; }
        .delete-btn { background: none; font-size: 1.1rem; opacity: 0.4; transition: opacity 0.2s; padding: 0.25rem; }
        .delete-btn:hover { opacity: 1; }
        .toggle-arrow { font-size: 0.75rem; color: var(--text-secondary); }
        .entry-body {
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid var(--border-color);
          color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem;
        }
        .entry-body p { margin-bottom: 0.5rem; }

        .empty-state { padding: 3rem; text-align: center; }
        .empty-emoji { font-size: 3rem; margin-bottom: 1rem; }
        .empty-sub { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem; }
      `}} />
    </div>
  );
}
