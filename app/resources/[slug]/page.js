import { articles } from '../articlesData';
import Link from 'next/link';

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const article = articles[params.slug];
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} | Teen Helpline`,
    description: article.intro,
  };
}

export default function ArticlePage({ params }) {
  const article = articles[params.slug];

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h1>Article not found</h1>
        <Link href="/resources" style={{ color: 'var(--accent)', marginTop: '1rem', display: 'inline-block' }}>
          ← Back to Resources
        </Link>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="container">
        <Link href="/resources" className="back-link">← Back to Resources</Link>

        <header className="article-header">
          <span className="article-category-badge">{article.category}</span>
          <div className="article-emoji-large">{article.emoji}</div>
          <h1>{article.title}</h1>
          <p className="article-read-time">{article.readTime}</p>
          <p className="article-intro">{article.intro}</p>
        </header>

        <article className="article-body">
          {article.sections.map((section, i) => (
            <section key={i} className="article-section">
              <h2>{section.heading}</h2>
              <div className="section-content">
                {section.content.split('\n\n').map((para, j) => {
                  if (para.startsWith('→')) {
                    return (
                      <ul key={j}>
                        {para.split('\n').map((line, k) => (
                          <li key={k}>{line.replace(/^→\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={j}>{para.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                })}
              </div>
            </section>
          ))}
        </article>

        <div className="article-footer-cta glass-card">
          <h3>💙 You don't have to go through this alone.</h3>
          <p>If this article resonated with you and you need more support, we're here.</p>
          <div className="cta-row">
            <Link href="/chat" className="cta-btn-primary">Talk to Someone</Link>
            <Link href="/helplines" className="cta-btn-secondary">See Helplines</Link>
            <Link href="/coping" className="cta-btn-secondary">Try Coping Tools</Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .article-page { padding: 3rem 0 5rem; }
        .back-link {
          color: var(--accent); font-weight: 600; font-size: 0.95rem;
          display: inline-block; margin-bottom: 2rem;
          transition: transform 0.2s;
        }
        .back-link:hover { transform: translateX(-4px); }

        .article-header { text-align: center; margin-bottom: 3rem; }
        .article-category-badge {
          display: inline-block;
          background-color: var(--accent); color: white;
          padding: 0.3rem 0.9rem; border-radius: 9999px;
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; margin-bottom: 1.25rem;
        }
        .article-emoji-large { font-size: 4rem; margin-bottom: 1rem; }
        .article-header h1 {
          font-size: 2.5rem; font-weight: 700; line-height: 1.25;
          margin-bottom: 0.75rem; max-width: 700px; margin-left: auto; margin-right: auto;
        }
        .article-read-time { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .article-intro {
          font-size: 1.2rem; font-style: italic; color: var(--text-secondary);
          max-width: 650px; margin: 0 auto;
          border-left: 4px solid var(--accent);
          padding: 1rem 1.5rem; text-align: left; border-radius: 8px;
          background-color: var(--surface-color);
        }

        .article-body { max-width: 750px; margin: 0 auto; }
        .article-section { margin-bottom: 2.5rem; }
        .article-section h2 {
          font-size: 1.4rem; font-weight: 700;
          margin-bottom: 1rem; color: var(--text-primary);
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--border-color);
        }
        .section-content p {
          color: var(--text-secondary); line-height: 1.8; margin-bottom: 0.75rem; font-size: 1.05rem;
        }
        .section-content ul { list-style: none; padding: 0; }
        .section-content li {
          color: var(--text-secondary); line-height: 1.7; margin-bottom: 0.75rem;
          padding-left: 1.5rem; position: relative; font-size: 1.02rem;
        }
        .section-content li::before {
          content: '→'; position: absolute; left: 0; color: var(--accent); font-weight: 700;
        }

        .article-footer-cta {
          max-width: 750px; margin: 3rem auto 0;
          padding: 2.5rem; text-align: center;
        }
        .article-footer-cta h3 { font-size: 1.5rem; margin-bottom: 0.75rem; }
        .article-footer-cta > p { color: var(--text-secondary); margin-bottom: 1.5rem; }
        .cta-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .cta-btn-primary {
          background-color: var(--accent); color: white;
          padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; font-size: 0.95rem;
          transition: opacity 0.2s, transform 0.2s;
        }
        .cta-btn-primary:hover { opacity: 0.85; transform: translateY(-2px); }
        .cta-btn-secondary {
          background: transparent; color: var(--text-primary);
          border: 2px solid var(--border-color);
          padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; font-size: 0.95rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .cta-btn-secondary:hover { border-color: var(--accent); transform: translateY(-2px); }

        @media (max-width: 600px) {
          .article-header h1 { font-size: 1.8rem; }
          .cta-row { flex-direction: column; }
        }
      `}} />
    </div>
  );
}
