const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined in environment variables');
}

export const config = {
  apiUrl: API_URL
} as const;