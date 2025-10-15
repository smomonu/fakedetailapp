import React, { useState, useRef } from 'react';
import { Download, ArrowLeft, Camera, Mic, Phone, Video, MoreVertical, Search, Smile, Paperclip, Check, CheckCheck, Clock, Wifi, Battery, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  image?: string;
}

function WhatsappChatGenerator() {
  const [contactName, setContactName] = useState('John Doe');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [profilePic, setProfilePic] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [messageStatus, setMessageStatus] = useState<'sending' | 'sent' | 'delivered' | 'read'>('read');
  const [lastSeen, setLastSeen] = useState('online');
  const [battery, setBattery] = useState('100');
  const [networkType, setNetworkType] = useState('5G');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [messageImage, setMessageImage] = useState('');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [chatBackground, setChatBackground] = useState('#e5ddd5');
  const [showHeader, setShowHeader] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageImageRef = useRef<HTMLInputElement>(null);

  const generateTime = () => {
    if (customTime) return customTime;
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const addMessage = (sender: 'me' | 'other') => {
    if (!messageText.trim() && !messageImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender,
      time: generateTime(),
      status: messageStatus,
      image: messageImage || undefined,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    setMessageImage('');
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMessageImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMessageImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadScreenshot = async () => {
    if (!chatRef.current) return;

    try {
      const canvas = await html2canvas(chatRef.current, {
        scale: 2,
        backgroundColor: chatBackground,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `whatsapp-chat-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating screenshot:', error);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setContactName('John Doe');
    setProfilePic('');
    setMessageText('');
    setCustomTime('');
    setMessageImage('');
  };

  const renderStatusIcon = (status: string, sender: string) => {
    if (sender !== 'me') return null;

    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-500" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-500" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-500" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const backgroundOptions = [
    { name: 'Default', value: '#e5ddd5' },
    { name: 'Dark', value: '#0d1418' },
    { name: 'Light', value: '#ffffff' },
    { name: 'Blue', value: '#d4e7f5' },
    { name: 'Pink', value: '#f5d4e7' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              WhatsApp Chat Generator
            </h1>
            <p className="text-gray-600 text-lg">
              Create realistic WhatsApp conversations with advanced customization
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePicUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Upload Profile Picture
                  </button>
                  {profilePic && (
                    <img src={profilePic} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Seen Status
                  </label>
                  <input
                    type="text"
                    value={lastSeen}
                    onChange={(e) => setLastSeen(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., online, last seen today at 10:30 AM"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Message Settings</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Text
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 resize-none"
                    placeholder="Type your message..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Image
                  </label>
                  <input
                    type="file"
                    ref={messageImageRef}
                    onChange={handleMessageImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => messageImageRef.current?.click()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Attach Image
                  </button>
                  {messageImage && (
                    <img src={messageImage} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Time (HH:MM)
                  </label>
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 14:30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Status
                  </label>
                  <select
                    value={messageStatus}
                    onChange={(e) => setMessageStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="sending">Sending</option>
                    <option value="sent">Sent</option>
                    <option value="delivered">Delivered</option>
                    <option value="read">Read</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addMessage('me')}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                  >
                    Add as Sender
                  </button>
                  <button
                    onClick={() => addMessage('other')}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
                  >
                    Add as Receiver
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Display Settings</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    View Mode
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        viewMode === 'mobile' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Mobile
                    </button>
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        viewMode === 'desktop' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Desktop
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {backgroundOptions.map((bg) => (
                      <button
                        key={bg.value}
                        onClick={() => setChatBackground(bg.value)}
                        className={`py-2 px-3 rounded-lg border-2 transition-all text-xs ${
                          chatBackground === bg.value ? 'border-green-500 bg-green-50' : 'border-gray-300'
                        }`}
                      >
                        {bg.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Battery %
                  </label>
                  <input
                    type="number"
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Network Type
                  </label>
                  <select
                    value={networkType}
                    onChange={(e) => setNetworkType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="5G">5G</option>
                    <option value="4G">4G</option>
                    <option value="3G">3G</option>
                    <option value="WiFi">WiFi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Time (HH:MM)
                  </label>
                  <input
                    type="text"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="14:30"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showHeader"
                    checked={showHeader}
                    onChange={(e) => setShowHeader(e.target.checked)}
                    className="w-4 h-4 text-green-500"
                  />
                  <label htmlFor="showHeader" className="text-sm text-gray-700">
                    Show Header
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showStatusBar"
                    checked={showStatusBar}
                    onChange={(e) => setShowStatusBar(e.target.checked)}
                    className="w-4 h-4 text-green-500"
                  />
                  <label htmlFor="showStatusBar" className="text-sm text-gray-700">
                    Show Status Bar
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
                <button
                  onClick={downloadScreenshot}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Screenshot
                </button>

                <button
                  onClick={resetChat}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Reset Chat
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>

                <div className="flex justify-center">
                  <div
                    ref={chatRef}
                    className={`bg-black rounded-2xl overflow-hidden shadow-2xl ${
                      viewMode === 'mobile' ? 'w-full max-w-md' : 'w-full'
                    }`}
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {showStatusBar && (
                      <div className="bg-white px-6 py-2 flex items-center justify-between text-xs">
                        <span className="font-medium">{currentTime}</span>
                        <div className="flex items-center gap-2">
                          <Signal className="w-4 h-4" />
                          <span className="font-medium">{networkType}</span>
                          <Wifi className="w-4 h-4" />
                          <Battery className="w-4 h-4" />
                          <span className="font-medium">{battery}%</span>
                        </div>
                      </div>
                    )}

                    {showHeader && (
                      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
                        <ArrowLeft className="w-6 h-6" />
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          {profilePic ? (
                            <img src={profilePic} alt={contactName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-600 text-lg font-semibold">
                              {contactName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{contactName}</div>
                          <div className="text-xs opacity-90">{lastSeen}</div>
                        </div>
                        <div className="flex gap-5">
                          <Video className="w-5 h-5" />
                          <Phone className="w-5 h-5" />
                          <MoreVertical className="w-5 h-5" />
                        </div>
                      </div>
                    )}

                    <div
                      className="min-h-[500px] max-h-[600px] overflow-y-auto p-4 space-y-2"
                      style={{
                        backgroundColor: chatBackground,
                      }}
                    >
                      {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-20">
                          <p>No messages yet. Add messages using the form.</p>
                        </div>
                      )}

                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-lg shadow-sm cursor-pointer group relative ${
                              msg.sender === 'me' ? 'bg-[#dcf8c6]' : 'bg-white'
                            }`}
                            onClick={() => deleteMessage(msg.id)}
                          >
                            {msg.image && (
                              <img
                                src={msg.image}
                                alt="Message"
                                className="w-full rounded-t-lg max-h-64 object-cover"
                              />
                            )}
                            {msg.text && (
                              <div className="px-3 py-2">
                                <p className="text-gray-900 text-sm break-words">{msg.text}</p>
                              </div>
                            )}
                            <div className={`flex items-center justify-end gap-1 ${msg.text ? 'px-3 pb-2' : 'px-3 py-2'}`}>
                              <span className="text-[10px] text-gray-600">{msg.time}</span>
                              {renderStatusIcon(msg.status, msg.sender)}
                            </div>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              Click to delete
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#f0f0f0] px-3 py-2 flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Smile className="w-6 h-6 text-gray-600" />
                        <Paperclip className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">
                        Type a message
                      </div>
                      <Mic className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>

                {messages.length > 0 && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Click any message to delete it
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsappChatGenerator;
