import React from 'react';
import { Send } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function PromptInput({ prompt, onPromptChange, onSubmit, isLoading }: PromptInputProps) {
  return (
    <div className="relative">
      <textarea
        className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
      />
      <button
        className={`absolute bottom-4 right-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
          isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={onSubmit}
        disabled={isLoading}
      >
        <Send className="h-4 w-4 mr-2" />
        {isLoading ? 'Processing...' : 'Compare'}
      </button>
    </div>
  );
}