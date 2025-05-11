import pg from 'pg';

const { Pool } = pg;

export default async function conectar() {
    if (global.poolConexoes) {
        return global.poolConexoes;
    }


    global.poolConexoes = new Pool({
        connectionString: process.env.SUPABASE_URL_CONEXAO,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 60000,
        ssl: {
            rejectUnauthorized: false, // necessário para evitar erro de SSL no Supabase
        },
    });
    
    return global.poolConexoes;
}
