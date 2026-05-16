import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon in some environments
  }
});

pool.on('error', (err) => {
  console.error('[DATABASE] Unexpected error on idle client', err);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

// Optional: Test connection immediately
pool.connect()
  .then(client => {
    console.log('[DATABASE] Successfully connected to pool');
    client.release();
  })
  .catch(err => {
    console.error('[DATABASE] Error connecting to pool:', err);
    if (err.code === 'ECONNREFUSED') console.error('HINT: Check if your database is reachable.');
  });

export default prisma;
