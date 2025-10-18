import { DataSource } from 'typeorm';
import { appConfig } from './environment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: appConfig.database.host,
  port: appConfig.database.port,
  username: appConfig.database.username,
  password: appConfig.database.password,
  database: appConfig.database.name,
  synchronize: appConfig.server.env === 'development',
  logging: appConfig.server.env === 'development',
  entities: ['src/infrastructure/adapters/secondary/database/entities/**/*.ts'],
  migrations: ['src/infrastructure/adapters/secondary/database/migrations/**/*.ts'],
  subscribers: ['src/infrastructure/adapters/secondary/database/subscribers/**/*.ts'],
});

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: appConfig.database.host,
  port: appConfig.database.port,
  username: appConfig.database.username,
  password: appConfig.database.password,
  database: process.env.DB_TEST_NAME || 'hexagonal_app_test',
  synchronize: true,
  logging: false,
  entities: ['src/infrastructure/adapters/secondary/database/entities/**/*.ts'],
  dropSchema: true,
});