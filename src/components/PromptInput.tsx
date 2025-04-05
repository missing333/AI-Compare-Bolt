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
        className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
      />
    </div>
  );
}