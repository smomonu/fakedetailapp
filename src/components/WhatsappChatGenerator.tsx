import React, { useState, useRef } from 'react';
import { Download, ArrowLeft, Send, Smile, Paperclip, Camera, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

function WhatsappChatGenerator() {
  const [contactName, setContactName] = useState('John Doe');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [profilePic, setProfilePic] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const generateTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const addMessage = (sender: 'me' | 'other') => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender,
      time: generateTime(),
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const downloadScreenshot = async () => {
    if (!chatRef.current) return;

    try {
      const canvas = await html2canvas(chatRef.current, {
        scale: 2,
        backgroundColor: '#e5ddd5',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `whatsapp-chat-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating screenshot:', error);
    }
  };

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

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              WhatsApp Chat Generator
            </h1>
            <p className="text-gray-600 text-lg">
              Create realistic WhatsApp conversations and download as images
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat Settings</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture URL (optional)
                </label>
                <input
                  type="text"
                  value={profilePic}
                  onChange={(e) => setProfilePic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Text
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                  placeholder="Type your message..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => addMessage('me')}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Add as Sender
                </button>
                <button
                  onClick={() => addMessage('other')}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Add as Receiver
                </button>
              </div>

              <button
                onClick={downloadScreenshot}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Screenshot
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>

              <div ref={chatRef} className="bg-white rounded-lg overflow-hidden" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
                    <div className="text-xs opacity-90">online</div>
                  </div>
                  <div className="flex gap-5">
                    <Camera className="w-5 h-5" />
                    <div className="flex flex-col gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div
                  className="min-h-[400px] p-4 space-y-2"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23e5ddd5\'/%3E%3Cpath d=\'M50 10L60 30 40 30z\' fill=\'%23d1c7b7\' opacity=\'.1\'/%3E%3C/svg%3E")',
                    backgroundColor: '#e5ddd5',
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
                        className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm cursor-pointer group relative ${
                          msg.sender === 'me'
                            ? 'bg-[#dcf8c6]'
                            : 'bg-white'
                        }`}
                        onClick={() => deleteMessage(msg.id)}
                      >
                        <p className="text-gray-900 text-sm break-words">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-gray-600">{msg.time}</span>
                          {msg.sender === 'me' && (
                            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                              <path d="M5.5 7L2 3.5L3.5 2L5.5 4L10 0L11.5 1.5L5.5 7Z" fill="#4FC3F7"/>
                              <path d="M10.5 7L7 3.5L8.5 2L10.5 4L15 0L16.5 1.5L10.5 7Z" fill="#4FC3F7"/>
                            </svg>
                          )}
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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

              {messages.length > 0 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Click any message to delete it
                </p>
              )}
            </div>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Set Contact Details</h3>
                <p>Enter the contact name and optionally add a profile picture URL.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Create Messages</h3>
                <p>Type your message and choose to add it as sender or receiver.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">3. Edit Messages</h3>
                <p>Click on any message in the preview to delete it.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">4. Download</h3>
                <p>Click the download button to save your chat as an image.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsappChatGenerator;
