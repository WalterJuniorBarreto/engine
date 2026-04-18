import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
};

const requiredVariables = ['PORT', 'NODE_ENV'];
for (const envVar of requiredVariables) {
  if (!process.env[envVar]) {
    console.error(`[ARCHIVE Fatal Error] Falta la variable de entorno crítica: ${envVar}`);
    process.exit(1);
  }
}