import compression from 'compression';
import cors from 'cors';
import express, { Application, json, urlencoded } from 'express';
import helmet from 'helmet';
import { ExpressRoute } from './shared/type/express.types';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(json({ limit: '10mb' }));
    this.app.use(urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    this.app.get('/health', ({req, res}: ExpressRoute) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }

  public listen(port: number, callback?: () => void): void {
    this.app.listen(port, callback);
  }
}