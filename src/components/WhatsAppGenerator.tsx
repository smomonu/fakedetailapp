import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  CheckCheck, 
  Download, 
  Shield,
  RefreshCw,
  ArrowLeft,
  Palette,
  Monitor,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  MessageSquare,
  Target,
  Users,
  Plus,
  Camera,
  Settings,
  Phone,
  Smartphone,
  Video,
  MoreVertical,
  FileText,
  Image,
  Music,
  UserPlus,
  Calendar,
  Star,
  Search,
  Key,
  Lock,
  Bell,
  Keyboard,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Smile } from 'lucide-react';
import html2canvas from 'html2canvas';

const ChatComposer: React.FC<{ onSend: (text: string, options?: { type?: 'text'|'image'|'gif'|'file'|'audio', url?: string, side?: 'me'|'them' }) => void, replyTo?: any, onCancelReply?: () => void, exportMode?: boolean }> = ({ onSend, replyTo, onCancelReply, exportMode = false }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [messageSide, setMessageSide] = useState<'me'|'them'>('me');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const attachRef = useRef<HTMLDivElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // close attach popup when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!showAttach) return;
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) {
        setShowAttach(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showAttach]);

  function insertEmoji(emoji: string) {
    const el = inputRef.current;
    if (!el) {
      setText((t) => t + emoji);
      setShowEmojiPicker(false);
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);
    // focus and move caret after inserted emoji
    setTimeout(() => {
      el.focus();
      const pos = start + emoji.length;
      el.selectionStart = el.selectionEnd = pos;
    }, 0);
    setShowEmojiPicker(false);
  }

  const [emojiSearch, setEmojiSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('smileys');

  const CATEGORIES = [
    { key: 'recent', label: 'Recent', icon: '🕘' },
    { key: 'trending', label: 'Trending', icon: '🔥' },
    { key: 'smileys', label: 'Smileys', icon: '😊' },
    { key: 'people', label: 'People', icon: '👋' },
    { key: 'animals', label: 'Animals & Nature', icon: '🐶' },
    { key: 'food', label: 'Food', icon: '🍕' },
    { key: 'travel', label: 'Travel', icon: '✈️' },
    { key: 'objects', label: 'Objects', icon: '📷' },
    { key: 'symbols', label: 'Symbols', icon: '❤️' }
  ];

  const EMOJI_CATEGORIES: Record<string, string[]> = {
    trending: ['🔥','💯','😂','🥲','🥹','🤌','🫶','✨','💕','🎉','👏','🙏','🫡','😮‍💨','🤯','😅','🤩','🥳','🚀','🌈','🍿','🤝','🙌','😎','🥰','❤️','👍','🤝','��','🫠','🫢','🫣'],
    smileys: ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','🙂','🙃','😇','😍','🥰','😘','😗','😙','😚','😋','😛','😜','🤪','🤨','��','🤓','😏','😶'],
    people: ['👋','🤚','🖐️','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','👍','��','👏','🙌','🙏'],
    animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦄','🐢','🐍','🐠','🐙'],
    food: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍒','🍑','🍍','🥭','🍅','🍆','🥑','🥦','🥕','🌽','🍕','🍔','🍟','🍣','🍩','🍪','☕'],
    travel: ['🏠','🏢','🏖️','🏝️','🏕️','🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚲','✈️','🚀','🛳️'],
    objects: ['📱','💻','⌚','📷','🎧','🔋','💡','🔒','🔑','📎','📌','📁','📦','🎁','🔔','🧭'],
    symbols: ['❤️','💛','💚','💙','💜','🖤','⭐','✨','🔥','💯','✔️','❌','⚠️','🔁','🔔']
  };

  // simple local GIF catalog (replace with API later)
  const [gifSearch, setGifSearch] = useState('');
  const GIFS = [
    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    'https://media.giphy.com/media/l0HlQ7LRalvZrJ8dK/giphy.gif',
    'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    'https://media.giphy.com/media/26xBwdIuRJiAiWith2/giphy.gif',
    'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
    'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',
    'https://media.giphy.com/media/3o6gbbuLW76jkt8vIc/giphy.gif',
    'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif'
  ];

  // Sticker picker: use emoji-based stickers rendered to SVG data-URLs
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const STICKER_EMOJIS = ['😄','😍','😘','🤩','👍','👏','🔥','🥳','🤝','😎','😅','🤗','��','🤯','🫶','💯'];

  function makeStickerDataUrl(emoji: string, size = 240) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='100%' height='100%' rx='24' ry='24' fill='white'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-size='140' font-family='Apple Color Emoji,Segoe UI Emoji,NotoColorEmoji,AndroidEmoji,EmojiSymbols'>${emoji}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  function handleFileSelect(file: File | null, type: 'file'|'image'|'audio') {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSend('', { type: type === 'file' ? 'file' : type === 'image' ? 'image' : 'file', url, side: messageSide });
  }

  return (
    <div className="p-3 border-t border-gray-200 flex items-center space-x-3 bg-transparent">
      <div className="relative" ref={attachRef}>
        <button onClick={() => setShowAttach(s => !s)} className="text-gray-500"><Plus className="w-6 h-6" /></button>
        {showAttach && (
          <div className="absolute left-0 bottom-14 w-56 bg-white border rounded-2xl shadow-lg py-2 z-50 max-h-[675px] overflow-auto">
            <div className="flex flex-col">
              <button onClick={() => { docInputRef.current?.click(); setShowAttach(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600"><FileText className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-gray-900">Document</div>
              </button>

              <button onClick={() => { photoInputRef.current?.click(); setShowAttach(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600"><Image className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-gray-900">Photos & videos</div>
              </button>

              <button onClick={() => { cameraInputRef.current?.click(); setShowAttach(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pink-50 text-pink-600"><Camera className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-gray-900">Camera</div>
              </button>

              <button onClick={() => { audioInputRef.current?.click(); setShowAttach(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 text-orange-600"><Music className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-gray-900">Audio</div>
              </button>

              <button onClick={() => { const name = prompt('Contact name:'); const phone = prompt('Contact phone:'); if (name) onSend(`Contact: ${name}${phone ? ' — ' + phone : ''}`, { side: messageSide }); setShowAttach(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600"><UserPlus className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-gray-900">Contact</div>
              </button>

              <button onClick={() => { const q = prompt('Poll question:'); if (q) onSend(`Poll: ${q}`, { side: messageSide }); setShowAttach(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-50 text-yellow-600"><CheckCheck className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-gray-900">Poll</div>
              </button>

              <button onClick={() => { const title = prompt('Event title:'); const date = prompt('Event date/time:'); if (title) onSend(`Event: ${title} — ${date || ''}`, { side: messageSide }); setShowAttach(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pink-50 text-pink-600"><Calendar className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-gray-900">Event</div>
              </button>

              <button onClick={() => { setShowStickerPicker(true); setShowAttach(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50 text-green-600"><Plus className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-gray-900">New sticker</div>
              </button>
            </div>
          </div>
        )}
        {/* hidden inputs for attachments */}
        <input ref={docInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0] || null; handleFileSelect(f || null, 'file'); setShowAttach(false); if (e.target) e.target.value = ''; }} />
        <input ref={photoInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0] || null; handleFileSelect(f || null, 'image'); setShowAttach(false); if (e.target) e.target.value = ''; }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0] || null; handleFileSelect(f || null, 'image'); setShowAttach(false); if (e.target) e.target.value = ''; }} />
        <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0] || null; handleFileSelect(f || null, 'audio'); setShowAttach(false); if (e.target) e.target.value = ''; }} />
      </div>
              <div className="flex items-center flex-1 bg-white rounded-full px-2 py-1.5 flex-col space-y-2 shadow-sm border border-gray-200 relative z-20">
        {replyTo && (
          <div className="w-full bg-gray-50 text-gray-700 rounded-md px-3 py-1 flex items-center justify-between text-xs">
            <div className="truncate">Replying to <span className="font-semibold">{replyTo.sender === 'me' ? 'You' : replyTo.sender}</span>: {String(replyTo.text).slice(0,80)}</div>
            <button onClick={onCancelReply} className="ml-2 text-gray-500">✕</button>
          </div>
        )}
        <div className="flex items-center w-full relative">
        {/* Sticker removed from composer - use attach menu's New sticker */}
        <button aria-label="Emoji" title="Emoji" onClick={() => setShowEmojiPicker(s => !s)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 mr-2">
          <Smile className="w-5 h-5" />
        </button>
        {showEmojiPicker && (
          <div className="absolute left-3 bottom-14 w-[520px] max-h-[420px] bg-white border rounded-lg shadow-lg p-3 z-50 flex flex-col">
            {/* Category row */}
            <div className="flex items-center space-x-4 overflow-x-auto pb-3">
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setActiveCategory(c.key)} className={`flex flex-col items-center px-3 py-1 focus:outline-none ${activeCategory === c.key ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className="text-2xl">{c.icon}</div>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mt-1">
              <input value={emojiSearch} onChange={(e) => setEmojiSearch(e.target.value)} placeholder="Search emoji" className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none" />
            </div>

            {/* Emoji grid with sections */}
            <div className="mt-3 overflow-auto flex-1">
              {Object.keys(EMOJI_CATEGORIES).map(catKey => {
                const label = CATEGORIES.find(c => c.key === catKey)?.label || catKey;
                if (activeCategory !== 'recent' && activeCategory !== catKey && activeCategory !== 'all') return null;
                const allEmojis = EMOJI_CATEGORIES[catKey] || [];
                const filtered = emojiSearch ? allEmojis.filter(e => e.includes(emojiSearch)) : allEmojis;
                if (filtered.length === 0) return null;
                return (
                  <div key={catKey} className="mb-4">
                    <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
                    <div className="grid grid-cols-8 gap-2">
                      {filtered.map(e => (
                        <button key={e} onClick={() => insertEmoji(e)} className="p-2 rounded hover:bg-gray-100 text-lg">{e}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom toolbar */}
            <div className="mt-2 border-t pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-md bg-gray-100 text-sm">😊</button>
                <button onClick={() => { setShowGifPicker(s => !s); setShowStickerPicker(false); }} className="px-3 py-2 rounded-md text-sm">GIF</button>
                <button onClick={() => { setShowStickerPicker(s => !s); setShowGifPicker(false); }} className="px-3 py-2 rounded-md text-sm">Sticker</button>
              </div>
              <div className="text-xs text-gray-400"> </div>
            </div>

            {/* GIF picker (shown when GIF toolbar button clicked) */}
            {showGifPicker && (
              <div className="mt-3 border-t pt-3">
                <div className="mb-2">
                  <input value={gifSearch} onChange={(e) => setGifSearch(e.target.value)} placeholder="Search GIFs" className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none" />
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-44 overflow-auto">
                  {GIFS.filter(g => gifSearch ? g.includes(gifSearch) : true).map(g => (
                   <button key={g} onClick={() => { onSend('', { type: 'gif', url: g, side: messageSide }); setShowEmojiPicker(false); setShowGifPicker(false); }} className="rounded overflow-hidden">
                      <img src={g} alt="gif" className="w-full h-24 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sticker picker (shows emoji stickers rendered as images) */}
            {showStickerPicker && (
              <div className="mt-3 border-t pt-3">
                <div className="grid grid-cols-6 gap-2 max-h-44 overflow-auto">
                  {STICKER_EMOJIS.map(s => (
                   <button key={s} onClick={() => { const url = makeStickerDataUrl(s); onSend('', { type: 'image', url, side: messageSide }); setShowStickerPicker(false); setShowEmojiPicker(false); }} className="p-2 rounded hover:bg-gray-100">
                      <div className="w-16 h-16 flex items-center justify-center text-3xl">{s}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <textarea
          ref={inputRef}
          rows={1}
          style={{ height: '30px', minHeight: '30px', paddingTop: '6px', paddingBottom: '4px' }}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const el = inputRef.current;
            if (el) {
              el.style.height = 'auto';
              const newH = Math.max(36, Math.min(el.scrollHeight, 240));
              el.style.height = newH + 'px';
            }
          }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(text, { side: messageSide }); setText(''); const el = inputRef.current; if (el) el.style.height = '36px'; } }}
            placeholder="Type a message"
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 resize-none max-h-60 overflow-auto py-0 leading-snug"
        />
        {/* Camera icon removed per design */}
        </div>
      </div>
      {/* Arrow buttons moved to the right side - both actions available on the right */}
      <div className="flex items-center space-x-2">
        {!exportMode && (
          <button onClick={() => { if (text.trim()) { onSend(text, { side: 'them' }); setText(''); } setMessageSide('them'); }} title="Left — receiver" className={`w-9 h-9 flex items-center justify-center rounded-full mr-0 bg-[#33A854] text-white shadow-md`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
            <circle cx="12" cy="12" r="11" fill="#33A854" />
            <g transform="rotate(180 12 12)">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" fill="#ffffff" />
            </g>
          </svg>
        </button>
        )}
        <button onClick={() => { if (text.trim()) { onSend(text, { side: 'me' }); setText(''); } setMessageSide('me'); }} title="Right — sender" className={`w-9 h-9 flex items-center justify-center rounded-full mr-0 bg-[#33A854] text-white shadow-md`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
            <circle cx="12" cy="12" r="11" fill="#33A853" />
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" fill="#ffffff" />
          </svg>
      </button>
      </div>
      {/* Primary send button removed - sending handled by left/right arrow buttons */}
    </div>
  );
};

const WhatsAppGenerator: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [_menuOpen, _setMenuOpen] = useState(false);
  const [_selectionMode, _setSelectionMode] = useState(false);
  const [_selectedIds, _setSelectedIds] = useState<string[]>([]);
  const [_showSettings, _setShowSettings] = useState(false);
  const [_themeMode, _setThemeMode] = useState<'light'|'dark'>('light');
  const [_showReadReceipts, _setShowReadReceipts] = useState(true);
  const [_profileName, _setProfileName] = useState('You');
  const [_avatarUrl, _setAvatarUrl] = useState<string | null>(null);
  const [_privacyLastSeen, _setPrivacyLastSeen] = useState<'everyone'|'contacts'|'nobody'>('contacts');
  const [_notificationsEnabled, _setNotificationsEnabled] = useState(true);
  const [_fontSize, _setFontSize] = useState<'small'|'medium'|'large'>('medium');
  const [, setTopNavPopup] = useState(false);
  const [topNavPlusPopup, setTopNavPlusPopup] = useState(false);
  // recording / export quality fixed to Full HD
  const [autoScrollDuringRecording, setAutoScrollDuringRecording] = useState<boolean>(true);

  // disable interactive WhatsApp behavior without removing UI
  const INTERACTIVE = true;

  // device frame / status bar simulation (removed — using default web frame)
  const [_deviceType, _setDeviceType] = useState<'ios'|'android'>('ios');
  // Toggle between mobile-style preview (centered 380px) and desktop preview (fill available space)
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(true);
  // hide left arrow during export/capture so screenshot shows single right arrow
  const [exportMode, setExportMode] = useState<boolean>(false);
  // settings panel visibility
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);

  // presence & typing simulation (not used in simplified UI)

  // function to simulate the other party typing for a chat (kept for completeness but unused)

  // Chats list and selection state for WhatsApp clone
  const [chats, setChats] = useState<any>(() => [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'Yes! See you at 3pm.',
      time: '9:05 AM',
      lastSeen: '9:05 AM',
      updatedAt: new Date().toISOString(),
      unread: 2,
      online: true,
      messages: [
        { id: 'm1', sender: 'them', text: 'Hey! Are we still on for coffee today?', time: '9:00 AM', type: 'text' },
        { id: 'm2', sender: 'me', text: "Yes! See you at 3pm.", time: '9:05 AM', type: 'text', delivered: true },
        { id: 'm3', sender: 'them', text: '', time: '9:10 AM', type: 'image', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
        { id: 'm4', sender: 'me', text: '', time: '9:12 AM', type: 'voice', duration: '0:12' }
      ]
    },
    {
      id: '2',
      name: 'Design Team',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'Updated the mockups.',
      time: 'Yesterday',
      lastSeen: 'Yesterday',
      unread: 0,
      online: false,
      messages: [
        { id: 'm1', sender: 'them', text: 'Updated the mockups.', time: 'Yesterday', type: 'text' }
      ]
    },
    {
      id: '3',
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1545996124-1b4a1b7f6f1c?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'Loved the photo!',
      time: '8:30 AM',
      lastSeen: '8:30 AM',
      unread: 1,
      online: true,
      messages: [
        { id: 'm1', sender: 'them', text: 'Loved the photo!', time: '8:30 AM', type: 'text' }
      ]
    },
    {
      id: '4',
      name: 'Mom',
      avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'Call me when free',
      time: '7:12 AM',
      lastSeen: '7:12 AM',
      unread: 0,
      online: false,
      messages: [
        { id: 'm1', sender: 'them', text: 'Call me when free', time: '7:12 AM', type: 'text' }
      ]
    },
    {
      id: '5',
      name: 'Startup Group',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'Sprint meeting at 10',
      time: 'Mon',
      lastSeen: 'Mon',
      unread: 3,
      online: false,
      messages: [
        { id: 'm1', sender: 'them', text: 'Sprint meeting at 10', time: 'Mon', type: 'text' }
      ]
    },
    {
      id: '6',
      name: 'Liam Carter',
      avatar: 'https://images.unsplash.com/photo-1545996109-05b9f2f9d0f2?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'Got the files — thanks!',
      time: 'Sun',
      lastSeen: 'Sun',
      unread: 0,
      online: false,
      messages: [
        { id: 'm1', sender: 'them', text: 'Got the files — thanks!', time: 'Sun', type: 'text' }
      ]
    },
    {
      id: '7',
      name: 'Ava Martinez',
      avatar: 'https://images.unsplash.com/photo-1545996124-1b4a1b7f6f1c?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'Can we reschedule?',
      time: 'Sat',
      lastSeen: 'Sat',
      unread: 5,
      online: true,
      messages: [
        { id: 'm1', sender: 'them', text: 'Can we reschedule?', time: 'Sat', type: 'text' }
      ]
    },
    {
      id: '8',
      name: 'Coffee Friends',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'Where to meet?',
      time: 'Fri',
      lastSeen: 'Fri',
      unread: 0,
      online: false,
      messages: [
        { id: 'm1', sender: 'them', text: 'Where to meet?', time: 'Fri', type: 'text' }
      ]
    },
    {
      id: '9',
      name: 'Sara Lee',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
      lastMessage: 'See you soon!',
      time: 'Thu',
      lastSeen: 'Thu',
      unread: 0,
      online: true,
      messages: [
        { id: 'm1', sender: 'them', text: 'See you soon!', time: 'Thu', type: 'text' }
      ]
    }
  ]);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [_viewChat, setViewChat] = useState<boolean>(false); // on small screens toggles list vs chat view

  // ref to the messages container so we can auto-scroll when messages change
  const messagesContainerRef = React.useRef<HTMLDivElement | null>(null);
  const fullChatRef = React.useRef<HTMLDivElement | null>(null);
  // recording refs/state
  const recordingRef = React.useRef<boolean>(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const captureIntervalRef = React.useRef<number | null>(null);
  const captureCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const recordedChunksRef = React.useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recordingAutoScrollRef = React.useRef<boolean>(false);
  // long-press timer ref for mobile touch -> open context menu
  const touchTimerRef = React.useRef<number | null>(null);
  // screenshot loading state
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);

  // inline edit state for selected chat name
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = React.useRef<HTMLInputElement | null>(null);

  // avatar file input ref for selected chat
  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);

  // handle avatar file selection and update selected chat avatar
  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file || !selectedChatId) return;
    const url = URL.createObjectURL(file);
    setChats((prev: any) => prev.map((c: any) => c.id === selectedChatId ? { ...c, avatar: url } : c));
    // clear input so same file can be selected again later
    if (e.target) e.target.value = '';
  }

  // toggle online/offline for the selected chat (clickable in header)
  function toggleSelectedChatOnline() {
    if (!selectedChatId) return;
    setChats((prev: any) => prev.map((c: any) => c.id === selectedChatId ? { ...c, online: !c.online } : c));
  }

  // helper to select a chat and clear its unread count

  // load chats from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('whatsapp_chats');
      if (raw) setChats(JSON.parse(raw));
    } catch (_e) { /* ignore */ }
  }, []);

  // persist chats
  useEffect(() => {
    try { localStorage.setItem('whatsapp_chats', JSON.stringify(chats)); } catch (_e) { /* ignore */ }
  }, [chats]);

  const selectedChat = chats.find((c: any) => c.id === selectedChatId) || null;

  function sendMessage(text: string, sender: 'me'|'them' = 'me') {
    if (!INTERACTIVE) return;
    if (!selectedChatId || !text.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      type: 'text',
      delivered: false,
      deliveredAt: undefined,
      read: false,
      readAt: undefined,
      reply: replyTo ? { id: replyTo.id, text: replyTo.text, sender: replyTo.sender } : undefined
    } as any;

    setChats((prev: any) => prev.map((c: any) => c.id === selectedChatId ? { ...c, messages: [...c.messages, newMsg], lastMessage: text.trim(), time: newMsg.time, updatedAt: new Date().toISOString() } : c));

    // mark as delivered shortly after sending (simulate network/delivery)
    setTimeout(() => {
      setChats((prev: any) => prev.map((c: any) => c.id === selectedChatId ? { ...c, messages: c.messages.map((m: any) => m.id === newMsg.id ? { ...m, delivered: true, deliveredAt: new Date().toISOString() } : m) } : c));
    }, 400);

    // animate new message briefly
    setNewMessageIds(prev => ({ ...prev, [newMsg.id]: true }));
    setTimeout(() => setNewMessageIds(prev => { const next = { ...prev }; delete next[newMsg.id]; return next; }), 900);

    // if this was a reply, briefly highlight the original message
    if (replyTo) {
      highlightMessage(replyTo.id);
      clearReply();
    }
  }

  function sendMediaMessage(options: { type: 'image'|'gif'|'file'|'audio', url: string, sender?: 'me'|'them' }) {
    if (!INTERACTIVE) return;
    if (!selectedChatId) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: options.sender || 'me',
      text: '',
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      type: options.type === 'gif' ? 'image' : (options.type === 'file' ? 'file' : options.type),
      url: options.url,
      delivered: false,
      deliveredAt: undefined,
      read: false,
      readAt: undefined,
      reply: replyTo ? { id: replyTo.id, text: replyTo.text, sender: replyTo.sender } : undefined
    } as any;

    setChats((prev: any) => prev.map((c: any) => c.id === selectedChatId ? { ...c, messages: [...c.messages, newMsg], lastMessage: '[GIF]', time: newMsg.time, updatedAt: new Date().toISOString() } : c));

    setTimeout(() => {
      setChats((prev: any) => prev.map((c: any) => c.id === selectedChatId ? { ...c, messages: c.messages.map((m: any) => m.id === newMsg.id ? { ...m, delivered: true, deliveredAt: new Date().toISOString() } : m) } : c));
    }, 400);

    setNewMessageIds(prev => ({ ...prev, [newMsg.id]: true }));
    setTimeout(() => setNewMessageIds(prev => { const next = { ...prev }; delete next[newMsg.id]; return next; }), 900);

    if (replyTo) {
      highlightMessage(replyTo.id);
      clearReply();
    }
  }
  
  // forward message helper

  // chats sorted by updatedAt descending by default

  // when selected chat changes or its messages change, ensure we scroll to bottom
  useEffect(() => {
    setTimeout(() => {
      messagesContainerRef.current?.scrollTo({ top: messagesContainerRef.current?.scrollHeight || 0, behavior: 'auto' });
    }, 60);
  }, [selectedChatId, chats]);

  // toggle message status: cycle through { none -> delivered -> read -> none }

  // --- Helpers: URL detection & date formatting ---



  // Context menu + message actions (edit/delete/react/forward)
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; msgId: string | null }>({ visible: false, x: 0, y: 0, msgId: null });

  function handleContextMenu(e: React.MouseEvent, msgId: string) {
    if (!INTERACTIVE) return;
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, msgId });
  }

  function closeContextMenu() {
    setContextMenu({ visible: false, x: 0, y: 0, msgId: null });
  }

  function handleTouchStart(e: React.TouchEvent, msgId: string) {
    if (!INTERACTIVE) return;
    const t = e.touches[0];
    touchTimerRef.current = window.setTimeout(() => {
      setContextMenu({ visible: true, x: t.clientX, y: t.clientY, msgId });
    }, 700);
  }

  function handleTouchEnd() {
    if (!INTERACTIVE) return;
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  }



  useEffect(() => {
    function onClick() { if (contextMenu.visible) closeContextMenu(); }
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [contextMenu.visible]);




  // Emoji picker state & handlers
  const [emojiPicker, setEmojiPicker] = useState<{ visible: boolean; msgId?: string | null; x?: number; y?: number }>({ visible: false, msgId: null, x: 0, y: 0 });

  function closeEmojiPicker() { setEmojiPicker({ visible: false, msgId: null, x: 0, y: 0 }); }

  function pickEmoji(emoji: string) {
    if (!INTERACTIVE) return;
    const msgId = emojiPicker.msgId;
    if (!msgId) { closeEmojiPicker(); return; }
    setChats((prev: any) => prev.map((c: any) => {
      if (c.id !== selectedChatId) return c;
      return { ...c, messages: c.messages.map((m: any) => {
        if (m.id !== msgId) return m;
        const reactions = { ...(m.reactions || {}) } as Record<string, number>;
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...m, reactions };
      }) };
    }));
    closeEmojiPicker();
    closeContextMenu();
  }
  // show message info (delivered/read times)

  // Search and filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, _setActiveFilter] = useState<'all'|'unread'|'favourites'|'groups'>('all');

  function filterChats(list: any[]) {
    let res = list.slice();
    if (activeFilter === 'unread') res = res.filter(c => c.unread && c.unread > 0);
    if (activeFilter === 'favourites') res = res.filter(c => c.favourite);
    if (activeFilter === 'groups') res = res.filter(c => c.name.toLowerCase().includes('group') || c.isGroup);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter(c => c.name.toLowerCase().includes(q) || (c.lastMessage || '').toLowerCase().includes(q));
    }
    return res;
  }

  const features = [
    {
      icon: User,
      title: 'Realistic Chat UI',
      description: 'Authentic WhatsApp interface with proper message bubbles, timestamps, and status indicators.'
    },
    {
      icon: Monitor,
      title: 'Device Frames',
      description: 'Choose between iPhone and Android frames with accurate status bars and navigation elements.'
    },
    {
      icon: Palette,
      title: 'Theme Support',
      description: 'Switch between light and dark themes to match your target platform and user preferences.'
    },
    {
      icon: Download,
      title: 'Export & Share',
      description: 'Export screenshots or plain text copies for docs, bug reports, tutorials, and stakeholder reviews.'
    },
    {
      icon: Shield,
      title: 'Privacy‑First',
      description: 'All generation happens locally in your browser — nothing is uploaded or stored on our servers.'
    },
    {
      icon: RefreshCw,
      title: 'Quick Presets',
      description: 'Load prebuilt conversation templates to speed up screenshots, demos, and test cases.'
    }
  ];

  // NOTE: removed unused useCases to avoid lint warnings

  const faqs = [
    {
      question: 'Is this a real WhatsApp chat?',
      answer: 'No. This is a simulator for mock conversations — it does not connect to WhatsApp or send messages.'
    },
    {
      question: 'Can I export the chats?',
      answer: 'Yes. Export as an image or plain text, or copy the conversation to your clipboard for sharing.'
    },
    {
      question: 'Is any data uploaded?',
      answer: 'No. All generation happens locally in your browser — we do not transmit or store your content.'
    },
    {
      question: 'Can I customize contact details?',
      answer: 'Yes. Edit names, avatars, last‑seen text, themes, and status‑bar details to match your scenario.'
    },
    {
      question: 'What else is planned?',
      answer: 'Planned features include image and voice message placeholders, direct image export, and shareable presets.'
    }
  ];

  // reply state & helpers
  const [replyTo, setReplyTo] = useState<any>(null);
  function clearReply() { setReplyTo(null); }
  // animation / highlight states
  const [_newMessageIds, setNewMessageIds] = useState<Record<string, boolean>>({});
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  // inline edit state for messages
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState<string>('');
  // briefly highlight replied-to message
  function highlightMessage(msgId: string) { setHighlightedMessageId(msgId); setTimeout(() => setHighlightedMessageId(null), 900); }

  // realistic sample messages catalog
  const SAMPLE_MESSAGES = [
    "Hey! Are we still on for today?",
    "Just pushed the latest updates to the repo.",
    "Can you review the mockups when you get a sec?",
    "On my way — be there in 10.",
    "Thanks! That looks great.",
    "Let's move the meeting to 3pm.",
    "Call me when you're free.",
    "Here's the file you asked for.",
    "LOL that's hilarious 😂",
    "Sending the screenshots now.",
    "Perfect — ship it.",
    "I'll take care of that tomorrow.",
    "Where should we meet?",
    "Good night! Talk tomorrow.",
    "Amazing work — love the direction."
  ];

  // simulate the other party typing briefly when chat opened
  const [, setShowTyping] = useState(false);
  useEffect(() => {
    if (!selectedChatId) { setShowTyping(false); return; }
    setShowTyping(true);
    const t = window.setTimeout(() => setShowTyping(false), 1200 + Math.random() * 1400);
    return () => window.clearTimeout(t);
  }, [selectedChatId]);

  // Ensure each chat has at least ~12 sample messages (between 10-15) with varied times and content
  useEffect(() => {
    setChats((prev: any[]) => prev.map((c: any) => {
      const existing = Array.isArray(c.messages) ? c.messages : [];
      const target = 12; // desired messages per chat
      if (existing.length >= target) return c;
      const need = target - existing.length;
      const more = Array.from({ length: need }).map((_, idx) => {
        const seq = existing.length + idx + 1;
        // pick a random sample sentence
        const text = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
        // create a realistic time within last 3 days
        const d = new Date();
        d.setHours(Math.floor(Math.random() * 12) + 8);
        d.setMinutes(Math.floor(Math.random() * 60));
        d.setDate(d.getDate() - Math.floor(Math.random() * 3));
        const timeStr = (function(dt: Date) {
          const today = new Date();
          if (dt.toDateString() === today.toDateString()) return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
          if (dt.toDateString() === yesterday.toDateString()) return 'Yesterday';
          return dt.toLocaleDateString();
        })(d);

        return {
          id: `${c.id}-gen-${seq}-${Date.now()}`,
          sender: seq % 2 === 0 ? 'me' : 'them',
          text,
          time: timeStr,
          type: 'text'
        };
      });
      return { ...c, messages: [...existing, ...more] };
    }));
  }, []);

  // -- Recording helpers
  async function startRecording(containerEl: HTMLElement | null) {
    if (!containerEl) { alert('Nothing to record'); return; }
    if (isRecording) return;
    const rect = containerEl.getBoundingClientRect();
    // compute a scale that targets Full HD width
    const scale = computeScaleForFullHD(containerEl, 1920 * 2);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(rect.width * scale));
    canvas.height = Math.max(1, Math.floor(rect.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) { alert('Cannot record'); return; }
    captureCanvasRef.current = canvas;
    recordedChunksRef.current = [];
    const fps = 30;
    const stream = (canvas as HTMLCanvasElement).captureStream(fps);
    let options: any = {};
    try { options = { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: Math.floor(2500000 * 2) }; } catch (e) { options = {}; }
    const mr = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mr;
    mr.ondataavailable = (ev: BlobEvent) => { if (ev.data && ev.data.size > 0) recordedChunksRef.current.push(ev.data); };
    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const chat = chats.find((c:any) => c.id === selectedChatId);
      a.download = `${(chat?.name || 'chat')}-recording.webm`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };
    try { mr.start(); } catch (e) { console.warn('Recorder start failed', e); }
    setIsRecording(true);
    recordingRef.current = true;
    // enable auto-scroll during recording
    recordingAutoScrollRef.current = true;
    // start from top so we can auto-scroll down during recording
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    captureIntervalRef.current = window.setInterval(async () => {
      try {
        // auto-scroll while recording: move toward bottom based on speed
        if (recordingAutoScrollRef.current && autoScrollDuringRecording && messagesContainerRef.current) {
          const el = messagesContainerRef.current;
          const target = el.scrollHeight;
          const current = el.scrollTop + el.clientHeight;
          const remaining = Math.max(0, target - current);
          if (remaining > 0) {
            // fast mode: jump to bottom; normal mode: step by 50% of remaining; slow mode: step by 20%
            const fast = false; // fast mode removed, always do normal stepping
            if (fast) {
              el.scrollTo({ top: target, behavior: 'auto' });
            } else {
              const factor = 0.5; // normal speed
              const step = Math.max(1, Math.ceil(remaining * factor));
              el.scrollTo({ top: el.scrollTop + step, behavior: 'auto' });
            }
          }
        } else {
          messagesContainerRef.current?.scrollTo({ top: messagesContainerRef.current?.scrollHeight || 0, behavior: 'auto' });
        }
        ensureImagesHaveCrossOrigin(containerEl);
        const scale = computeScaleForFullHD(containerEl, 1920 * 2);
        const shot = await html2canvas(containerEl, ({ background: null as any, useCORS: true, scale } as any));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scrollTop = (containerEl && (containerEl as HTMLElement).scrollTop) || 0;
        const sx = 0;
        const sy = Math.floor(scrollTop * scale);
        const sWidth = shot.width;
        const sHeight = Math.min(shot.height, Math.floor((containerEl as HTMLElement).clientHeight * scale));
        ctx.drawImage(shot, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      } catch (err) { /* ignore */ }
    }, Math.floor(1000 / 30));
  }

  function stopRecording() {
    if (!isRecording) return;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    if (captureIntervalRef.current) { window.clearInterval(captureIntervalRef.current); captureIntervalRef.current = null; }
    setIsRecording(false);
    recordingRef.current = false;
    recordingAutoScrollRef.current = false;
  }

  function ensureImagesHaveCrossOrigin(el: HTMLElement | null) {
    if (!el) return;
    const imgs = el.querySelectorAll('img');
    imgs.forEach((img:any) => {
      try {
        if (img && img.src && !img.src.startsWith('data:') && !img.src.startsWith('blob:')) {
          img.crossOrigin = 'anonymous';
          if (!img.complete) {
            img.src = img.src;
          }
        }
      } catch (_e) {}
    });
  }

  function computeScaleForFullHD(el: HTMLElement | null, targetWidth = 1920) {
    if (!el) return (window.devicePixelRatio || 1) * 2;
    const rect = el.getBoundingClientRect();
    const elWidth = rect.width || 1;
    // base multiplier to reach at least target width
    const base = Math.max(1, Math.ceil(targetWidth / elWidth));
    const dpr = window.devicePixelRatio || 1;
    // combine base and device pixel ratio but cap to avoid huge canvases
    const scale = Math.min(4, base * Math.min(2, dpr));
    return scale;
  }

  // add menu state for per-chat menu
  const [openChatMenuId, setOpenChatMenuId] = useState<string | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ x: number; y: number } | null>(null);

  function closeChatMenu() { setOpenChatMenuId(null); setMenuCoords(null); }

  function handleDeleteChat(id: string) {
    if (!confirm('Delete this chat? This cannot be undone.')) return;
    setChats((prev:any) => prev.filter((c:any) => c.id !== id));
    if (selectedChatId === id) { setSelectedChatId(null); setViewChat(false); }
    closeChatMenu();
  }

  // Small animated chat menu component positioned in viewport (fixed)
  const ChatMenu: React.FC<{ coords?: { x: number; y: number } | null; onClose: () => void; children?: React.ReactNode }> = ({ coords, onClose, children }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) onClose();
      }
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [onClose]);

    const style: React.CSSProperties = {
      position: 'fixed',
      left: coords ? `${coords.x}px` : 'auto',
      top: coords ? `${coords.y}px` : '50%',
      zIndex: 1000,
      transform: 'translateY(0)'
    };

    return (
      <div ref={ref} style={style} className="origin-right transform transition-all duration-200 ease-out scale-95 opacity-0 animate-menu-in">
        <div className="w-44 bg-white border rounded-lg shadow-lg z-40 overflow-hidden">
          {children}
        </div>
      </div>
    );
  };

  // Add minimal CSS keyframes for menu animation once
  useEffect(() => {
    const id = 'whatsapp-chat-menu-anim-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `
    @keyframes whatsappMenuIn {
      from { opacity: 0; transform: translateY(-6px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-menu-in { animation: whatsappMenuIn 180ms cubic-bezier(.2,.9,.3,1) forwards; }
    `;
    document.head.appendChild(style);
  }, []);

  // toggle handler computes menu coords and decides left/right placement
  function handleToggleMenu(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    if (!btn) return;
    if (openChatMenuId === id) { closeChatMenu(); return; }
    const rect = btn.getBoundingClientRect();
    const menuWidth = 176; // matches w-44
    const menuHeight = 260; // approximate
    const margin = 8;
    let x = rect.right + margin; // default to the right
    if (rect.right + menuWidth + margin > window.innerWidth) {
      // open to left of the button
      x = rect.left - menuWidth - margin;
      if (x < margin) x = margin;
    }
    let y = rect.top + rect.height / 2 - menuHeight / 2;
    y = Math.max(margin, Math.min(y, window.innerHeight - menuHeight - margin));
    setMenuCoords({ x: Math.round(x), y: Math.round(y) });
    setOpenChatMenuId(id);
  }

  // Refined Settings panel to match WhatsApp-like layout
  const SettingsPanel: React.FC<{ onClose: () => void; inline?: boolean }> = ({ onClose, inline = false }) => {
    const containerClass = inline ? 'w-full h-full bg-white p-0 overflow-auto' : 'fixed right-6 top-24 w-[300px] bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden';
    return (
      <div className={containerClass}>
        <div className="p-3">
          <h1 className="text-xl font-bold mb-3">Settings</h1>

          <div className="mb-3">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-gray-500 mr-3" />
              <input placeholder="Search settings" className="bg-transparent outline-none text-sm w-full placeholder-gray-500" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <img src={_avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200'} alt="me" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="text-base font-semibold">{_profileName || 'You'}</div>
              <div className="text-xs text-gray-500">Hey there! I am using WhatsApp.</div>
            </div>
          </div>

          <div className="border-t border-gray-100 mb-4" />

          <div className="space-y-2">
            <button className="w-full text-left flex items-start gap-3 px-2 py-2 hover:bg-gray-50 rounded">
              <div className="pt-0"><Key className="w-4 h-4 text-gray-600" /></div>
              <div>
                <div className="text-base font-medium">Account</div>
                <div className="text-xs text-gray-500">Security notifications, account info</div>
              </div>
            </button>

            <button className="w-full text-left flex items-start gap-3 px-2 py-2 hover:bg-gray-50 rounded">
              <div className="pt-0"><Lock className="w-4 h-4 text-gray-600" /></div>
              <div>
                <div className="text-base font-medium">Privacy</div>
                <div className="text-xs text-gray-500">Blocked contacts, disappearing messages</div>
              </div>
            </button>

            <button className="w-full text-left flex items-start gap-3 px-2 py-2 hover:bg-gray-50 rounded">
              <div className="pt-0"><FileText className="w-4 h-4 text-gray-600" /></div>
              <div>
                <div className="text-base font-medium">Chats</div>
                <div className="text-xs text-gray-500">Theme, wallpaper, chat settings</div>
              </div>
            </button>

            <button className="w-full text-left flex items-start gap-3 px-2 py-2 hover:bg-gray-50 rounded">
              <div className="pt-0"><Bell className="w-4 h-4 text-gray-600" /></div>
              <div>
                <div className="text-base font-medium">Notifications</div>
                <div className="text-xs text-gray-500">Message notifications</div>
              </div>
            </button>

            <button className="w-full text-left flex items-start gap-3 px-2 py-2 hover:bg-gray-50 rounded">
              <div className="pt-0"><Keyboard className="w-4 h-4 text-gray-600" /></div>
              <div>
                <div className="text-base font-medium">Keyboard shortcuts</div>
                <div className="text-xs text-gray-500">Quick actions</div>
              </div>
            </button>

            <button className="w-full text-left flex items-start gap-3 px-2 py-2 hover:bg-gray-50 rounded">
              <div className="pt-0"><HelpCircle className="w-4 h-4 text-gray-600" /></div>
              <div>
                <div className="text-base font-medium">Help</div>
                <div className="text-xs text-gray-500">Help center, contact us, privacy policy</div>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-100 mt-6 pt-4" />
          <div>
            <button onClick={() => { alert('Logged out (demo)'); onClose(); }} className="flex items-center gap-2 text-rose-600 font-medium mt-3">
              <LogOut className="w-4 h-4 text-rose-600" />
              <span className="text-sm">Log out</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Fake Detail</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-purple-600 transition-colors">About</Link>
              <Link to="/generators" className="text-gray-600 hover:text-purple-600 transition-colors">Generators</Link>
              <Link to="/generators" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">Get Started</Link>
            </nav>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-1">
              <Link to="/" className="block w-full text-left px-3 py-2 text-gray-600 hover:text-purple-600">Home</Link>
              <Link to="/about" className="block w-full text-left px-3 py-2 text-gray-600 hover:text-purple-600">About</Link>
              <Link to="/generators" className="block w-full text-left px-3 py-2 text-gray-600 hover:text-purple-600">Generators</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Back to Tools Link */}
            <div className="mb-8">
              <Link
                to="/"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Link>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              WhatsApp Chat Generator
            </h1>

            {/* Description */}
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Build believable WhatsApp-style chats in seconds for mockups, demos, and testing. Toggle device headers and themes for pixel‑accurate screenshots.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp Clone Interface - Full Featured */}
      <section id="generator" className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Try the WhatsApp Chat Interface</h2>
            <p className="text-gray-600">Fully functional WhatsApp clone with all features — works perfectly on both mobile and desktop</p>
          </div>

          {/* View Toggle and Tools */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobilePreview(!isMobilePreview)}
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors"
              >
                {isMobilePreview ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                <span>{isMobilePreview ? 'Mobile View' : 'Desktop View'}</span>
              </button>
              <button
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={() => startRecording(fullChatRef.current)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Record</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse"
                >
                  <div className="w-3 h-3 bg-white rounded-full" />
                  <span>Stop Recording</span>
                </button>
              )}
              <button
                onClick={async () => {
                  if (!fullChatRef.current) return;
                  setIsCapturingScreenshot(true);
                  try {
                    ensureImagesHaveCrossOrigin(fullChatRef.current);
                    await new Promise(resolve => setTimeout(resolve, 200));
                    const element = fullChatRef.current;
                    const canvas = await html2canvas(element, {
                      useCORS: true,
                      allowTaint: false,
                      backgroundColor: '#ffffff',
                      scale: 2,
                      logging: false,
                      imageTimeout: 15000,
                      removeContainer: false,
                      foreignObjectRendering: false,
                      width: element.offsetWidth,
                      height: element.offsetHeight,
                      windowWidth: element.scrollWidth,
                      windowHeight: element.scrollHeight,
                      scrollX: 0,
                      scrollY: 0,
                      x: 0,
                      y: 0
                    });
                    canvas.toBlob(blob => {
                      if (!blob) {
                        alert('Screenshot generation failed. Please try again.');
                        return;
                      }
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      const chat = chats.find((c:any) => c.id === selectedChatId);
                      a.download = `${(chat?.name || 'whatsapp')}-screenshot.png`;
                      document.body.appendChild(a);
                      a.click();
                      setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }, 100);
                    }, 'image/png', 1.0);
                  } catch (error) {
                    console.error('Screenshot failed:', error);
                    alert('Screenshot failed. Please try again or check browser console.');
                  } finally {
                    setIsCapturingScreenshot(false);
                  }
                }}
                disabled={isCapturingScreenshot}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCapturingScreenshot ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Capturing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Screenshot</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* WhatsApp Interface Container */}
          <div className="flex justify-center">
            <div className={`${isMobilePreview ? 'w-full max-w-md' : 'w-full'} transition-all duration-300`}>
              <div ref={fullChatRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ height: isMobilePreview ? '700px' : '80vh' }}>
                {/* Main WhatsApp Layout */}
                <div className="flex h-full">
                  {/* Left Sidebar - Chats List */}
                  <div className={`${!isMobilePreview ? 'w-96 border-r border-gray-200' : selectedChatId ? 'hidden' : 'w-full'} bg-white flex flex-col`}>
                    {/* Sidebar Header */}
                    <div className="bg-[#f0f2f5] px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setTopNavPlusPopup(!topNavPlusPopup)} className="p-2 hover:bg-gray-200 rounded-full relative">
                            <Plus className="w-5 h-5 text-gray-600" />
                            {topNavPlusPopup && (
                              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-50 py-2">
                                <button onClick={() => { const name = prompt('New chat name:'); if (name) { const newChat = { id: Date.now().toString(), name, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', lastMessage: '', time: 'Now', lastSeen: 'Now', unread: 0, online: false, messages: [] }; setChats((prev:any) => [newChat, ...prev]); setSelectedChatId(newChat.id); setViewChat(true); } setTopNavPlusPopup(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">New Chat</button>
                                <button onClick={() => { const name = prompt('New group name:'); if (name) { const newGroup = { id: Date.now().toString(), name, avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200', lastMessage: '', time: 'Now', lastSeen: 'Now', unread: 0, online: false, isGroup: true, messages: [] }; setChats((prev:any) => [newGroup, ...prev]); setSelectedChatId(newGroup.id); setViewChat(true); } setTopNavPlusPopup(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">New Group</button>
                              </div>
                            )}
                          </button>
                          <button onClick={() => setShowSettingsPanel(true)} className="p-2 hover:bg-gray-200 rounded-full">
                            <Settings className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      {/* Search */}
                      <div className="flex items-center bg-white rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="text"
                          placeholder="Search or start new chat"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Chats List */}
                    <div className="flex-1 overflow-y-auto">
                      {filterChats(chats.sort((a:any, b:any) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())).map((chat: any) => (
                        <div
                          key={chat.id}
                          onClick={() => { setSelectedChatId(chat.id); setViewChat(true); setChats((prev:any) => prev.map((c:any) => c.id === chat.id ? { ...c, unread: 0 } : c)); }}
                          className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 relative ${
                            selectedChatId === chat.id ? 'bg-[#f0f2f5]' : ''
                          }`}
                        >
                          <div className="relative">
                            <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                            {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                              <span className="text-xs text-gray-500">{chat.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">{chat.lastMessage || 'No messages yet'}</p>
                              {chat.unread > 0 && (
                                <span className="bg-[#25D366] text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                  {chat.unread}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleToggleMenu(e, chat.id)}
                            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Chat View */}
                  {selectedChat ? (
                    <div className={`flex-1 flex flex-col ${isMobilePreview && !selectedChatId ? 'hidden' : ''}`}>
                      {/* Chat Header */}
                      <div className="bg-[#f0f2f5] px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isMobilePreview && (
                            <button onClick={() => { setSelectedChatId(null); setViewChat(false); }} className="p-2 hover:bg-gray-200 rounded-full">
                              <ArrowLeft className="w-5 h-5" />
                            </button>
                          )}
                          <div className="relative">
                            <img
                              src={selectedChat.avatar}
                              alt={selectedChat.name}
                              className="w-10 h-10 rounded-full object-cover cursor-pointer"
                              onClick={() => avatarInputRef.current?.click()}
                            />
                            {selectedChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { if (!editingName) { setNameInput(selectedChat.name); setEditingName(true); } }}>
                            {editingName ? (
                              <input
                                ref={nameInputRef}
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                onBlur={() => {
                                  if (nameInput.trim()) {
                                    setChats((prev:any) => prev.map((c:any) => c.id === selectedChatId ? { ...c, name: nameInput.trim() } : c));
                                  }
                                  setEditingName(false);
                                }}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
                                className="font-semibold text-gray-900 bg-white px-2 py-1 rounded border"
                                autoFocus
                              />
                            ) : (
                              <div>
                                <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                                <p className="text-xs text-gray-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSelectedChatOnline(); }}>
                                  {selectedChat.online ? 'online' : `last seen ${selectedChat.lastSeen}`}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-200 rounded-full">
                            <Video className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded-full">
                            <Phone className="w-5 h-5 text-gray-600" />
                          </button>
                          <button onClick={(e) => { setTopNavPopup(true); e.stopPropagation(); }} className="p-2 hover:bg-gray-200 rounded-full relative">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-2 whatsapp-messages-bg"
                        style={{
                          backgroundColor: '#e5ddd5'
                        }}
                      >
                        {selectedChat.messages.map((msg: any, idx: number) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            onContextMenu={(e) => handleContextMenu(e, msg.id)}
                            onTouchStart={(e) => handleTouchStart(e, msg.id)}
                            onTouchEnd={handleTouchEnd}
                          >
                            <div
                              className={`max-w-[75%] rounded-lg px-3 py-2 ${
                                msg.sender === 'me'
                                  ? 'bg-[#d9fdd3]'
                                  : 'bg-white'
                              } ${highlightedMessageId === msg.id ? 'ring-2 ring-yellow-400' : ''} shadow-sm`}
                            >
                              {msg.reply && (
                                <div className="bg-gray-100 border-l-4 border-[#25D366] rounded px-2 py-1 mb-2 text-xs">
                                  <div className="font-semibold">{msg.reply.sender === 'me' ? 'You' : selectedChat.name}</div>
                                  <div className="text-gray-600 truncate">{msg.reply.text}</div>
                                </div>
                              )}
                              {msg.type === 'image' && msg.url && (
                                <img src={msg.url} alt="" className="rounded mb-1 max-w-full" />
                              )}
                              {msg.type === 'file' && msg.url && (
                                <div className="flex items-center gap-2 mb-1 bg-gray-50 p-2 rounded">
                                  <FileText className="w-6 h-6 text-blue-500" />
                                  <div className="text-sm">
                                    <div className="font-medium">Document</div>
                                    <div className="text-xs text-gray-500">File attachment</div>
                                  </div>
                                </div>
                              )}
                              {msg.type === 'voice' && (
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="bg-[#25D366] text-white p-2 rounded-full">
                                    <Music className="w-4 h-4" />
                                  </div>
                                  <div className="text-sm text-gray-600">{msg.duration || '0:00'}</div>
                                </div>
                              )}
                              {editingMessageId === msg.id ? (
                                <input
                                  value={editingMessageText}
                                  onChange={(e) => setEditingMessageText(e.target.value)}
                                  onBlur={() => {
                                    if (editingMessageText.trim()) {
                                      setChats((prev:any) => prev.map((c:any) => c.id === selectedChatId ? { ...c, messages: c.messages.map((m:any) => m.id === msg.id ? { ...m, text: editingMessageText.trim() } : m) } : c));
                                    }
                                    setEditingMessageId(null);
                                  }}
                                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                                  className="bg-white px-2 py-1 rounded border w-full"
                                  autoFocus
                                />
                              ) : (
                                msg.text && <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{msg.text}</p>
                              )}
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-[10px] text-gray-500">{msg.time}</span>
                                {msg.sender === 'me' && (
                                  <div className="text-gray-500">
                                    {msg.read ? <CheckCheck className="w-3 h-3 text-blue-500" /> : msg.delivered ? <CheckCheck className="w-3 h-3" /> : <CheckCheck className="w-3 h-3 opacity-50" />}
                                  </div>
                                )}
                              </div>
                              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {Object.entries(msg.reactions).map(([emoji, count]: [string, any]) => (
                                    <span key={emoji} className="text-xs bg-white px-1.5 py-0.5 rounded-full border">
                                      {emoji} {count}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <ChatComposer
                        onSend={(text, opts) => {
                          if (opts?.type && opts.type !== 'text') {
                            sendMediaMessage({ type: opts.type as any, url: opts.url!, sender: opts.side || 'me' });
                          } else {
                            sendMessage(text, opts?.side || 'me');
                          }
                        }}
                        replyTo={replyTo}
                        onCancelReply={clearReply}
                        exportMode={exportMode}
                      />
                    </div>
                  ) : (
                    !isMobilePreview && (
                      <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
                        <div className="text-center">
                          <MessageCircle className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-2xl font-semibold text-gray-600 mb-2">WhatsApp Web</h3>
                          <p className="text-gray-500">Select a chat to start messaging</p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Context Menu */}
                {contextMenu.visible && contextMenu.msgId && (
                  <div
                    style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y, zIndex: 100 }}
                    className="bg-white rounded-lg shadow-lg border py-1 min-w-[160px]"
                  >
                    <button onClick={() => { setReplyTo(selectedChat.messages.find((m:any) => m.id === contextMenu.msgId)); closeContextMenu(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Reply</button>
                    <button onClick={() => { setEmojiPicker({ visible: true, msgId: contextMenu.msgId, x: contextMenu.x, y: contextMenu.y }); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">React</button>
                    <button onClick={() => { const msg = selectedChat.messages.find((m:any) => m.id === contextMenu.msgId); if (msg) { setEditingMessageId(msg.id); setEditingMessageText(msg.text); } closeContextMenu(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Edit</button>
                    <button onClick={() => { if (confirm('Delete this message?')) { setChats((prev:any) => prev.map((c:any) => c.id === selectedChatId ? { ...c, messages: c.messages.filter((m:any) => m.id !== contextMenu.msgId) } : c)); } closeContextMenu(); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600">Delete</button>
                  </div>
                )}

                {/* Chat menu positioned in viewport */}
                {openChatMenuId && menuCoords && (
                  <ChatMenu coords={menuCoords} onClose={closeChatMenu}>
                    <button onClick={() => { const c = chats.find((ch:any) => ch.id === openChatMenuId); if (c) { setChats((prev:any) => prev.map((ch:any) => ch.id === openChatMenuId ? { ...ch, favourite: !ch.favourite } : ch)); } closeChatMenu(); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm flex items-center gap-3">
                      <Star className="w-4 h-4" />
                      <span>Toggle Favourite</span>
                    </button>
                    <button onClick={() => { setChats((prev:any) => prev.map((c:any) => c.id === openChatMenuId ? { ...c, unread: 0 } : c)); closeChatMenu(); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm flex items-center gap-3">
                      <CheckCheck className="w-4 h-4" />
                      <span>Mark as Read</span>
                    </button>
                    <button onClick={() => { handleDeleteChat(openChatMenuId); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-red-600 flex items-center gap-3">
                      <X className="w-4 h-4" />
                      <span>Delete Chat</span>
                    </button>
                  </ChatMenu>
                )}

                {/* Settings panel positioned in viewport when shown */}
                {showSettingsPanel && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSettingsPanel(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                      <SettingsPanel onClose={() => setShowSettingsPanel(false)} inline />
                    </div>
                  </div>
                )}

                {/* Hidden avatar file input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>
            </div>
          </div>

          {/* Recording controls info */}
          {isRecording && autoScrollDuringRecording && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800 font-medium">Recording in progress with auto-scroll...</p>
              <p className="text-sm text-red-600 mt-1">The chat will automatically scroll to capture all messages</p>
            </div>
          )}

          {/* Feature highlights below interface */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <MessageSquare className="w-10 h-10 text-[#25D366] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Full Chat Features</h3>
              <p className="text-sm text-gray-600">Reply, react, edit messages, and send media — just like real WhatsApp</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Target className="w-10 h-10 text-[#25D366] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p className="text-sm text-gray-600">Perfect on mobile and desktop — toggle between views instantly</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Users className="w-10 h-10 text-[#25D366] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Chats</h3>
              <p className="text-sm text-gray-600">Manage multiple conversations, groups, and contacts seamlessly</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Use</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">Follow these simple steps to create, customize, and export realistic WhatsApp chats.</p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 items-start">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg">01</div>
              <User className="w-6 h-6 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compose Messages</h3>
              <p className="text-gray-600 leading-relaxed">Add messages as either participant, edit text inline, and set delivery/read states for each message.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg">02</div>
              <Palette className="w-6 h-6 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Configure Settings</h3>
              <p className="text-gray-600 leading-relaxed">Choose device type, theme (dark/light), timestamps, and read receipts to match your target platform.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg">03</div>
              <Monitor className="w-6 h-6 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Preview & Tweak</h3>
              <p className="text-gray-600 leading-relaxed">Use the live preview to fine-tune message order, avatars, and ephemeral/voice attachments before exporting.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg">04</div>
              <Download className="w-6 h-6 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Export or Share</h3>
              <p className="text-gray-600 leading-relaxed">Download as image/video/text, copy to clipboard, or embed the conversation in tickets and docs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Fine-grained controls and presets to help you craft convincing chat screenshots quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">Built for realism, speed, and team workflows — create believable chats without manual pixel-pushing.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-sm hover:shadow-xl border border-gray-100">
              <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <CheckCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Accurate Rendering</h3>
              <p className="text-gray-600 leading-relaxed">Faithful representation of WhatsApp UI elements, including status indicators and timestamps.</p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-sm hover:shadow-xl border border-gray-100">
              <div className="w-16 h-16 bg-indigo-500 rounded-xl flex items-center justify-center mb-6">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Fully Customizable</h3>
              <p className="text-gray-600 leading-relaxed">Switch themes, device frames, and message states to match your target platform and scenario.</p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-sm hover:shadow-xl border border-gray-100">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Team Friendly</h3>
              <p className="text-gray-600 leading-relaxed">Copy, download, or embed conversations into tickets and docs so teams can reproduce issues faster.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/50 overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 md:p-8 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        openFaq === index 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                      }`}>
                        <span className="font-bold text-sm">{index + 1}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 pr-4 group-hover:text-purple-700 transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      openFaq === index 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rotate-180' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                    }`}>
                      <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                      <div className="ml-14 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-l-4 border-gradient-to-b border-purple-500">
                        <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Create chat screenshots quickly
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Compose and export believable WhatsApp chats for demos and testing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Generating
            </button>
            <Link 
              to="/"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Explore More Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Footer is rendered globally by App */}

      {/* Emoji picker */}
      {emojiPicker.visible && (
        <div style={{ position: 'fixed', left: (emojiPicker.x || 0), top: ((emojiPicker.y || 0) + 8), zIndex: 70 }}>
          <div className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden p-2 flex gap-2">
            {['👍','❤️','😂','😮','😢','��','🔥'].map(e => (
              <button key={e} onClick={() => pickEmoji(e)} className="text-lg px-2 py-1 hover:bg-gray-100 rounded">{e}</button>
            ))}
            <button onClick={closeEmojiPicker} className="text-sm px-2 py-1 text-gray-500">Close</button>
          </div>
        </div>
      )}
      {/* SettingsPanel rendered inline in left column; global render removed */}
    </div>
  );
};

export default WhatsAppGenerator;
