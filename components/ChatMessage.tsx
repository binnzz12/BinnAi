
import React from 'react';
import { Message, Role } from '../types';
import { BotIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-8 animate-message ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
          isUser 
            ? 'ml-4 bg-indigo-600 shadow-indigo-500/20' 
            : 'mr-4 binnai-bg shadow-purple-500/20'
        }`}>
          {isUser ? (
            <span className="text-[10px] font-black text-white">USER</span>
          ) : (
            <BotIcon className="h-6 w-6 text-white" />
          )}
        </div>
        
        <div className={`relative px-5 py-4 rounded-2xl shadow-sm border ${
          isUser 
            ? 'bg-indigo-600/90 border-indigo-500/30 text-white rounded-tr-none' 
            : 'glass-panel border-white/10 text-slate-100 rounded-tl-none'
        }`}>
          {!isUser && (
            <div className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-2 flex items-center gap-2">
              BinnAI
              {message.imageUrl && <span className="bg-purple-500/20 px-2 py-0.5 rounded text-[8px] text-purple-300">Image Gen</span>}
            </div>
          )}
          
          <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words prose prose-invert max-w-none">
            {message.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <img src={message.imageUrl} alt="AI Generated" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            
            {message.text || (!message.imageUrl && (
              <div className="flex gap-1 items-center h-5">
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
              </div>
            ))}
          </div>
          
          <div className={`text-[9px] mt-2 opacity-30 font-bold uppercase tracking-widest ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
