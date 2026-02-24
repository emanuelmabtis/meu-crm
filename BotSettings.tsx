import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Save, 
  ToggleLeft, 
  ToggleRight, 
  MessageSquare, 
  Zap,
  ShieldCheck,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';

export default function BotSettings() {
  const [config, setConfig] = useState({
    system_instruction: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/bot-config')
      .then(res => res.json())
      .then(data => setConfig({
        system_instruction: data.system_instruction,
        is_active: data.is_active === 1
      }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <Bot size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Configuração da IA</h3>
              <p className="text-sm text-slate-500">Personalize o comportamento do seu bot inteligente.</p>
            </div>
          </div>
          <button 
            onClick={() => setConfig(prev => ({ ...prev, is_active: !prev.is_active }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              config.is_active 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {config.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            {config.is_active ? 'Ativo' : 'Inativo'}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Instrução do Sistema (Personalidade)</label>
            <textarea 
              value={config.system_instruction}
              onChange={(e) => setConfig(prev => ({ ...prev, system_instruction: e.target.value }))}
              rows={8}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all resize-none font-mono"
              placeholder="Ex: Você é um assistente de vendas da empresa ZapCRM. Seja educado, use emojis e tente converter o lead..."
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <AlertCircle className="text-blue-500 flex-shrink-0" size={20} />
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Dica:</strong> Quanto mais detalhada for a instrução, mais humanizado será o atendimento. Defina o tom de voz, limites de atuação e informações chave sobre seus produtos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-amber-500" size={20} />
                <h4 className="font-bold text-slate-800 text-sm">Respostas Rápidas</h4>
              </div>
              <p className="text-xs text-slate-500 mb-4">A IA responderá instantaneamente a perguntas frequentes baseadas no seu histórico.</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                <span className="text-xs font-bold text-emerald-600">Habilitado</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-blue-500" size={20} />
                <h4 className="font-bold text-slate-800 text-sm">Filtro de Spam</h4>
              </div>
              <p className="text-xs text-slate-500 mb-4">Proteção automática contra mensagens abusivas ou tentativas de golpe.</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                <span className="text-xs font-bold text-emerald-600">Habilitado</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button className="flex items-center gap-2 px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all">
              <RefreshCcw size={18} />
              Resetar Padrão
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all"
            >
              {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
              {success ? 'Salvo!' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Integração WhatsApp</h3>
        <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900">Status da Conexão</h4>
              <p className="text-sm text-emerald-700">Sessão ativa e sincronizada com o dispositivo.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-white text-emerald-700 border border-emerald-200 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all">
            Desconectar
          </button>
        </div>
      </div>
    </div>
  );
}
