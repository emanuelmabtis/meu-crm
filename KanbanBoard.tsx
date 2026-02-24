import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus, DollarSign, User, Clock } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface Deal {
  id: string;
  contact_id: string;
  contact_name: string;
  title: string;
  value: number;
  stage_id: string;
  description: string;
}

interface Stage {
  id: string;
  name: string;
  position: number;
}

const SortableDeal = ({ deal }: { deal: Deal }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{deal.title}</h4>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={14} />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <User size={12} />
          <span>{deal.contact_name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={12} />
          <span>Criado há 2 dias</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
          <DollarSign size={14} />
          {formatCurrency(deal.value)}
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
          {deal.contact_name.charAt(0)}
        </div>
      </div>
    </div>
  );
};

export default function KanbanBoard() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/kanban')
      .then(res => res.json())
      .then(data => {
        setStages(data.stages);
        setDeals(data.deals);
      });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeDeal = deals.find(d => d.id === active.id);
    const overId = over.id as string;

    // Check if dropped over a stage or another deal
    let newStageId = overId;
    if (!stages.find(s => s.id === overId)) {
      const overDeal = deals.find(d => d.id === overId);
      if (overDeal) newStageId = overDeal.stage_id;
    }

    if (activeDeal && activeDeal.stage_id !== newStageId) {
      // Update backend
      fetch(`/api/deals/${active.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: newStageId })
      });

      setDeals(prev => prev.map(d => 
        d.id === active.id ? { ...d, stage_id: newStageId } : d
      ));
    }

    setActiveId(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                U{i}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-white bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold hover:bg-emerald-100 transition-colors">
              +
            </button>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="text-sm font-medium text-slate-500">
            Total em Negociação: <span className="text-emerald-600 font-bold">{formatCurrency(deals.reduce((acc, d) => acc + d.value, 0))}</span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all text-sm">
          <Plus size={18} />
          Nova Oportunidade
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {stages.map(stage => (
            <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">{stage.name}</h3>
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {deals.filter(d => d.stage_id === stage.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1 bg-slate-100/50 p-3 rounded-3xl border border-slate-200/50 space-y-3 min-h-[200px]">
                <SortableContext 
                  id={stage.id}
                  items={deals.filter(d => d.stage_id === stage.id).map(d => d.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {deals.filter(d => d.stage_id === stage.id).map(deal => (
                    <SortableDeal key={deal.id} deal={deal} />
                  ))}
                </SortableContext>
              </div>
            </div>
          ))}
          <DragOverlay>
            {activeId ? (
              <div className="bg-white p-4 rounded-2xl border border-emerald-500 shadow-xl opacity-90 scale-105 rotate-2">
                <h4 className="font-bold text-slate-900 text-sm">{deals.find(d => d.id === activeId)?.title}</h4>
                <p className="text-xs text-emerald-600 font-bold mt-2">{formatCurrency(deals.find(d => d.id === activeId)?.value || 0)}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
