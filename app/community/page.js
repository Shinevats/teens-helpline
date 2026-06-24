'use client';
import { useState, useEffect } from 'react';

const SEED_POSTS = [
  {
    id: 1001,
    text: "My tuition teacher shouts at me every single day and says I'm dumb. I've started hating studying completely. Nobody at home believes me when I tell them.",
    category: 'School',
    date: '2 hours ago',
    replies: [
      { id: 2001, text: "I went through this exact thing in class 10. It broke my confidence. But please know — his words are about his frustration, not your worth. You are not dumb. Tell another trusted teacher or your school counselor. You deserve a safe learning environment. 💙", role: 'Adult Supporter' },
    ],
  },
  {
    id: 1002,
    text: "My parents fight every night. I can't sleep. I can't focus on anything. I feel like it's somehow my fault.",
    category: 'Family',
    date: '5 hours ago',
    replies: [
      { id: 2002, text: "It is NOT your fault. Parents fighting is about their relationship — never about you. But you shouldn't have to carry this weight. Is there a relative or school counselor you trust? You need and deserve support. 💙", role: 'Adult Supporter' },
      { id: 2003, text: "Same situation here. I put earphones in and play calm music when they fight. It doesn't fix anything but it helps me get through the night.", role: 'Fellow Teen' },
    ],
  },
  {
    id: 1003,
    text: "My whole friend group left me out of a trip without telling me. I found out through someone else's story. I don't understand what I did wrong.",
    category: 'Friends',
    date: '1 day ago',
    replies: [
      { id: 2004, text: "That kind of social exclusion hurts deeply — it's a form of bullying even if it doesn't look dramatic. You didn't necessarily do anything wrong. Sometimes people do this out of insecurity. It still hurts, and that hurt is valid. 💙", role: 'Adult Supporter' },
    ],
  },
];

const CATEGORIES = ['All', 'School', 'Family', 'Friends', 'Bullying', 'Just Venting'];

