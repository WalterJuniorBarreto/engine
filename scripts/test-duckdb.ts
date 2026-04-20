// scripts/test-duckdb.ts
import path from 'node:path';
import { dbService } from '../src/services/database.service';

const FILE_PATH = path.join(__dirname, '../data/sales_mock.csv');

const runTest = async () => {
  console.log('[TEST] Iniciando Benchmark de DuckDB sobre CSV crudo...');
  
  // Consulta SQL Nivel Analítico:
  // "Léeme el archivo CSV gigante, agrupa las ventas por sucursal, suma los totales y ordénalo de mayor a menor"
  const sql = `
    SELECT 
        branch, 
        COUNT(*) as total_transacciones, 
        SUM(total) as ingresos_totales 
    FROM read_csv_auto('${FILE_PATH}') 
    GROUP BY branch 
    ORDER BY ingresos_totales DESC;
  `;

  console.time('Tiempo de Ejecución DuckDB');
  
  try {
    const resultados = await dbService.query(sql);
    console.timeEnd('Tiempo de Ejecución DuckDB');
    
    console.log('\n--- RESULTADOS DEL ANÁLISIS ---');
    console.table(resultados);
    console.log('-------------------------------\n');
    
  } catch (error) {
    console.error('Fallo en el test:', error);
  }
};

runTest();