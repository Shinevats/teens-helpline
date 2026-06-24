'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// ─── Aanya's response engine ─────────────────────────────────────────────────
const responses = {
  greeting: [
    "Hey 💙 I'm so glad you're here. This is a safe space — no judgment, no pressure. What's going on?",
    "Hi there 💙 I'm Aanya, and I'm here to listen. You can tell me anything. What's been on your mind lately?",
    "Hey, welcome 💙 You took a brave step by coming here. What would you like to talk about today?",
  ],
  anxious: [
    "I can hear that you're feeling really overwhelmed right now. That racing mind feeling is exhausting, isn't it? 💙\n\nFirst — take one slow breath with me. In for 4 counts, out for 6. Can you try that?\n\nWhen you're ready, tell me — what's the biggest thing weighing on you right now?",
    "Anxiety can feel like your brain has 47 tabs open and they're all playing music at the same time. It makes sense that you feel overwhelmed 💙\n\nI want to understand what you're going through. Is it more about something specific that's happening, or is it more of a constant background worry?",
  ],
  stressed: [
    "Ugh, that heavy, stretched-too-thin feeling is so real 💙 You're not being dramatic — stress is your body literally telling you it's carrying too much.\n\nIs the stress more about school and studying, or is it more about stuff going on at home or with people around you?",
    "I hear you. That 'too much going on' feeling can make it hard to even know where to start 💙\n\nLet's slow this down together. Out of everything that's stressing you — what feels like the biggest rock on your shoulders right now? Just one thing.",
  ],
  lonely: [
    "Feeling like no one really gets you is one of the loneliest feelings in the world 💙 And I want you to know — what you're feeling is real, and it matters.\n\nCan I ask — is it more that you don't have people around you, or that you have people around you but still feel disconnected and misunderstood?",
    "Loneliness is so painful, especially when you're surrounded by people but still feel invisible 💙\n\nI see you. I'm here, and I genuinely want to understand what's going on for you. When did this feeling start?",
  ],
  sad: [
    "I'm really glad you told me that 💙 Feeling sad or empty is hard to carry around alone. You don't have to carry it alone right now.\n\nHow long have you been feeling this way? Is it something recent that happened, or has it been building up for a while?",
    "Thank you for trusting me with this 💙 Sadness is valid — it's your heart telling you something hurts.\n\nI want to understand better. Is there a specific situation that's making you sad, or does it feel more like a grey cloud that just follows you around?",
  ],
  depression: [
    "What you're describing sounds really heavy, and I want to take it seriously 💙 Feeling consistently low, empty, or like things won't get better — that's not just a bad day. That's something worth talking about.\n\nHow long have you been feeling this way? And are you sleeping okay?",
    "I hear you, and I want you to know — what you're feeling is real, it's not weakness, and you absolutely deserve support 💙\n\nCan you tell me a bit more? Like — do you still enjoy things you used to like, or has even that faded away?",
  ],
  school: [
    "School pressure is so real, and in India especially, it can feel absolutely crushing 💙 Boards, tuitions, parents' expectations, comparison with friends — it's a lot.\n\nTell me more — is it more about the actual work and exams, or more about how people at school make you feel?",
    "I hear you 💙 The pressure to perform all the time is genuinely exhausting. You're not lazy — your brain is just overwhelmed.\n\nWhat does a typical day look like for you right now? I want to understand what you're dealing with.",
  ],
  teacher: [
    "What you're describing about your teacher is important, and I want to hear all of it 💙 No teacher has the right to make you feel unsafe, humiliated, or uncomfortable.\n\nCan you tell me more about what's been happening? What does this teacher say or do that makes you feel this way?",
    "I'm really glad you told me about this 💙 Teachers are supposed to be safe adults — when they're not, it's not your fault and you shouldn't have to just 'deal with it.'\n\nIs this something that's happened once, or is it a repeated pattern?",
  ],
  bullying: [
    "What you're going through is not okay, and it is never your fault 💙 I want you to know that first.\n\nCan you tell me what's been happening? Is this at school, online, or both? And is it one person or a group?",
    "I'm so sorry you're dealing with this 💙 Bullying is exhausting and scary, and you deserve to feel safe.\n\nYou're brave for talking about it. What's been happening — and do you have any trusted adult in your life right now who knows about this?",
  ],
  family: [
    "Home should be your safe place, and when it's not, it's one of the loneliest feelings there is 💙 I want to understand what's going on for you.\n\nIs it more conflict — arguments, feeling like no one listens — or does it feel unsafe in a deeper way?",
    "Family situations can be so complicated 💙 You love them but they're hurting you, or you feel trapped — it's confusing and painful.\n\nI'm here. Tell me what's going on at home. I won't judge anyone — I just want to understand how you're feeling.",
  ],
  friends: [
    "Friend drama and toxic friendships can hurt just as much as anything else 💙 The people closest to us have the power to make us feel the safest — or the most invisible.\n\nWhat's been happening with your friends? Are they making you feel excluded, used, or put down?",
    "I hear you 💙 Friendship pain is real pain. Sometimes the people we call friends are the ones who drain us the most.\n\nCan you tell me more about what's going on? Is there a specific person or situation that's been hurting you?",
  ],
  selfharm: [
    "Thank you so much for telling me this. It takes real courage to say this out loud 💙 I want you to know — you matter, and what you're feeling matters.\n\nRight now, I want to make sure you're safe. Can you tell me — are you safe right now in this moment?\n\nPlease also reach out to iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345 — they're available now and they care about you.",
    "I hear you, and I'm not going to brush past this 💙 What you're feeling is serious, and you deserve real support right now.\n\nAre you safe right now? Please tell me where you are.\n\nAlso please call 9152987821 (iCall) right now — they're available Mon-Sat and they genuinely want to help.",
  ],
  okay: [
    "That's really good to hear! 💙 Even on okay days, it's great to check in with yourself. How are things going — school, home, friends?\n\nIs there anything on your mind, even something small?",
    "Glad you're doing okay today 💙 Sometimes okay is exactly enough. Are you just checking in, or is there something you wanted to talk through — even if it feels small?",
  ],
  thanks: [
    "Of course 💙 I'm always here. Talking about this stuff takes courage, and you did that today. That matters.\n\nIs there anything else on your mind before you go?",
    "I'm really glad this helped, even a little bit 💙 Remember — you're not alone in any of this. Come back anytime.\n\nTake care of yourself today. You deserve it.",
  ],
  default: [
    "I hear you, and I want to understand better 💙 Can you tell me a bit more about what's going on? I'm here and I'm listening — take as much time as you need.",
    "Thank you for sharing that with me 💙 I want to make sure I understand what you're going through. Can you tell me more about how this is affecting you day to day?",
    "That sounds really hard 💙 I'm here with you. Can you help me understand more — is this something that's been going on for a while, or did something specific happen recently?",
  ],
};

