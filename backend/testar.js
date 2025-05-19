import pg from 'pg';

const { Pool } = pg;

// Substitua a string abaixo pela que você quer testar
const pool = new Pool({
      connectionString: process.env.SUPABASE_URL_CONEXAO,
      //connectionString: process.env.MEU_SUPABASE_URL_CONEXAO,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 60000,
      ssl: {
        rejectUnauthorized: false,
      },
    });

async function testarConexao() {
  let client;
  try {
    client = await pool.connect();
    const resultado = await client.query('SELECT NOW()');
    console.log("✅ Conectado com sucesso! Hora atual no servidor:", resultado.rows[0].now);
  } catch (erro) {
    console.error("❌ Erro ao conectar:", erro.message);
  } finally {
    if (client) client.release();
    pool.end(); // Fecha o pool ao final do teste
  }
}

testarConexao();