export default function CommunityPage() {
  const [posts, setPosts]           = useState(SEED_POSTS);
  const [filter, setFilter]         = useState('All');
  const [newPost, setNewPost]       = useState('');
  const [newCategory, setNewCategory] = useState('Just Venting');
  const [posted, setPosted]         = useState(false);
  const [replyText, setReplyText]   = useState({});
  const [openReplies, setOpenReplies] = useState({});
  const [yourName, setYourName]     = useState('');
  const [user, setUser]             = useState(null);

  useEffect(() => {
    // Load posts
    const storedPosts = localStorage.getItem('community-posts');
    if (storedPosts) {
      const parsed = JSON.parse(storedPosts);
      setPosts([...SEED_POSTS, ...parsed]);
    }
    
    // Load user and prefill name
    const storedUser = localStorage.getItem('teen-helpline-auth');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'adult') {
        setYourName(`⭐ ${parsedUser.username} (Counselor)`);
      } else {
        setYourName('Anonymous Teen');
      }
    }
  }, []);

  const submitPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      text: newPost.trim(),
      category: newCategory,
      date: 'Just now',
      replies: [],
    };
    const userPosts = JSON.parse(localStorage.getItem('community-posts') || '[]');
    userPosts.unshift(post);
    localStorage.setItem('community-posts', JSON.stringify(userPosts));
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  };

  const submitReply = (postId) => {
    const text = (replyText[postId] || '').trim();
    if (!text) return;
    const reply = {
      id: Date.now(),
      text,
      role: yourName.trim() || 'Anonymous',
    };
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
    ));
    setReplyText(prev => ({ ...prev, [postId]: '' }));

    // Award points if adult
    if (user && user.role === 'adult') {
      const updatedUser = { ...user, points: (user.points || 0) + 10 };
      setUser(updatedUser);
      localStorage.setItem('teen-helpline-auth', JSON.stringify(updatedUser));
      // Small visual feedback could go here
    }
  };

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>🌍 Community Wall</h1>
          <p className="page-subtitle">
            Anonymous posts from real teens going through real stuff. Read, relate, and reply to help someone.
          </p>
        </div>

        {/* Post Something */}
        {(!user || user.role === 'teen') && (
          <div className="post-card glass-card">
            <h2>📢 Share Anonymously</h2>
            <p className="post-hint">Tell the community what's going on. No names. No judgment.</p>
            <div className="category-row">
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <button
                  key={cat}
                  className={`cat-chip ${newCategory === cat ? 'active' : ''}`}
                  onClick={() => setNewCategory(cat)}
                >{cat}</button>
              ))}
            </div>
            <textarea
              className="post-textarea"
              rows={4}
              placeholder="What's happening? Write freely — this is your safe space."
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
            />
            <div className="post-footer">
              <span className="anon-label">👤 You'll appear as Anonymous</span>
              <button
                className={`post-btn ${!newPost.trim() ? 'disabled' : ''}`}
                onClick={submitPost}
                disabled={!newPost.trim()}
              >
                {posted ? '✓ Posted!' : 'Post Anonymously'}
              </button>
            </div>
          </div>
        )}

        {/* Your reply name */}
        <div className="reply-name-bar glass-card">
          <span>🖊️ When you reply, show as:</span>
          <input
            className="name-input"
            placeholder="e.g. 'Fellow Teen', 'Parent', 'Teacher' — or leave blank"
            value={yourName}
            onChange={e => setYourName(e.target.value)}
            disabled={user?.role === 'adult'} // Lock adult names to their verified name
          />
          {user?.role === 'adult' && (
            <span style={{fontSize: '0.8rem', color: 'var(--accent)', marginLeft: '10px'}}>
              (Verified Adult: Earn +10 Points per reply)
            </span>
          )}
        </div>

        {/* Filter */}
        <div className="filter-row">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >{cat}</button>
          ))}
        </div>

        {/* Posts */}
        <div className="posts-list">
          {filtered.length === 0 && (
            <div className="empty-state glass-card">
              <p>No posts in this category yet. Be the first to share.</p>
            </div>
          )}
          {filtered.map(post => (
            <div key={post.id} className="post-item glass-card">
              <div className="post-top">
                <span className="post-category-badge">{post.category}</span>
                <span className="post-date">{post.date}</span>
              </div>
              <p className="post-text">{post.text}</p>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="replies-section">
                  <button
                    className="toggle-replies"
                    onClick={() => setOpenReplies(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  >
                    {openReplies[post.id] ? '▲ Hide' : `▼ ${post.replies.length} ${post.replies.length === 1 ? 'reply' : 'replies'}`}
                  </button>

                  {openReplies[post.id] && (
                    <div className="replies-list">
                      {post.replies.map(reply => (
                        <div key={reply.id} className="reply-item">
                          <span className="reply-role">{reply.role}</span>
                          <p className="reply-text">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reply Input */}
              <div className="reply-input-row">
                <input
                  className="reply-input"
                  placeholder="Write a supportive reply..."
                  value={replyText[post.id] || ''}
                  onChange={e => setReplyText(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') submitReply(post.id); }}
                />
                <button
                  className={`reply-btn ${!(replyText[post.id] || '').trim() ? 'disabled' : ''}`}
                  onClick={() => submitReply(post.id)}
                  disabled={!(replyText[post.id] || '').trim()}
                >Reply 💙</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .page-container { padding: 4rem 0 5rem; }
        .page-header { text-align: center; margin-bottom: 2.5rem; }
        .page-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.75rem; }
        .page-subtitle { color: var(--text-secondary); font-size: 1.05rem; max-width: 600px; margin: 0 auto; }

        .post-card { padding: 2rem; margin-bottom: 1.25rem; }
        .post-card h2 { font-size: 1.3rem; margin-bottom: 0.4rem; }
        .post-hint { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem; }
        .category-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
        .cat-chip {
          padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;
          border: 1.5px solid var(--border-color); background: transparent; color: var(--text-secondary);
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .cat-chip.active { border-color: var(--accent); color: var(--accent); background: var(--bg-color); }
        .post-textarea {
          width: 100%; background: var(--bg-color); border: 1px solid var(--border-color);
          border-radius: 10px; padding: 0.9rem 1rem; font-family: inherit; font-size: 0.95rem;
          color: var(--text-primary); resize: vertical; outline: none; transition: border-color 0.2s;
          margin-bottom: 1rem;
        }
        .post-textarea:focus { border-color: var(--accent); }
        .post-footer { display: flex; justify-content: space-between; align-items: center; }
        .anon-label { font-size: 0.82rem; color: var(--text-secondary); }
        .post-btn {
          background: var(--accent); color: white; padding: 0.7rem 1.75rem;
          border-radius: 9999px; font-size: 0.9rem; font-weight: 600; transition: opacity 0.2s;
        }
        .post-btn.disabled { opacity: 0.35; cursor: not-allowed; }

        .reply-name-bar {
          padding: 1rem 1.5rem; margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
          font-size: 0.88rem; color: var(--text-secondary);
        }
        .name-input {
          flex: 1; min-width: 180px; background: var(--bg-color);
          border: 1px solid var(--border-color); border-radius: 8px;
          padding: 0.5rem 0.9rem; font-family: inherit; font-size: 0.88rem;
          color: var(--text-primary); outline: none; transition: border-color 0.2s;
        }
        .name-input:focus { border-color: var(--accent); }

        .filter-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .filter-chip {
          padding: 0.4rem 1rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 600;
          border: 1.5px solid var(--border-color); background: transparent;
          color: var(--text-secondary); cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .filter-chip.active { border-color: var(--accent); color: var(--accent); background: var(--surface-color); }

        .posts-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .post-item { padding: 1.5rem; }
        .post-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .post-category-badge {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
          background: var(--bg-color); color: var(--accent); padding: 0.25rem 0.65rem; border-radius: 9999px;
        }
        .post-date { font-size: 0.78rem; color: var(--text-secondary); }
        .post-text { font-size: 1rem; line-height: 1.75; color: var(--text-primary); margin-bottom: 1rem; }

        .replies-section { margin-bottom: 1rem; }
        .toggle-replies {
          background: none; color: var(--accent); font-size: 0.82rem; font-weight: 600;
          margin-bottom: 0.75rem; font-family: inherit; cursor: pointer; transition: opacity 0.2s;
        }
        .toggle-replies:hover { opacity: 0.7; }
        .replies-list { display: flex; flex-direction: column; gap: 0.75rem; padding-left: 1rem; border-left: 3px solid var(--border-color); }
        .reply-item {}
        .reply-role { font-size: 0.75rem; font-weight: 700; color: var(--accent); display: block; margin-bottom: 0.2rem; }
        .reply-text { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; }

        .reply-input-row { display: flex; gap: 0.75rem; align-items: center; }
        .reply-input {
          flex: 1; background: var(--bg-color); border: 1px solid var(--border-color);
          border-radius: 9999px; padding: 0.6rem 1rem; font-family: inherit;
          font-size: 0.88rem; color: var(--text-primary); outline: none; transition: border-color 0.2s;
        }
        .reply-input:focus { border-color: var(--accent); }
        .reply-btn {
          background: var(--accent); color: white; padding: 0.6rem 1.25rem;
          border-radius: 9999px; font-size: 0.85rem; font-weight: 600;
          white-space: nowrap; transition: opacity 0.2s;
        }
        .reply-btn.disabled { opacity: 0.35; cursor: not-allowed; }

        .empty-state { padding: 3rem; text-align: center; color: var(--text-secondary); }
        @media (max-width: 600px) {
          .post-footer { flex-direction: column; gap: 0.75rem; align-items: flex-start; }
          .reply-input-row { flex-direction: column; }
          .reply-btn { width: 100%; }
        }
      `}} />
    </div>
  );
}