const suggestions = {
  anxious:    ['Tell me more about what triggers it', 'It happens at school', 'It happens at home', 'Try a breathing exercise'],
  stressed:   ['It\'s about exams', 'It\'s about my parents\' expectations', 'It\'s everything at once'],
  lonely:     ['I feel invisible at school', 'My friends don\'t get me', 'I just feel empty'],
  sad:        ['I don\'t know why I feel this way', 'Something happened', 'I\'ve been feeling this for weeks'],
  school:     ['It\'s exam pressure', 'A teacher is the problem', 'I\'m being bullied at school'],
  family:     ['My parents fight a lot', 'I feel like a burden', 'I don\'t feel safe at home'],
  bullying:   ['It\'s at school', 'It\'s online', 'It\'s by a group'],
  default:    ['I\'m anxious', 'I\'m stressed about school', 'I have family problems', 'I\'m being bullied', 'I feel lonely', 'I just need to vent'],
};

function getResponse(text) {
  const t = text.toLowerCase();
  if (/hi|hello|hey|hii|helo/.test(t)) return pick(responses.greeting);
  if (/thank|thanks|helped|better/.test(t)) return pick(responses.thanks);
  if (/hurt.*(my)?self|self.harm|cut.*(my)?self|want to die|kill.*(my)?self|suicid/.test(t)) return pick(responses.selfharm);
  if (/depress/.test(t)) return pick(responses.depression);
  if (/anxi|panic|racing|overwhelm/.test(t)) return pick(responses.anxious);
  if (/stress|pressure|exam|board|tuition|study/.test(t)) return pick(responses.stressed);
  if (/lonel|alone|no one|nobody|isolated|disconnect/.test(t)) return pick(responses.lonely);
  if (/sad|cry|tears|hopeless|empty|numb/.test(t)) return pick(responses.sad);
  if (/teacher|school|class|college|tution|tutor/.test(t)) return pick(responses.school);
  if (/bully|harass|tease|mock|embarrass/.test(t)) return pick(responses.bullying);
  if (/family|parent|mom|dad|mother|father|home|house/.test(t)) return pick(responses.family);
  if (/friend|bestie|group|gang|toxic/.test(t)) return pick(responses.friends);
  if (/okay|fine|alright|good|ok/.test(t)) return pick(responses.okay);
  return pick(responses.default);
}

