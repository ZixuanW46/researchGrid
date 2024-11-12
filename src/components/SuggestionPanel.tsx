import React, { useState } from 'react';
import { Upload, Send, Lightbulb } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Card } from '../types';
import SortableCard from './SortableCard';

interface SuggestionPanelProps {
  suggestions: Card[];
  setSuggestions: React.Dispatch<React.SetStateAction<Card[]>>;
}

export default function SuggestionPanel({ suggestions, setSuggestions }: SuggestionPanelProps) {
  const [prompt, setPrompt] = useState('');

  const { setNodeRef } = useDroppable({
    id: 'suggestions'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    const newSuggestion: Card = {
      id: `suggestion-${Date.now()}`,
      content: prompt,
      priority: 'low'
    };
    setSuggestions(prev => [...prev, newSuggestion]);
    setPrompt('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          const newSuggestion: Card = {
            id: `suggestion-${Date.now()}`,
            content: event.target.result.slice(0, 500),
            priority: 'low'
          };
          setSuggestions(prev => [...prev, newSuggestion]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUpdateCard = (id: string, content: string) => {
    setSuggestions(prev => prev.map(card =>
      card.id === id ? { ...card, content, isEditing: false } : card
    ));
  };

  const handleDeleteCard = (id: string) => {
    setSuggestions(prev => prev.filter(card => card.id !== id));
  };

  const handlePriorityChange = (id: string, priority: 'high' | 'medium' | 'low') => {
    setSuggestions(prev => prev.map(card =>
      card.id === id ? { ...card, priority } : card
    ));
  };

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-gray-50 border-l border-gray-200 shadow-xl">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">AI Suggestions</h2>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Enter prompt
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type to generate suggestions..."
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".txt,.md,.json"
              />
            </div>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <SortableContext 
            id="suggestions"
            items={suggestions}
            strategy={verticalListSortingStrategy}
          >
            <div ref={setNodeRef} className="space-y-3">
              {suggestions.map((suggestion) => (
                <SortableCard
                  key={suggestion.id}
                  card={suggestion}
                  onSave={handleUpdateCard}
                  onDelete={handleDeleteCard}
                  onPriorityChange={handlePriorityChange}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
    </div>
  );
}