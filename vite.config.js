import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The API lives in server/ (Express), which runs Vite in middleware mode during development.
export default defineConfig({
  plugins: [react()],
});
