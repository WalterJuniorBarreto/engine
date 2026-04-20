import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Configuración Enterprise
const FILE_PATH = path.join(__dirname, '../data/sales_mock.csv');
const TOTAL_ROWS = 5_000_000; // 5 millones de filas (Aprox 500MB - 1GB)

// Diccionarios de datos para dar realismo
const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Toys', 'Automotive', 'Sports'];
const BRANCHES = ['Lima', 'Trujillo', 'Arequipa', 'Cusco', 'Piura'];
const STATUS = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'REFUNDED', 'PENDING']; 

// Función helper para generar números aleatorios rápidos
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number) => (Math.random() * (max - min + 1) + min).toFixed(2);
const getRandomItem = <T>(arr: T[]): T => arr[getRandomInt(0, arr.length - 1)];

const generateRow = (): string => {
  const transaction_id = crypto.randomUUID();
  const date = new Date(Date.now() - getRandomInt(0, 10000000000)).toISOString();
  const branch = getRandomItem(BRANCHES);
  const category = getRandomItem(CATEGORIES);
  const price = getRandomFloat(10, 500);
  const quantity = getRandomInt(1, 10);
  const total = (parseFloat(price) * quantity).toFixed(2);
  const status = getRandomItem(STATUS);

  return `${transaction_id},${date},${branch},${category},${price},${quantity},${total},${status}\n`;
};

const startGeneration = () => {
  console.log(`[SYSTEM] Iniciando generación de ${TOTAL_ROWS} registros...`);
  console.time('Tiempo de Generación');

  const stream = fs.createWriteStream(FILE_PATH, { encoding: 'utf-8' });
  
  stream.write('transaction_id,timestamp,branch,category,price,quantity,total,status\n');

  let i = TOTAL_ROWS;

  const write = () => {
    let ok = true;
    do {
      i--;
      const row = generateRow();
      
      if (i === 0) {
        stream.write(row, 'utf-8', () => {
          stream.end();
        });
      } else {
        ok = stream.write(row, 'utf-8');
      }
    } while (i > 0 && ok);

    if (i > 0) {
      stream.once('drain', write);
    }
  };

  write();

  stream.on('finish', () => {
    console.log(`[SUCCESS] Archivo CSV generado exitosamente en: ${FILE_PATH}`);
    console.timeEnd('Tiempo de Generación');
    
    const stats = fs.statSync(FILE_PATH);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`[INFO] Tamaño final del dataset: ${fileSizeInMB} MB`);
  });

  stream.on('error', (err: Error) => {
    console.error(`[FATAL ERROR] Fallo al escribir el archivo:`, err);
  });
};

startGeneration();