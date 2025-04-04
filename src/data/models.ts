import { AIModel } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'OpenAI\'s most advanced model',
    versions: [
      'Latest Version',
      'gpt-4-turbo-preview',
      'gpt-4-0125-preview',
      'gpt-4-1106-preview',
      'gpt-4-vision-preview',
      'gpt-4',
      'gpt-4-0314',
      'gpt-4-0613'
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s flagship model',
    versions: [
      'Latest Version',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'claude-2.1',
      'claude-2.0',
      'claude-1.2'
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s latest AI model',
    versions: [
      'Latest Version',
      'gemini-1.5-pro',
      'gemini-1.0-ultra',
      'gemini-1.0-pro',
      'gemini-1.0-pro-vision'
    ]
  },
  {
    id: 'llama',
    name: 'LLaMA',
    description: 'Meta\'s open source model',
    versions: [
      'Latest Version',
      'llama-3-70b',
      'llama-2-70b-chat',
      'llama-2-70b',
      'llama-2-13b-chat',
      'llama-2-13b',
      'llama-2-7b-chat',
      'llama-2-7b'
    ]
  },
  {
    id: 'grok',
    name: 'Grok',
    description: 'xAI\'s conversational AI',
    versions: [
      'Latest Version',
      'grok-1.5',
      'grok-1',
      'grok-0'
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Perplexity\'s online AI model',
    versions: [
      'Latest Version',
      'pplx-online-70b',
      'pplx-70b-online',
      'pplx-70b-chat',
      'pplx-7b-chat',
      'pplx-7b-online'
    ]
  },
  {
    id: 'deepseek',
    name: 'Deepseek',
    description: 'Deepseek\'s language model',
    versions: [
      'Latest Version',
      'deepseek-coder-33b-instruct',
      'deepseek-67b-chat',
      'deepseek-67b',
      'deepseek-33b-chat',
      'deepseek-33b',
      'deepseek-7b-chat',
      'deepseek-7b'
    ]
  },
  {
    id: 'mixtral',
    name: 'Mixtral',
    description: 'Mistral AI\'s mixture of experts model',
    versions: [
      'Latest Version',
      'mixtral-8x7b-instruct',
      'mixtral-8x7b',
      'mistral-medium',
      'mistral-small',
      'mistral-tiny'
    ]
  }
];