function getSuggestions(text) {
  const t = text.toLowerCase();
  if (/anxi|panic/.test(t)) return suggestions.anxious;
  if (/stress|exam|school/.test(t)) return suggestions.stressed;
  if (/lonel|alone/.test(t)) return suggestions.lonely;
  if (/sad|cry/.test(t)) return suggestions.sad;
  if (/bully|harass/.test(t)) return suggestions.bullying;
  if (/family|parent/.test(t)) return suggestions.family;
  return suggestions.default;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ─── Chat Component ───────────────────────────────────────────────────────────
function ChatBox() {
  const searchParams = useSearchParams();
  const mood = searchParams.get('mood');
  const initialMessage = searchParams.get('message');

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'aanya',
      text: mood
        ? pick(responses[mood] || responses.greeting)
        : pick(responses.greeting),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [quickSuggestions, setQuickSuggestions] = useState(suggestions.default);
  const [input, setInput] = useState(initialMessage || '');
  const [isTyping, setIsTyping] = useState(false);
  const [sent, setSent] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSent(true);
    setIsTyping(true);

    // Aanya types for 1.5–2.5 seconds
    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => {
      const reply = getResponse(trimmed);
      const newSuggestions = getSuggestions(trimmed);
      const aanyaMsg = {
        id: Date.now() + 1,
        from: 'aanya',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aanyaMsg]);
      setQuickSuggestions(newSuggestions);
      setIsTyping(false);
    }, delay);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-layout">

        {/* Sidebar */}
        <aside className="chat-sidebar glass-card">
          <div className="aanya-profile">
            <div className="aanya-avatar">💙</div>
            <div>
              <h3>Aanya</h3>
              <span className="online-badge">● Online now</span>
            </div>
          </div>
          <p className="aanya-desc">
            I'm a compassionate listener who genuinely cares about teens going through tough times. Everything you share here is private and judgment-free.
          </p>
          <hr className="sidebar-divider" />
          <h4>Having a crisis?</h4>
          <a href="tel:9152987821" className="crisis-link">📞 iCall: 9152987821</a>
          <a href="tel:18602662345" className="crisis-link">📞 Vandrevala: 1860-2662-345</a>
          <a href="tel:112" className="crisis-link emergency">🚨 Emergency: 112</a>
        </aside>

        {/* Chat Window */}
        <div className="chat-window glass-card">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="aanya-avatar-sm">💙</div>
              <div>
                <p className="chat-name">Aanya</p>
                <p className="chat-status">Always here for you</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.from === 'user' ? 'user-row' : 'aanya-row'}`}>
                {msg.from === 'aanya' && <div className="aanya-icon">💙</div>}
                <div className={`bubble ${msg.from === 'user' ? 'user-bubble' : 'aanya-bubble'}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</span>
                  ))}
                  <div className="msg-time">{msg.time}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="message-row aanya-row">
                <div className="aanya-icon">💙</div>
                <div className="bubble aanya-bubble typing-bubble">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          {!isTyping && (
            <div className="suggestions-row">
              {quickSuggestions.map((s, i) => (
                <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="input-area">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Type how you're feeling... (press Enter to send)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button
              className={`send-btn ${!input.trim() ? 'disabled' : ''}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .chat-page { padding: 2rem 1rem 4rem; min-height: calc(100vh - 160px); }
        .chat-layout { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; max-width: 1100px; margin: 0 auto; align-items: start; }

        /* Sidebar */
        .chat-sidebar { padding: 1.75rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .aanya-profile { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
        .aanya-avatar { font-size: 2.5rem; background: var(--bg-color); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--accent); }
        .aanya-profile h3 { font-size: 1.2rem; font-weight: 700; }
        .online-badge { font-size: 0.78rem; color: #22c55e; font-weight: 600; }
        .aanya-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
        .sidebar-divider { border: none; border-top: 1px solid var(--border-color); margin: 0.25rem 0; }
        .chat-sidebar h4 { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em; }
        .crisis-link { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); padding: 0.4rem 0; transition: color 0.2s; }
        .crisis-link:hover { color: var(--accent); }
        .crisis-link.emergency { color: #ef4444; }

        /* Chat window */
        .chat-window { display: flex; flex-direction: column; height: 78vh; overflow: hidden; }
        .chat-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .chat-header-info { display: flex; align-items: center; gap: 0.75rem; }
        .aanya-avatar-sm { font-size: 1.75rem; background: var(--bg-color); width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--accent); }
        .chat-name { font-weight: 700; font-size: 0.95rem; }
        .chat-status { font-size: 0.75rem; color: #22c55e; }

        /* Messages */
        .messages-area { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .message-row { display: flex; align-items: flex-end; gap: 0.5rem; }
        .aanya-row { justify-content: flex-start; }
        .user-row { justify-content: flex-end; }
        .aanya-icon { font-size: 1.5rem; flex-shrink: 0; margin-bottom: 4px; }

        .bubble { max-width: 68%; padding: 0.9rem 1.2rem; border-radius: 18px; line-height: 1.7; font-size: 0.95rem; position: relative; }
        .aanya-bubble { background-color: var(--surface-color); border: 1px solid var(--border-color); border-bottom-left-radius: 4px; color: var(--text-primary); }
        .user-bubble { background-color: var(--accent); color: white; border-bottom-right-radius: 4px; }
        .msg-time { font-size: 0.7rem; opacity: 0.6; margin-top: 0.4rem; text-align: right; }

        /* Typing */
        .typing-bubble { display: flex; gap: 5px; align-items: center; padding: 1rem 1.2rem; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background-color: var(--text-secondary); animation: bounce 1.2s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }

        /* Suggestions */
        .suggestions-row { padding: 0.75rem 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap; border-top: 1px solid var(--border-color); }
        .suggestion-chip {
          background: var(--bg-color); border: 1px solid var(--border-color);
          color: var(--text-secondary); font-size: 0.8rem; font-weight: 500;
          padding: 0.4rem 0.9rem; border-radius: 9999px; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .suggestion-chip:hover { border-color: var(--accent); color: var(--accent); }

        /* Input */
        .input-area { padding: 1rem 1.25rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.75rem; align-items: flex-end; }
        .chat-input {
          flex: 1; background: var(--bg-color); border: 1px solid var(--border-color);
          border-radius: 12px; padding: 0.75rem 1rem; font-family: inherit;
          font-size: 0.95rem; color: var(--text-primary); resize: none; outline: none;
          max-height: 120px; overflow-y: auto; transition: border-color 0.2s;
        }
        .chat-input:focus { border-color: var(--accent); }
        .send-btn {
          background-color: var(--accent); color: white; border: none;
          width: 44px; height: 44px; border-radius: 50%; font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: opacity 0.2s, transform 0.2s;
        }
        .send-btn:hover:not(.disabled) { opacity: 0.85; transform: scale(1.05); }
        .send-btn.disabled { opacity: 0.35; cursor: not-allowed; }

        /* Mobile */
        @media (max-width: 768px) {
          .chat-layout { grid-template-columns: 1fr; }
          .chat-sidebar { display: none; }
          .chat-window { height: 82vh; }
        }
      `}} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{padding:'4rem',textAlign:'center'}}>Loading chat...</div>}>
      <ChatBox />
    </Suspense>
  );
}
