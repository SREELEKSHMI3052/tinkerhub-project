/**
 * Centralized API Configuration
 * Works for both local development and deployed environments
 * 
 * Uses Vite environment variables:
 * - Local: http://localhost:3000
 * - Production (Render): https://your-backend.onrender.com
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Debug: Log current environment
if (import.meta.env.DEV) {
  console.log('🔗 API Configuration:');
  console.log('   API URL:', API_BASE_URL);
  console.log('   Socket URL:', SOCKET_URL);
  console.log('   Environment:', import.meta.env.MODE);
}
