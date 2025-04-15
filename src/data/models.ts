import { AIModel } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'ChatGPT',
    description: 'OpenAI\'s most advanced model',
    versions: [
      'gpt-4.5-preview-2025-02-27',
      'gpt-4o-2024-08-06',
      'gpt-3.5-turbo-0125',
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s flagship model',
    versions: [
      'claude-3-7-sonnet-latest',
      'claude-3-5-sonnet-latest',
      'claude-3-opus-latest'
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s latest AI model',
    versions: [
      'gemini-2.5-pro-exp-03-25',
      'gemini-2.0-flash',
      'gemini-2.0-pro',
      'gemini-1.5-pro',
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Perplexity\'s online AI model',
    versions: [
      'sonar-reasoning-pro',
      'sonar-pro',
      'sonar',
    ]
  },
  {
    id: 'llama',
    name: 'LLama',
    description: 'Meta\'s open-source language model',
    versions: [
      'Latest Version',
      'llama4-maverick',
      'meta/llama-3-70b-instruct',
      'meta/llama-3-8b-instruct',
      'meta/llama-2-70b-chat',
      'meta/llama-2-13b-chat',
      'meta/llama-2-7b-chat'
    ]
  },
];