import { AIModel } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s most advanced model',
    versions: [
      'Latest Version',
      'gpt-4-turbo-preview',
      'gpt-4-0125-preview',
      'gpt-4-1106-preview',
      'gpt-4-vision-preview',
      'gpt-4',
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
      'sonar-pro',
      'sonar',
    ]
  },
  // {
  //   id: 'llama',
  //   name: 'LLama',
  //   description: 'Meta\'s open-source language model',
  //   versions: [
  //     'llama4-maverick',
  //     'meta/llama-3-70b-instruct',
  //     'meta/llama-3-8b-instruct',
  //     'meta/llama-2-70b-chat',
  //     'meta/llama-2-13b-chat',
  //     'meta/llama-2-7b-chat'
  //   ]
  // },
];