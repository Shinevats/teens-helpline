import Link from 'next/link';

const articles = [
  { slug: 'academic-burnout',       category: 'School',  emoji: '📚', title: 'How to Handle Academic Burnout',           desc: "Feeling exhausted from studying? Here's how to recover without falling behind.",               readTime: '3 min read' },
  { slug: 'teacher-uncomfortable',  category: 'School',  emoji: '👨‍🏫', title: 'When a Teacher Makes You Uncomfortable',  desc: "It's not okay. Here's how to identify the signs and who to talk to.",                       readTime: '4 min read' },
  { slug: 'toxic-friendships',      category: 'Friends', emoji: '👥', title: 'Dealing with Toxic Friendships',            desc: "Real friends don't make you feel small. Here's how to tell the difference.",                readTime: '3 min read' },
  { slug: 'being-bullied',          category: 'Friends', emoji: '🛑', title: "What to Do When You're Being Bullied",      desc: "Bullying is never your fault. Here are steps to protect yourself and get help.",            readTime: '5 min read' },
  { slug: 'home-doesnt-feel-safe',  category: 'Family',  emoji: '🏠', title: "When Home Doesn't Feel Safe",               desc: 'Navigating difficult family situations and finding support outside the home.',              readTime: '4 min read' },
  { slug: 'not-okay-all-the-time',  category: 'Self',    emoji: '💙', title: "You Don't Have to Be Okay All the Time",    desc: "Feeling down, numb, or anxious is valid. Here's how to be kind to yourself.",               readTime: '3 min read' },
];

export default function ResourcesPage() {
  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>📖 Resources</h1>
          <p className="page-subtitle">
            Short, honest, teen-friendly guides. No boring walls of text. Just what you actually need.
          </p>
        </div>

        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.slug} className="article-card glass-card">
              <div className="article-top">
                <span className="article-category">{article.category}</span>
                <span className="article-emoji">{article.emoji}</span>
              </div>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-desc">{article.desc}</p>
              <div className="article-footer">
                <span className="article-read-time">{article.readTime}</span>
                <Link href={`/resources/${article.slug}`} className="article-btn">
                  Read →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .page-container { padding: 4rem 0; }
        .page-header { text-align: center; margin-bottom: 3rem; }
        .page-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
        .page-subtitle { color: var(--text-secondary); font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
        .articles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .article-card { padding: 1.75rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .article-top { display: flex; justify-content: space-between; align-items: center; }
        .article-category {
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--accent);
          background-color: var(--bg-color); padding: 0.3rem 0.75rem; border-radius: 9999px;
        }
        .article-emoji { font-size: 1.5rem; }
        .article-title { font-size: 1.15rem; font-weight: 700; line-height: 1.4; }
        .article-desc { color: var(--text-secondary); font-size: 0.9rem; flex: 1; }
        .article-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; }
        .article-read-time { font-size: 0.8rem; color: var(--text-secondary); }
        .article-btn {
          color: var(--accent); font-weight: 600; font-size: 0.9rem;
          transition: transform 0.2s; display: inline-block;
        }
        .article-btn:hover { transform: translateX(4px); }
      `}} />
    </div>
  );
}
