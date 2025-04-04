declare global {
  const __STRIPE_PUBLIC_KEY__: string;
  const __API_URL__: string;
}

interface EnvConfig {
  STRIPE_PUBLIC_KEY: string;
  API_URL: string;
}

export const env: EnvConfig = {
  STRIPE_PUBLIC_KEY: __STRIPE_PUBLIC_KEY__,
  API_URL: __API_URL__,
}; 