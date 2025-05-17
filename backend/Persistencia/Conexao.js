import pg from 'pg';

const { Pool } = pg;

let pool;

export default async function conectar() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.SUPABASE_URL_CONEXAO,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 60000,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
}