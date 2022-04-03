import { getDependency, getDependencyConflicts } from './dependency';
import express from 'express';
/**
 * Bootstrap the application framework
 */
export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/dependency/:name/:version', getDependency);
  app.get('/dependency/:name/:version/conflicts/:compareWith/:compareWithVer', getDependencyConflicts);

  return app;
}
