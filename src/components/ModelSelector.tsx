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
    <div className="space-y-6">
      <div className="relative max-w-[500px] mx-auto w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-4 border border-gray-200 rounded-xl bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <span className="text-gray-700 font-medium">Add AI Model</span>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                onClick={() => {
                  onModelSelect(model.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{model.name}</span>
                  <span className="text-sm text-gray-500">{model.description}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {selectedModels.map((instance) => {
          const model = AI_MODELS.find(m => m.id === instance.modelId);
          if (!model) return null;

          return (
            <div key={instance.instanceId} className="flex flex-col sm:flex-row sm:items-center max-w-[500px] mx-auto gap-2 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <h3 className="font-medium text-gray-900 min-w-[80px] sm:min-w-[120px]">{model.name}</h3>
                <button
                  onClick={() => onModelRemove(instance.instanceId)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 sm:hidden"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-1 items-center gap-4">
                <select
                  value={instance.version}
                  onChange={(e) => onVersionChange(instance.instanceId, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {model.versions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onModelRemove(instance.instanceId)}
                  className="hidden sm:block text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}