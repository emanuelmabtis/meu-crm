import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Users, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Variable,
  FileText
} from 'lucide-react';

export default function BulkSend() {
  const [template, setTemplate] = useState('Olá {{name}}, tudo bem? Temos uma oferta especial para você!');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState<'all' | 'groups' | 'leads'>('all');

  const handleStart = () => {
    setSending(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSending(false);
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Send className="text-emerald-600" size={24} />
          Configurar Novo Disparo
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Público Alvo</label>
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => setTarget('all')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${target === 'all' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Users size={24} />
                <span className="text-sm font-bold">Todos Contatos</span>
              </button>
              <button 
                onClick={() => setTarget('groups')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${target === 'groups' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Layers size={24} />
                <span className="text-sm font-bold">Apenas Grupos</span>
              </button>
              <button 
                onClick={() => setTarget('leads')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${target === 'leads' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Clock size={24} />
                <span className="text-sm font-bold">Apenas Leads</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Template da Mensagem</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTemplate(prev => prev + ' {{name}}')}
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-200 transition-colors"
                >
                  + NOME
                </button>
                <button 
                  onClick={() => setTemplate(prev => prev + ' {{phone}}')}
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-200 transition-colors"
                >
                  + TELEFONE
                </button>
              </div>
            </div>
            <textarea 
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={5}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
              placeholder="Digite sua mensagem aqui..."
            />
            <p className="mt-2 text-[10px] text-slate-400 font-medium">
              DICA: Use variáveis para tornar a mensagem humanizada e evitar ser marcado como spam.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              onClick={handleStart}
              disabled={sending}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all"
            >
              {sending ? <Pause size={20} /> : <Play size={20} />}
              {sending ? 'Enviando...' : 'Iniciar Disparo'}
            </button>
            <button className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      {sending || progress > 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800">Progresso do Envio</h4>
            <span className="text-emerald-600 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Sucesso</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{Math.floor(progress * 12.5)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-rose-500 mb-1">
                <AlertCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Falhas</span>
              </div>
              <p className="text-xl font-bold text-slate-900">0</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <Clock size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Restante</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{Math.max(0, 1250 - Math.floor(progress * 12.5))}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
