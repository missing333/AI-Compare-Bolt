import { AIModel } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'ChatGPT',
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
      'gemini-2.0-flash',
      'gemini-2.0-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-ultra',
      'gemini-1.0-pro',
      'gemini-1.0-pro-vision'
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
];