import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { createCareerChat } from '../services/geminiService';
import { Send, Bot, User, RotateCcw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  profile: UserProfile;
}

export const ChatInterface: React.FC<Props> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `Hi ${profile.name}! I've analyzed your profile. I'm ready to help you navigate from ${profile.currentRole} to ${profile.targetRole}. What's on your mind?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSession = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSession.current) {
      chatSession.current = createCareerChat(profile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSession.current.sendMessage({ message: userMsg.text });
      const responseText = result.text;

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I couldn't generate a response.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-w-5xl mx-auto m-6">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Consultant Chat</h3>
            <p className="text-xs text-slate-400">Always online • Context aware</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages(messages.slice(0,1))} 
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          title="Reset Chat"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-emerald-900/30 text-emerald-50 border border-emerald-800/50' 
                : 'bg-slate-700/50 text-slate-100 border border-slate-600'
            }`}>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              <div className="mt-2 text-xs opacity-40 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
             </div>
             <div className="bg-slate-700/50 rounded-2xl p-4 flex items-center">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about interview prep, specific skills, or resume tips..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-14"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};