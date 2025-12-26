
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, ChatState } from './types';
import { geminiService } from './services/geminiService';
import { SendIcon, SparklesIcon, TrashIcon } from './components/Icons';
import ChatMessage from './components/ChatMessage';
import PricingModal from './components/PricingModal';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    userStatus: 'free',
    messageCount: 0,
  });
  const [inputValue, setInputValue] = useState('');
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [state.messages]);

  const handleSendMessage = async (text: string = inputValue) => {
    const messageText = text.trim();
    if (!messageText || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: messageText,
      timestamp: new Date(),
    };

    const modelMessagePlaceholder: Message = {
      id: (Date.now() + 1).toString(),
      role: Role.MODEL,
      text: '',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, modelMessagePlaceholder],
      isLoading: true,
      error: null,
      messageCount: prev.messageCount + 1
    }));
    
    setInputValue('');

    try {
      let currentImageUrl = '';
      await geminiService.sendMessage(
        messageText, 
        (chunk) => {
          setState(prev => {
            const newMessages = [...prev.messages];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0 && newMessages[lastIndex].role === Role.MODEL) {
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                text: newMessages[lastIndex].text + chunk
              };
            }
            return { ...prev, messages: newMessages };
          });
        },
        (url) => {
          currentImageUrl = url;
          setState(prev => {
            const newMessages = [...prev.messages];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0 && newMessages[lastIndex].role === Role.MODEL) {
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                imageUrl: url
              };
            }
            return { ...prev, messages: newMessages };
          });
        }
      );
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message,
        messages: prev.messages.filter(m => m.id !== modelMessagePlaceholder.id)
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const clearChat = () => {
    if (window.confirm("Hapus riwayat percakapan BinnAI?")) {
      geminiService.resetChat();
      setState(prev => ({
        ...prev,
        messages: [],
        isLoading: false,
        error: null
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#020617] text-slate-200">
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        onSubscribe={() => {}} 
      />

      <header className="flex-shrink-0 h-16 glass-panel border-b border-white/5 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setIsPricingOpen(true)}
            className="w-9 h-9 rounded-xl binnai-bg flex items-center justify-center shadow-lg shadow-purple-500/20 cursor-pointer active:scale-95 transition-all"
          >
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-none">
              Binn<span className="binnai-gradient">AI</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Development Phase</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPricingOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            Subscription Info
          </button>
          <button onClick={clearChat} className="p-2 text-slate-500 hover:text-red-400 transition-all">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div ref={scrollRef} className="h-full overflow-y-auto chat-scroll px-4 py-10 md:px-24 lg:px-48 xl:px-80">
          {state.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[85%] text-center space-y-10 animate-message">
              <div className="relative group cursor-pointer" onClick={() => setIsPricingOpen(true)}>
                <div className="absolute inset-0 binnai-bg blur-[80px] opacity-10 rounded-full"></div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[2.5rem] binnai-bg p-6 shadow-2xl flex items-center justify-center animate-bounce duration-[5000ms]">
                  <SparklesIcon className="w-full h-full text-white" />
                </div>
              </div>
              
              <div className="space-y-6 px-6">
                <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter">AI Lebih Cerdas.</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">🧠 Percakapan</span>
                  <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest">💻 Coding</span>
                  <span className="px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-black text-pink-400 uppercase tracking-widest">🎨 Generate Foto</span>
                </div>
                <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
                  Selamat datang di BinnAI! Saat ini sistem langganan sedang dalam pengembangan. Nikmati semua fitur premium kami secara <span className="text-white font-bold">bebas biaya</span> selama masa pengembangan.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col pb-10">
              {state.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {state.error && (
                <div className="mx-auto bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-2xl text-[12px] mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {state.error}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="flex-shrink-0 p-4 sm:p-6 md:px-24 lg:px-48 xl:px-80 glass-panel border-t border-white/5 z-20">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Tanya BinnAI atau minta generate gambar..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.75rem] py-4 sm:py-5 pl-6 pr-14 sm:pr-16 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all resize-none max-h-48 overflow-y-auto text-sm sm:text-base shadow-2xl"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || state.isLoading}
            className={`absolute right-2.5 sm:right-3.5 top-2 sm:top-3 h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center transition-all ${
              !inputValue.trim() || state.isLoading 
                ? 'text-slate-700 bg-white/5 cursor-not-allowed' 
                : 'text-white binnai-bg shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            {state.isLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="flex justify-center mt-4">
           <p className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-700 whitespace-nowrap">
             AI Chat • Coding • Image Generation • Beta Phase
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
