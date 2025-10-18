import { AppDataSource, TestDataSource } from '@/config/database';
import { appConfig } from "@/config/environment";
import { DataSource } from 'typeorm';


export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private dataSource: DataSource;
  constructor() {
    this.dataSource = appConfig.server.env === 'test' ? TestDataSource : AppDataSource;
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        console.log('✅ Database connected successfully');
      }
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        console.log('✅ Database disconnected successfully');
      }
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
      throw error;
    }
    }
    public getDataSource(): DataSource {
    return this.dataSource;
  }

  public async runMigrations(): Promise<void> {
    await this.dataSource.runMigrations();
    console.log('✅ Migrations executed successfully');
  }

  public async revertLastMigration(): Promise<void> {
    await this.dataSource.undoLastMigration();
    console.log('✅ Last migration reverted successfully');
  }
  
}