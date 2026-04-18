import app from './app';
import { ENV } from './config/env.config';

const startServer = async () => {
  try {
    app.listen(ENV.PORT, () => {
      console.log(`[ARCHIVE System] Motor analítico iniciado en el puerto ${ENV.PORT}`);
      console.log(`[ARCHIVE System] Ambiente: ${ENV.NODE_ENV}`);
      console.log(`[ARCHIVE System] Healthcheck: http://localhost:${ENV.PORT}${ENV.API_PREFIX}/health`);
    });
  } catch (error) {
    console.error('[ARCHIVE Fatal Error] Fallo al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();