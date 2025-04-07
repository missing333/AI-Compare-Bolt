import React from 'react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ prompt, onPromptChange, isLoading }: PromptInputProps) {
  return (
    <div className="relative">
      <textarea
        className="w-full h-40 p-6 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 text-lg leading-relaxed transition-all duration-200"
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        disabled={isLoading}
      />
      <div className="absolute bottom-4 right-4 text-sm text-gray-400">
        {prompt.length} characters
      </div>
    </div>
  );
}