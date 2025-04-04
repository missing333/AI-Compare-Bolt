interface EnvConfig {
  STRIPE_PUBLIC_KEY: string;
  API_URL: string;
}

export const env: EnvConfig = {
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
}; 