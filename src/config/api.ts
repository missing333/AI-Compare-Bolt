// API URL configuration
export const API_URL = import.meta.env.PROD 
  ? '/api'  // Production API endpoint (will be redirected by Netlify to /.netlify/functions/server/api)
  : 'http://localhost:3000/api';  // Development API endpoint 