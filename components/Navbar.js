'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(t);
    
    // Check auth status
    const storedUser = localStorage.getItem('teen-helpline-auth');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pathname]); // Re-run auth check on path change just in case

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const handleLogout = () => {
    localStorage.removeItem('teen-helpline-auth');
    setUser(null);
    router.push('/');
  };

  const MAIN_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/community', label: 'Community' },
  ];

  const DROPDOWN_LINKS = [
    { href: '/chat', label: '💬 Chat with Aanya' },
    { href: '/journal', label: '📓 My Journal' },
    { href: '/resources', label: '📖 Resources' },
    { href: '/coping', label: '🧘 Coping Tools' },
    { href: '/helplines', label: '📞 Helplines' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/">Youth Helpline</Link>
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          {MAIN_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && (
            <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
          )}

          {/* Dropdown */}
          <div className="dropdown-container" ref={dropdownRef}>
            <button 
              className={`nav-link dropdown-btn ${DROPDOWN_LINKS.some(l => pathname === l.href) ? 'active' : ''}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Explore <span className="arrow">⌄</span>
            </button>
            {dropdownOpen && (
              <div 
                className="dropdown-menu glass-card"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {DROPDOWN_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="nav-right">
          {user ? (
            <div className="user-controls">
              <span className="welcome-text">
                Hi, {user.role === 'adult' ? '⭐' : '👤'} {user.username}
              </span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="login-btn">Log In</Link>
          )}

          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Hamburger for mobile */}
          <button className="hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu glass-card">
          {MAIN_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}
          <div className="mobile-divider">Explore</div>
          {DROPDOWN_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-link nested ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .navbar {
          background-color: var(--nav-bg);
          backdrop-filter: blur(10px);
          position: sticky; top: 0; z-index: 100;
          border-bottom: 1px solid var(--border-color);
        }
        .nav-container {
          max-width: 1200px; margin: 0 auto;
          padding: 0.85rem 2rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .nav-brand { font-weight: 700; font-size: 1.2rem; color: var(--accent); }
        .nav-links { display: flex; gap: 1.5rem; align-items: center; }
        .nav-link {
          font-size: 0.95rem; font-weight: 500; color: var(--text-secondary);
          padding: 0.5rem 0.85rem; border-radius: 8px;
          transition: color 0.2s, background-color 0.2s;
          cursor: pointer;
        }
        .nav-link:hover { color: var(--text-primary); background-color: var(--border-color); }
        .nav-link.active { color: var(--accent); font-weight: 600; }
        
        .dropdown-container { position: relative; }
        .dropdown-btn { background: none; border: none; font-family: inherit; display: flex; align-items: center; gap: 4px; }
        .arrow { font-size: 1.1rem; line-height: 0; position: relative; top: -2px; }
        .dropdown-menu {
          position: absolute; top: 100%; left: 0; min-width: 200px;
          display: flex; flex-direction: column; padding: 0.5rem;
          margin-top: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .dropdown-item {
          padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem;
          border-radius: 6px; transition: background 0.2s;
        }
        .dropdown-item:hover { background-color: var(--border-color); color: var(--accent); }

        .nav-right { display: flex; align-items: center; gap: 1rem; }
        
        .login-btn {
          background-color: var(--accent); color: white;
          padding: 0.4rem 1.2rem; border-radius: 9999px; font-size: 0.9rem; font-weight: 600;
          transition: opacity 0.2s;
        }
        .login-btn:hover { opacity: 0.85; }

        .user-controls { display: flex; align-items: center; gap: 1rem; }
        .welcome-text { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
        .logout-btn {
          background: transparent; color: var(--text-secondary); font-size: 0.85rem;
          border: 1px solid var(--border-color); padding: 0.3rem 0.8rem; border-radius: 6px;
          cursor: pointer; transition: all 0.2s;
        }
        .logout-btn:hover { border-color: var(--accent); color: var(--accent); }

        .theme-toggle {
          background: transparent; font-size: 1.3rem;
          padding: 0.4rem; border-radius: 50%; transition: background-color 0.2s;
        }
        .theme-toggle:hover { background-color: var(--border-color); }
        .hamburger {
          display: none; background: transparent; font-size: 1.3rem;
          padding: 0.4rem 0.6rem; border-radius: 8px;
          transition: background-color 0.2s;
        }
        .hamburger:hover { background-color: var(--border-color); }
        
        .mobile-menu {
          position: absolute; top: 100%; left: 0; right: 0;
          display: flex; flex-direction: column;
          padding: 1rem 1.5rem; border-radius: 0 0 16px 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .mobile-link {
          padding: 0.85rem 0; font-weight: 500; color: var(--text-secondary);
          border-bottom: 1px solid var(--border-color); transition: color 0.2s;
        }
        .mobile-link:last-child { border-bottom: none; }
        .mobile-link.active { color: var(--accent); font-weight: 600; }
        .mobile-divider { padding: 1rem 0 0.25rem; font-size: 0.75rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; }
        .nested { padding-left: 1rem; border-bottom: none; padding: 0.5rem 0 0.5rem 1rem; font-size: 0.9rem; }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hamburger { display: block; }
          .user-controls { flex-direction: column; align-items: flex-end; gap: 0.25rem; }
        }
      `}</style>
    </nav>
  );
}
