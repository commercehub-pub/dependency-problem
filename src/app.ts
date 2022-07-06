import { getDependency, getMultiDependency} from './dependency';
import express from 'express';
/**
 * Bootstrap the application framework
 */
export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/dependency/:name/:version', getDependency);

  app.get('/dependency/:name/:version/:versionNew', getMultiDependency);

  return app;
}