import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../types';
import DraggableCardList from './DraggableCardList';

interface MarketGridCellProps {
  id: string;
  title: string;
  prompt: string;
  cards: Card[];
  onAddCard: () => void;
  onUpdateCard: (id: string, content: string) => void;
  onDeleteCard: (id: string) => void;
  onPriorityChange: (id: string, priority: 'high' | 'medium' | 'low') => void;
}

export default function MarketGridCell({ 
  id,
  title, 
  prompt, 
  cards, 
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onPriorityChange
}: MarketGridCellProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-3">{title}</h3>
      <p className="text-xs text-gray-500 italic mb-3">{prompt}</p>
      <DraggableCardList
        containerId={`market-${id}`}
        cards={cards}
        onUpdateCard={onUpdateCard}
        onDeleteCard={onDeleteCard}
        onPriorityChange={onPriorityChange}
      />
      <button
        onClick={onAddCard}
        className="w-full mt-2 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Card
      </button>
    </div>
  );
}