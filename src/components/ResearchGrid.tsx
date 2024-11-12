import React, { useState } from 'react';
import { Grid } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CompanyGridCellData, MarketGridCellData, Card } from '../types';
import CompanyGridCell from './CompanyGridCell';
import MarketGridCell from './MarketGridCell';
import EditableCard from './EditableCard';
import SuggestionPanel from './SuggestionPanel';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useCardActions } from './hooks/useCardActions';
import { initialCompanyFactors, initialMarketFactors } from '../data/initialData';

export default function ResearchGrid() {
  const [companyFactors, setCompanyFactors] = useState<CompanyGridCellData[]>(initialCompanyFactors);
  const [marketFactors, setMarketFactors] = useState<MarketGridCellData[]>(initialMarketFactors);
  const [suggestions, setSuggestions] = useState<Card[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const {
    activeId,
    activeCard,
    handleDragStart,
    handleDragEnd
  } = useDragAndDrop(
    companyFactors,
    setCompanyFactors,
    marketFactors,
    setMarketFactors,
    suggestions,
    setSuggestions
  );

  const {
    handleAddCompanyCard,
    handleUpdateCompanyCard,
    handleDeleteCompanyCard,
    handleCompanyCardPriorityChange,
    handleAddMarketCard,
    handleUpdateMarketCard,
    handleDeleteMarketCard,
    handleMarketCardPriorityChange
  } = useCardActions(setCompanyFactors, setMarketFactors);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Grid className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Customer Research Grid</h1>
          </div>

          <div className="space-y-8">
            {/* Company Factors */}
            <div className="grid grid-cols-4 gap-4">
              {companyFactors.map((factor) => (
                <CompanyGridCell
                  key={factor.id}
                  {...factor}
                  onAddCard={(type) => handleAddCompanyCard(factor.id, type)}
                  onUpdateCard={(type, cardId, content) => 
                    handleUpdateCompanyCard(factor.id, type, cardId, content)
                  }
                  onDeleteCard={(type, cardId) => 
                    handleDeleteCompanyCard(factor.id, type, cardId)
                  }
                  onPriorityChange={(type, cardId, priority) =>
                    handleCompanyCardPriorityChange(factor.id, type, cardId, priority)
                  }
                />
              ))}
            </div>

            {/* Market Factors */}
            <div className="grid grid-cols-6 gap-4">
              {marketFactors.map((factor) => (
                <MarketGridCell
                  key={factor.id}
                  {...factor}
                  onAddCard={() => handleAddMarketCard(factor.id)}
                  onUpdateCard={(cardId, content) => 
                    handleUpdateMarketCard(factor.id, cardId, content)
                  }
                  onDeleteCard={(cardId) => 
                    handleDeleteMarketCard(factor.id, cardId)
                  }
                  onPriorityChange={(cardId, priority) =>
                    handleMarketCardPriorityChange(factor.id, cardId, priority)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <SuggestionPanel
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />

        <DragOverlay>
          {activeId && activeCard && (
            <EditableCard
              card={activeCard}
              onSave={() => {}}
              onDelete={() => {}}
              onPriorityChange={() => {}}
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}