import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { MessageCircle, Send, Trash2 } from 'lucide-react';

export default function Chat() {
  const { chatMessages, currentUser, tournaments, sendChatMessage } = useStore();
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]?.id || 'general');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tournamentMessages = chatMessages.filter(m => m.tournamentId === selectedTournament);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tournamentMessages]);

  const handleSend = () => {
    if (!message.trim() || !currentUser) return;
    sendChatMessage(currentUser.id, currentUser.fullName, message.trim(), selectedTournament);
    setMessage('');
  };

  return (
    <div className="space-y-4 h-[calc(100vh-180px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Tournament Chat</h1>
        </div>
        <select value={selectedTournament} onChange={e => setSelectedTournament(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="general">General</option>
          {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-y-auto">
        {tournamentMessages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tournamentMessages.map(msg => {
              const isMe = msg.userId === currentUser?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                    isMe ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}>
                    {!isMe && <p className="text-xs font-medium mb-1 opacity-70">{msg.userName}</p>}
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input type="text" value={message} onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500" />
        <button onClick={handleSend}
          className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
