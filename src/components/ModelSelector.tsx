import React from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { AI_MODELS } from '../data/models';
import type { AIModel, SelectedModelInstance } from '../types';

interface ModelSelectorProps {
  selectedModels: SelectedModelInstance[];
  onModelSelect: (modelId: string) => void;
  onModelRemove: (instanceId: string) => void;
  onVersionChange: (instanceId: string, version: string) => void;
}

export function ModelSelector({ selectedModels, onModelSelect, onModelRemove, onVersionChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative max-w-[500px] mx-auto w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-gray-700">Add AI Model</span>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none"
                onClick={() => {
                  onModelSelect(model.id);
                  setIsOpen(false);
                }}
              >
                {model.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {selectedModels.map((instance) => {
          const model = AI_MODELS.find(m => m.id === instance.modelId);
          if (!model) return null;

          return (
            <div key={instance.instanceId} className="flex items-center max-w-[500px] mx-auto gap-4 p-4 bg-white rounded-lg border">
              <div className="flex-grow flex items-center gap-4">
                <h3 className="font-medium text-gray-900 min-w-[120px]">{model.name}</h3>
                <select
                  value={instance.version}
                  onChange={(e) => onVersionChange(instance.instanceId, e.target.value)}
                  className="flex-grow px-3 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {model.versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => onModelRemove(instance.instanceId)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}