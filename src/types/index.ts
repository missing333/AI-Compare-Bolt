// Model Types
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  versions: string[];
  description?: string;
}

export interface SelectedModelInstance {
  instanceId: string;
  modelId: string;
  version: string;
}

export interface ComparisonResult {
  modelId: string;
  version: string;
  response: string;
  responseTime: number;
  error?: string;
}

// Environment Types
export interface EnvConfig {
  STRIPE_PUBLIC_KEY: string;
  API_URL: string;
}

// API Response Types
export interface AIResponse {
  response: string;
  responseTime: number;
}

// Analytics Types
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
} 