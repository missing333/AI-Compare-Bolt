import { AIModel } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'ChatGPT',
    description: 'OpenAI\'s most advanced model',
    versions: [
      'gpt-4o-2024-08-06',
      'gpt-4o-mini-2024-07-18',
      'o1-mini-2024-09-12',
      'gpt-3.5-turbo-0125',
      'gpt-4o-2024-02-15',
      'gpt-4o-2024-01-18',
      'gpt-4o-2023-11-20',
      'gpt-4o-2023-08-01',
      
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s flagship model',
    versions: [
      'claude-3-7-sonnet-20250219',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s latest AI model',
    versions: [
      'gemini-2.5-pro-exp-03-25',
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-1.0-ultra',
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Perplexity\'s online AI model',
    versions: [
      'sonar-pro',
      'sonar',
    ]
  },
  {
    id: 'llama',
    name: 'LLama',
    description: 'Meta\'s open-source language model',
    versions: [
      'llama4-maverick',
      'llama3.3-70b',
    ]
  },
];