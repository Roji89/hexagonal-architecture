import { config } from 'dotenv';
import 'reflect-metadata';
import { App } from './app';
config();


const app = new App();
const PORT = parseInt(config().parsed?.PORT || '5000', 10);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});