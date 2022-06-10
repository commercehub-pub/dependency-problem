import { getDependencyConflicts } from './dependency';
import express from 'express';
/**
 * Bootstrap the application framework
 */
export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/dependency/:name/:versionOne/:versionTwo', getDependencyConflicts);

  return app;
}
