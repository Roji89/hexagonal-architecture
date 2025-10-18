import compression from 'compression';
import cors from 'cors';
import express, { Application, Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import { DatabaseConnection } from './infrastructure/database/connection';

export class App {
  public app: Application;
  private databaseConnection: DatabaseConnection;
  constructor() {
    this.app = express();
    this.databaseConnection = DatabaseConnection.getInstance();
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
    // Health check endpoint
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }

  public async initialize(): Promise<void>{
    try {
      await this.databaseConnection.connect();
      console.log('🚀 Application initialized successfully');
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.databaseConnection.disconnect();
  }

  public listen(port: number, callback?: () => void): void {
    this.app.listen(port, callback);
  }
}
