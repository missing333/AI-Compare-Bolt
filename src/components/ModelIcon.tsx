import React from 'react';
import { BrainCircuit, Sparkles, Bot, Cpu, Boxes, Network, Code2, Binary } from 'lucide-react';

// Use direct SVG imports instead of ?react
import ChatGPTIcon from './ui/chatgpt-icon.svg';
import ClaudeIcon from './ui/claude-color.svg';
import GeminiIcon from './ui/google-gemini-icon.svg';
import PerplexityIcon from './ui/perplexity-ai-icon.svg';
import GrokIcon from './ui/grok-icon.svg';
import DeepseekIcon from './ui/deepseek-logo-icon.svg';
import MetaIcon from './ui/meta-icon.svg';

interface ModelIconProps {
  modelId: string;
  className?: string;
}

export function ModelIcon({ modelId, className = "h-5 w-5" }: ModelIconProps) {
  // Create image component for SVG icons
  const renderSvgIcon = (src: string) => (
    <img src={src} alt={`${modelId} icon`} className={className} />
  );

  switch (modelId) {
    case 'gpt-4':
      return renderSvgIcon(ChatGPTIcon);
    case 'claude':
      return renderSvgIcon(ClaudeIcon);
    case 'gemini':
      return renderSvgIcon(GeminiIcon);
    case 'perplexity':
      return renderSvgIcon(PerplexityIcon);
    case 'grok':
      return renderSvgIcon(GrokIcon);
    case 'deepseek':
      return renderSvgIcon(DeepseekIcon);
    case 'llama':
      return renderSvgIcon(MetaIcon);
    case 'mixtral':
      return <Binary className={className} />;
    default:
      return <Bot className={className} />;
  }
} 