import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video,
  Bot,
  User,
  Check,
  CheckCheck
} from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot' | 'client';
  timestamp: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Olá! Como posso te ajudar hoje?", sender: 'bot', timestamp: '14:00' },
    { id: 2, content: "Gostaria de saber o preço do plano premium.", sender: 'client', timestamp: '14:01' },
    { id: 3, content: "Claro! O plano premium custa R$ 99/mês e inclui todas as funções de automação.", sender: 'bot', timestamp: '14:01' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      content: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        content: "Entendido! Vou verificar isso para você agora mesmo.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Chat List */}
      <div className="w-80 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <input 
            type="text" 
            placeholder="Buscar conversas..." 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 ${i === 1 ? 'border-emerald-500 bg-emerald-50/30' : 'border-transparent'}`}>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                C{i}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-slate-900 truncate">Cliente {i}</h4>
                  <span className="text-[10px] text-slate-400">14:20</span>
                </div>
                <p className="text-xs text-slate-500 truncate">Última mensagem enviada aqui...</p>
              </div>
              {i === 1 && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
              C1
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Cliente 1</h4>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
              <Phone size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
              <Video size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' || msg.sender === 'bot' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] flex flex-col ${msg.sender === 'user' || msg.sender === 'bot' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'bot' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.sender === 'bot' && <div className="flex items-center gap-1 mb-1 text-[10px] font-bold opacity-70 uppercase tracking-widest"><Bot size={10} /> IA Assistente</div>}
                  {msg.content}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  {(msg.sender === 'user' || msg.sender === 'bot') && <CheckCheck size={12} className="text-emerald-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Smile size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
