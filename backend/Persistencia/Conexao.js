
// // Conexao.js
import pg from 'pg';

const { Pool } = pg;

let pool;

export default async function conectar() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.SUPABASE_URL_CONEXAO,
      //connectionString: process.env.MEU_SUPABASE_URL_CONEXAO,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 60000,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return await pool.connect(); // client com `.release()`
}





// PARA RODAR LOCALMENTE USANDO O PG_ADMIN




// import pg from 'pg';

// const { Pool } = pg;

// let pool;

// export default async function conectar() {
//   if (!pool) {
//     pool = new Pool({
//       user: 'postgres', // Substitua com o seu usuário
//       host: 'localhost', // Host local
//       database: 'SOS', // Nome do banco de dados
//       password: 'postgres123', // Senha do banco
//       port: 5432, // Porta padrão do PostgreSQL
//       max: 20, // Máximo de conexões no pool
//       idleTimeoutMillis: 30000, // Tempo de inatividade para liberar a conexão
//       connectionTimeoutMillis: 60000, // Tempo de espera para conectar
//       ssl: false, // Desabilitando SSL
//     });
//   }

//   return await pool.connect(); // Retorna o client que pode ser usado com `.release()`
// }

