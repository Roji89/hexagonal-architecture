import 'reflect-metadata';
import { App } from './app';
import { appConfig } from './config/environment';


const app = new App();
const PORT = appConfig.server.port as number;

const start = async () => {
  try {
    await app.initialize();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️ Database: Connected`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      await app.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

start();