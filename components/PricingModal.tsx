
import React from 'react';
import { SparklesIcon } from './Icons';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-2xl" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl glass-panel border-white/20 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-message my-auto">
        <div className="p-8 sm:p-14 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Tahap Pengembangan</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter">Coming Soon: <span className="binnai-gradient">BinnAI Pro</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
            Fitur langganan sedang kami persiapkan untuk memberikan pengalaman AI yang lebih eksklusif. Untuk saat ini, nikmati fitur <strong>Generate Foto</strong> dan <strong>Coding Assistant</strong> secara gratis!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-white font-bold mb-1">Aktivasi Instan</h3>
              <p className="text-xs text-slate-500">Satu klik, akses langsung aktif secara realtime tanpa admin.</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="text-white font-bold mb-1">Ultra Image Gen</h3>
              <p className="text-xs text-slate-500">Kualitas gambar lebih tinggi dan tanpa batas harian.</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="text-white font-bold mb-1">Prioritas Server</h3>
              <p className="text-xs text-slate-500">Respon kilat bahkan di jam sibuk untuk pengguna Pro.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Tutup Preview
            </button>
            <button 
              disabled
              className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-white/10 text-slate-500 text-xs font-black uppercase tracking-widest cursor-not-allowed border border-white/5"
            >
              Segera Hadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
