// duely's server (Express). One process for everything:
//   npm run dev    -> the Vite dev server (hot reload)
//   npm start      -> the built app from dist/ (run `npm run build` first)
//
// Settings such as PORT can go in .env / .env.local (both git-ignored).

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const file of ['.env.local', '.env']) {
  const full = path.join(ROOT, file);
  if (existsSync(full)) {
    process.loadEnvFile(full); // doesn't override variables already set
  }
}

const production = process.argv.includes('--prod');
const port = Number(process.env.PORT) || 5173;

const app = express();
app.disable('x-powered-by');

if (production) {
  const dist = path.join(ROOT, 'dist');
  app.use(express.static(dist));
  app.use((req, res) => res.sendFile(path.join(dist, 'index.html'))); // client-side routes
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

app.listen(port, 'localhost', () => {
  console.log(`duely running at http://localhost:${port}/${production ? ' (production build)' : ''}`);
});
