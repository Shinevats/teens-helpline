'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState('select'); // 'select', 'teen', 'adult'
  
  // Teen state
  const [nickname, setNickname] = useState('');
  
  // Adult state
  const [adultMethod, setAdultMethod] = useState(''); // 'google', 'aadhar'
  const [adultName, setAdultName] = useState('');
  const [simulatingAuth, setSimulatingAuth] = useState(false);

  const handleTeenLogin = () => {
    if (!nickname.trim()) return;
    localStorage.setItem('teen-helpline-auth', JSON.stringify({
      role: 'teen',
      username: nickname.trim(),
      points: 0
    }));
    window.location.href = '/dashboard'; // Force full reload to update navbar
  };

  const handleAdultLogin = (e) => {
    e.preventDefault();
    if (!adultName.trim()) return;
    setSimulatingAuth(true);
    
    // Simulate API call for Google/Aadhar verification
    setTimeout(() => {
      localStorage.setItem('teen-helpline-auth', JSON.stringify({
        role: 'adult',
        username: adultName.trim(),
        points: 0 // Adults earn points
      }));
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-wrapper glass-card">
          
          {view === 'select' && (
            <div className="select-view">
              <h1>Who is logging in?</h1>
              <p className="subtitle">Choose your portal to continue safely.</p>
              
              <div className="role-options">
                <button className="role-btn teen-btn" onClick={() => setView('teen')}>
                  <div className="role-icon">👤</div>
                  <h3>I'm a Teen</h3>
                  <p>Get help, post anonymously, and access your private journal.</p>
                </button>
                
                <button className="role-btn adult-btn" onClick={() => setView('adult')}>
                  <div className="role-icon">⭐</div>
                  <h3>I'm an Adult / Counselor</h3>
                  <p>Provide support, earn karma points, and guide teens safely.</p>
                </button>
              </div>
            </div>
          )}

          {view === 'teen' && (
            <div className="teen-view">
              <button className="back-btn" onClick={() => setView('select')}>← Back</button>
              <div className="login-header">
                <h2>Stay Anonymous</h2>
                <p>We don't need your real name or email. Just pick a nickname so you can keep track of your posts.</p>
              </div>
              
              <div className="input-group">
                <label>Pick a Nickname</label>
                <input 
                  type="text" 
                  placeholder="e.g. StarGazer99" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTeenLogin()}
                />
              </div>
              
              <button 
                className={`primary-btn ${!nickname.trim() ? 'disabled' : ''}`}
                onClick={handleTeenLogin}
                disabled={!nickname.trim()}
              >
                Enter Safe Space
              </button>
            </div>
          )}

          {view === 'adult' && (
            <div className="adult-view">
              <button className="back-btn" onClick={() => setView('select')}>← Back</button>
              <div className="login-header">
                <h2>Adult Verification</h2>
                <p>To keep this space safe for teens, adults must verify their identity.</p>
              </div>
              
              {!adultMethod ? (
                <div className="auth-methods">
                  <button className="auth-btn google" onClick={() => setAdultMethod('google')}>
                    <span className="auth-icon">G</span> Continue with Google
                  </button>
                  <button className="auth-btn aadhar" onClick={() => setAdultMethod('aadhar')}>
                    <span className="auth-icon">🏛️</span> Verify with Aadhar
                  </button>
                </div>
              ) : (
                <form className="mock-auth-form" onSubmit={handleAdultLogin}>
                  <p className="auth-context">
                    Simulating {adultMethod === 'google' ? 'Google' : 'Aadhar'} Verification...
                  </p>
                  <div className="input-group">
                    <label>Your Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Sarah Miller" 
                      value={adultName}
                      onChange={(e) => setAdultName(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="primary-btn"
                    disabled={simulatingAuth || !adultName.trim()}
                  >
                    {simulatingAuth ? 'Verifying Identity...' : 'Secure Login'}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .login-page { padding: 4rem 1rem; min-height: 80vh; display: flex; align-items: center; justify-content: center; }
        .login-wrapper { max-width: 600px; width: 100%; padding: 3rem; text-align: center; }
        
        .select-view h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-secondary); margin-bottom: 2.5rem; }
        
        .role-options { display: flex; flex-direction: column; gap: 1.5rem; }
        .role-btn {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 2rem; background: var(--bg-color); border: 2px solid var(--border-color);
          border-radius: 16px; cursor: pointer; transition: all 0.2s ease;
          font-family: inherit; color: var(--text-primary); text-align: center;
        }
        .role-btn:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .role-icon { font-size: 3rem; margin-bottom: 1rem; }
        .role-btn h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
        .role-btn p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }
        
        .back-btn { background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; display: block; text-align: left; }
        .back-btn:hover { color: var(--text-primary); }
        
        .login-header { margin-bottom: 2rem; }
        .login-header h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .login-header p { color: var(--text-secondary); font-size: 0.95rem; }
        
        .input-group { text-align: left; margin-bottom: 1.5rem; }
        .input-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
        .input-group input {
          width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);
          background: var(--bg-color); color: var(--text-primary); font-family: inherit;
          font-size: 1rem; transition: border-color 0.2s;
        }
        .input-group input:focus { border-color: var(--accent); outline: none; }
        
        .primary-btn {
          width: 100%; padding: 1rem; border-radius: 8px; background: var(--accent); color: white;
          font-weight: 700; font-size: 1.05rem; cursor: pointer; border: none; transition: opacity 0.2s, transform 0.2s;
        }
        .primary-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); }
        .primary-btn.disabled, .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-methods { display: flex; flex-direction: column; gap: 1rem; }
        .auth-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          padding: 1rem; border-radius: 8px; font-weight: 600; font-size: 1rem;
          cursor: pointer; border: 2px solid var(--border-color); background: var(--bg-color);
          color: var(--text-primary); transition: all 0.2s;
        }
        .auth-btn:hover { border-color: var(--accent); }
        .auth-icon { font-size: 1.25rem; font-weight: bold; }
        
        .auth-context { font-size: 0.85rem; color: var(--accent); font-weight: 600; margin-bottom: 1.5rem; padding: 0.5rem; background: var(--surface-color); border-radius: 6px; }

        @media (max-width: 600px) {
          .login-wrapper { padding: 2rem 1.5rem; }
          .role-options { flex-direction: column; }
        }
      `}} />
    </div>
  );
}
