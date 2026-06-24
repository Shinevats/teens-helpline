'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('teen-helpline-auth');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="page-container" style={{textAlign:'center'}}>Loading dashboard...</div>;
  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="container">
        {user.role === 'teen' ? <TeenDashboard user={user} /> : <AdultDashboard user={user} />}
      </div>
      <DashboardStyles />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEEN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function TeenDashboard({ user }) {
  const [bookingType, setBookingType] = useState('counseling'); // 'counseling' or 'tuition'
  const [subject, setSubject] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingStatus('sending');
    setTimeout(() => {
      setBookingStatus('success');
      setTimeout(() => setBookingStatus(''), 4000);
      setSubject('');
    }, 1500);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header">
        <h1>Welcome, {user.username} 💙</h1>
        <p>This is your private dashboard. Book a session or access your tools.</p>
      </div>

      <div className="dash-grid">
        {/* Left Column: Booking */}
        <div className="dash-card glass-card">
          <h2>📅 Book a Session</h2>
          <p className="card-sub">Request a free, private session with a verified counselor or tutor.</p>
          
          <div className="booking-tabs">
            <button 
              className={`tab-btn ${bookingType === 'counseling' ? 'active' : ''}`}
              onClick={() => setBookingType('counseling')}
            >
              Mental Health Counseling
            </button>
            <button 
              className={`tab-btn ${bookingType === 'tuition' ? 'active' : ''}`}
              onClick={() => setBookingType('tuition')}
            >
              Subject Tuitions
            </button>
          </div>

          <form onSubmit={handleBooking} className="booking-form">
            {bookingType === 'counseling' ? (
              <div className="input-group">
                <label>What do you need help with?</label>
                <select required>
                  <option value="">Select a topic...</option>
                  <option value="stress">School/Exam Stress</option>
                  <option value="family">Family Issues</option>
                  <option value="friends">Friendship / Peer Pressure</option>
                  <option value="bullying">Bullying</option>
                  <option value="other">Something Else</option>
                </select>
              </div>
            ) : (
              <div className="input-group">
                <label>Which subject do you need help with?</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10th Grade Math, Physics..." 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required 
                />
              </div>
            )}
            
            <div className="input-group">
              <label>Preferred Time</label>
              <select required>
                <option value="">Select a time...</option>
                <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                <option value="evening">Evening (5 PM - 8 PM)</option>
                <option value="night">Night (8 PM - 10 PM)</option>
              </select>
            </div>

            <button type="submit" className="primary-btn" disabled={bookingStatus === 'sending'}>
              {bookingStatus === 'sending' ? 'Sending Request...' : 'Submit Request'}
            </button>
            
            {bookingStatus === 'success' && (
              <div className="success-msg">
                ✅ Request received! We will match you and notify you here soon.
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Quick Links */}
        <div className="dash-sidebar">
          <div className="dash-card glass-card">
            <h3>Your Tools</h3>
            <ul className="quick-links">
              <li><Link href="/journal">📓 Open Private Journal</Link></li>
              <li><Link href="/community">🌍 Visit Community Wall</Link></li>
              <li><Link href="/chat">💬 Chat with Aanya (AI)</Link></li>
            </ul>
          </div>
          
          <div className="dash-card glass-card stats-card">
            <h3>Your Privacy Status</h3>
            <p className="privacy-badge">🔒 Fully Anonymous</p>
            <p className="privacy-desc">Your real name and email are completely hidden. You are safe here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADULT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function AdultDashboard({ user }) {
  // Read actual points from localStorage
  const points = user.points || 0;
  
  return (
    <div className="dashboard-wrapper">
      <div className="dash-header">
        <h1>Welcome back, {user.username} ⭐</h1>
        <p>Thank you for making a difference in the lives of teens today.</p>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-box glass-card">
          <div className="stat-icon">🌟</div>
          <div className="stat-info">
            <h4>Karma Points</h4>
            <span className="stat-val">{points}</span>
          </div>
        </div>
        <div className="stat-box glass-card">
          <div className="stat-icon">💙</div>
          <div className="stat-info">
            <h4>Teens Helped</h4>
            <span className="stat-val">{Math.floor(points / 10)}</span>
          </div>
        </div>
        <div className="stat-box glass-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <h4>Current Level</h4>
            <span className="stat-val">Mentor</span>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Left: Actions */}
        <div className="dash-card glass-card">
          <h2>How to Earn Points</h2>
          <p className="card-sub">Every positive interaction helps a teen and earns you Karma Points.</p>
          
          <div className="action-list">
            <div className="action-item">
              <span className="action-points">+10 pts</span>
              <div>
                <strong>Reply on the Community Wall</strong>
                <p>Give advice or a listening ear to an anonymous teen.</p>
              </div>
              <Link href="/community" className="action-btn">Go to Wall</Link>
            </div>
            <div className="action-item">
              <span className="action-points">+50 pts</span>
              <div>
                <strong>Take a Counseling Session</strong>
                <p>Spend 30 minutes video/audio chatting with a teen in need.</p>
              </div>
              <button className="action-btn disabled">Coming Soon</button>
            </div>
            <div className="action-item">
              <span className="action-points">+100 pts</span>
              <div>
                <strong>Teach a Subject Tuition</strong>
                <p>Help a stressed student understand a difficult topic.</p>
              </div>
              <button className="action-btn disabled">Coming Soon</button>
            </div>
          </div>
        </div>

        {/* Right: Perks */}
        <div className="dash-card glass-card">
          <h2>Unlock Perks</h2>
          <p className="card-sub">Redeem your Karma Points for exclusive rewards.</p>
          
          <div className="perk-list">
            <div className={`perk-item ${points >= 50 ? 'unlocked' : 'locked'}`}>
              <div className="perk-icon">📜</div>
              <div className="perk-info">
                <strong>Digital Certificate</strong>
                <p>50 Points required</p>
              </div>
              {points >= 50 ? <button className="claim-btn">Claim</button> : <span className="lock">🔒</span>}
            </div>
            
            <div className={`perk-item ${points >= 150 ? 'unlocked' : 'locked'}`}>
              <div className="perk-icon">☕</div>
              <div className="perk-info">
                <strong>Starbucks Gift Card ($5)</strong>
                <p>150 Points required</p>
              </div>
              {points >= 150 ? <button className="claim-btn">Claim</button> : <span className="lock">🔒</span>}
            </div>
            
            <div className={`perk-item ${points >= 500 ? 'unlocked' : 'locked'}`}>
              <div className="perk-icon">🎓</div>
              <div className="perk-info">
                <strong>LinkedIn 'Verified Counselor' Badge</strong>
                <p>500 Points required</p>
              </div>
              {points >= 500 ? <button className="claim-btn">Claim</button> : <span className="lock">🔒</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global styles for both dashboards
export function DashboardStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      .dashboard-page { padding: 4rem 0 5rem; min-height: 85vh; }
      .dash-header { margin-bottom: 2.5rem; }
      .dash-header h1 { font-size: 2.2rem; margin-bottom: 0.5rem; }
      .dash-header p { color: var(--text-secondary); font-size: 1.1rem; }
      
      .dash-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
      .dash-card { padding: 2rem; display: flex; flex-direction: column; }
      .dash-card h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
      .dash-card h3 { font-size: 1.25rem; margin-bottom: 1rem; }
      .card-sub { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem; }

      /* Teen Booking form */
      .booking-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; }
      .tab-btn { background: none; border: none; font-size: 1rem; font-weight: 600; color: var(--text-secondary); cursor: pointer; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.2s; }
      .tab-btn:hover { background: var(--bg-color); }
      .tab-btn.active { color: var(--accent); background: var(--surface-color); }
      
      .booking-form .input-group { margin-bottom: 1.25rem; }
      .booking-form label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary); }
      .booking-form select, .booking-form input {
        width: 100%; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);
        background: var(--bg-color); color: var(--text-primary); font-family: inherit; font-size: 0.95rem;
      }
      .booking-form select:focus, .booking-form input:focus { border-color: var(--accent); outline: none; }
      .primary-btn { background: var(--accent); color: white; border: none; padding: 0.85rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; width: 100%; transition: opacity 0.2s; }
      .primary-btn:hover:not(:disabled) { opacity: 0.85; }
      .primary-btn:disabled { opacity: 0.6; cursor: wait; }
      .success-msg { margin-top: 1rem; padding: 1rem; background: rgba(34, 197, 94, 0.1); color: #16a34a; border-radius: 8px; font-weight: 600; text-align: center; }

      /* Teen Sidebar */
      .dash-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
      .quick-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
      .quick-links a { display: block; padding: 0.85rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; font-weight: 500; transition: all 0.2s; }
      .quick-links a:hover { border-color: var(--accent); color: var(--accent); transform: translateX(4px); }
      .privacy-badge { display: inline-block; background: rgba(34, 197, 94, 0.15); color: #16a34a; padding: 0.4rem 0.8rem; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.75rem; }
      .privacy-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }

      /* Adult Stats */
      .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
      .stat-box { padding: 1.5rem; display: flex; align-items: center; gap: 1rem; }
      .stat-icon { font-size: 2.5rem; }
      .stat-info h4 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.25rem; }
      .stat-val { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); }

      /* Adult Action & Perk Lists */
      .action-list, .perk-list { display: flex; flex-direction: column; gap: 1rem; }
      .action-item { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; }
      .action-points { background: rgba(245, 158, 11, 0.15); color: #d97706; padding: 0.4rem 0.75rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; white-space: nowrap; }
      .action-item strong { display: block; font-size: 1.05rem; margin-bottom: 0.25rem; }
      .action-item p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
      .action-btn { margin-left: auto; padding: 0.5rem 1rem; background: var(--surface-color); border: 1px solid var(--accent); color: var(--accent); border-radius: 6px; font-weight: 600; font-size: 0.85rem; text-decoration: none; transition: all 0.2s; white-space: nowrap; }
      .action-btn:hover:not(.disabled) { background: var(--accent); color: white; }
      .action-btn.disabled { opacity: 0.5; border-color: var(--border-color); color: var(--text-secondary); cursor: not-allowed; }

      .perk-item { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border: 1px solid var(--border-color); border-radius: 12px; transition: all 0.2s; }
      .perk-item.unlocked { background: var(--surface-color); border-color: var(--accent); }
      .perk-item.locked { background: var(--bg-color); opacity: 0.7; }
      .perk-icon { font-size: 1.8rem; }
      .perk-info { flex: 1; }
      .perk-info strong { display: block; font-size: 1.05rem; margin-bottom: 0.25rem; }
      .perk-info p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
      .claim-btn { padding: 0.5rem 1rem; background: var(--accent); color: white; border: none; border-radius: 6px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: opacity 0.2s; }
      .claim-btn:hover { opacity: 0.85; }
      .lock { font-size: 1.25rem; color: var(--text-secondary); padding-right: 0.5rem; }

      @media (max-width: 800px) {
        .dash-grid { grid-template-columns: 1fr; }
        .stats-row { grid-template-columns: 1fr; gap: 1rem; }
        .action-item { flex-direction: column; align-items: flex-start; }
        .action-btn { margin-left: 0; margin-top: 0.5rem; width: 100%; text-align: center; }
      }
    `}} />
  );
}
