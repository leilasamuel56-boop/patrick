import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, CheckCheck, User, Search, ArrowLeft, MoreHorizontal, MessageSquarePlus } from 'lucide-react';
import { Message } from '../types';

interface MessagesTabProps {
  messages: Message[];
  onSendMessage: (conversationId: string, replyText: string) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({ messages, onSendMessage }) => {
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for conversation messages to simulate chat history
  const [chatHistory, setChatHistory] = useState<Record<string, { sender: 'me' | 'them'; text: string; time: string }[]>>({
    'msg-1': [
      { sender: 'them', text: "Bonjour Gérad, j'ai passé en revue vos dernières propositions de prompt pour le service marketing. C'est remarquable.", time: '09:12' },
      { sender: 'them', text: "Je vous conseille de tester la technique de Chain-of-Thought sur la question du budget.", time: '09:15' }
    ],
    'msg-2': [
      { sender: 'them', text: "Félicitations pour l'obtention de votre dernier certificat !", time: 'Hier, 16:55' },
      { sender: 'them', text: "Votre solde de 38 000 € est disponible pour tout autre cursus de votre choix.", time: 'Hier, 17:00' }
    ]
  });

  const handleSend = () => {
    if (!replyText.trim() || !activeMessage) return;
    
    const newMsg = {
      sender: 'me' as const,
      text: replyText,
      time: '12:54'
    };

    setChatHistory(prev => ({
      ...prev,
      [activeMessage.id]: [...(prev[activeMessage.id] || []), newMsg]
    }));

    onSendMessage(activeMessage.id, replyText);
    setReplyText('');

    // Simulate auto-reply from instructor/support after 1.5 seconds for true luxury interaction!
    setTimeout(() => {
      const instructorReply = {
        sender: 'them' as const,
        text: "Entendu Gérad, j'accuse bonne réception. Je reste à votre entière disposition pour notre prochain coaching hebdomadaire.",
        time: '12:55'
      };
      setChatHistory(prev => ({
        ...prev,
        [activeMessage.id]: [...(prev[activeMessage.id] || []), instructorReply]
      }));
    }, 1500);
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 h-full flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {!activeMessage ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Messagerie</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Échangez en direct avec vos tuteurs d'élite et conseillers pédagogiques.
                </p>
              </div>
              <button className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700 bg-white hover:bg-slate-50">
                <MessageSquarePlus className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher une discussion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500"
              />
            </div>

            {/* Conversations List */}
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto no-scrollbar">
              {filteredMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveMessage(msg)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    msg.unread
                      ? 'bg-blue-50/40 border-blue-100/60 shadow-xs'
                      : 'bg-white border-slate-100 shadow-2xs'
                  }`}
                >
                  {/* User Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={msg.sender.avatar}
                      alt={msg.sender.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    {msg.unread && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className={`text-xs ${msg.unread ? 'font-extrabold text-slate-950' : 'font-bold text-slate-800'}`}>
                        {msg.sender.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      {msg.sender.role}
                    </p>
                    <p className={`text-xs mt-1.5 line-clamp-1 leading-relaxed ${msg.unread ? 'text-slate-800 font-medium' : 'text-slate-500 font-normal'}`}>
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-6 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-600">Aucun message trouvé</p>
                  <p className="text-xs text-slate-400">Essayez une autre recherche.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Active Chat Conversation view */
          <motion.div
            key="conversation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-0 bg-slate-50 z-45 flex flex-col justify-between pointer-events-auto pt-10"
          >
            {/* Active Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveMessage(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <img
                  src={activeMessage.sender.avatar}
                  alt={activeMessage.sender.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-800 leading-tight">
                    {activeMessage.sender.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {activeMessage.sender.role}
                  </span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Conversation messages body */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 bg-slate-50">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  DÉBUT DE LA SESSION DE MENTORAT
                </span>
              </div>

              {(chatHistory[activeMessage.id] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    <p className="font-medium">{msg.text}</p>
                    <div className="flex justify-end items-center gap-1 mt-1 text-[9px] opacity-70">
                      <span>{msg.time}</span>
                      {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input text-area */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Rédiger votre message..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              />
              <button
                disabled={!replyText.trim()}
                onClick={handleSend}
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all ${
                  replyText.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 cursor-pointer'
                    : 'bg-slate-200 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
