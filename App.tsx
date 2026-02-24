import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Kanban, 
  Settings, 
  Send, 
  Search,
  Plus,
  Bot,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Components
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Chat from './components/Chat';
import KanbanBoard from './components/KanbanBoard';
import BulkSend from './components/BulkSend';
import BotSettings from './components/BotSettings';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link to={path}>
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-600 hover:bg-slate-100'
    }`}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </div>
  </Link>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <MessageSquare size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-900">ZapCRM</h1>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarNav />
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                AD
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Admin Zap</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Conectado</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8">
            <h2 className="text-lg font-semibold text-slate-800">
              <PageTitle />
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 w-64 transition-all"
                />
              </div>
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                <Plus size={20} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/bulk" element={<BulkSend />} />
              <Route path="/settings" element={<BotSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

function SidebarNav() {
  const location = useLocation();
  return (
    <>
      <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" active={location.pathname === '/'} />
      <SidebarItem icon={Users} label="Contatos" path="/contacts" active={location.pathname === '/contacts'} />
      <SidebarItem icon={MessageSquare} label="Conversas" path="/chat" active={location.pathname === '/chat'} />
      <SidebarItem icon={Kanban} label="Pipeline" path="/kanban" active={location.pathname === '/kanban'} />
      <SidebarItem icon={Send} label="Disparos" path="/bulk" active={location.pathname === '/bulk'} />
      <SidebarItem icon={Settings} label="Configurações" path="/settings" active={location.pathname === '/settings'} />
    </>
  );
}

function PageTitle() {
  const location = useLocation();
  switch(location.pathname) {
    case '/': return 'Painel de Controle';
    case '/contacts': return 'Gestão de Contatos';
    case '/chat': return 'Central de Atendimento';
    case '/kanban': return 'Pipeline de Vendas';
    case '/bulk': return 'Disparos em Massa';
    case '/settings': return 'Configurações do Bot';
    default: return 'ZapCRM';
  }
}
