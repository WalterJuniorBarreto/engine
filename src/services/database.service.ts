// src/services/database.service.ts
import duckdb from 'duckdb';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

export class DatabaseService {
  private static instance: DatabaseService;
  public db: duckdb.Database;

  private constructor() {
    // Inicializamos DuckDB en memoria RAM. 
    // Es efímero, perfecto para el modelo Serverless que buscamos.
    this.db = new duckdb.Database(':memory:');
    logger.info('[DATABASE] DuckDB In-Memory Engine inicializado correctamente.');
  }

  // Patrón Singleton: Garantiza una única instancia
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Envoltorio asíncrono para ejecutar SQL crudo
  public async query<T = any>(sqlQuery: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sqlQuery, (err, res) => {
        if (err) {
          logger.error(err, `[DuckDB Error] Fallo al ejecutar query: ${sqlQuery}`);
          reject(new AppError('Error en el motor analítico', 500));
        } else {
          resolve(res as T[]);
        }
      });
    });
  }
}

// Exportamos la instancia única
export const dbService = DatabaseService.getInstance();