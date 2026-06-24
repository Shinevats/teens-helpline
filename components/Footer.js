'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <p>💙 This is a safe space. We're here for you, always.</p>
      <style jsx>{`
        .footer {
          text-align: center;
          padding: 2rem;
          border-top: 1px solid var(--border-color);
          color: var(--text-secondary);
          margin-top: auto;
          font-size: 0.9rem;
        }
      `}</style>
    </footer>
  );
}
