import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    '[DATABASE] Missing DATABASE_URL. Create backend/.env and set DATABASE_URL.'
  );
}

const hostname = new URL(databaseUrl).hostname;
const isLocalDb = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

const pool = new pg.Pool({
  connectionString: databaseUrl,
  // Remote managed Postgres providers often require SSL, local Postgres usually does not.
  ssl: isLocalDb ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('[DATABASE] Unexpected error on idle client', err);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
