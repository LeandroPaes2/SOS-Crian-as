import express from 'express';
//import rotaProduto from './Rotas/rotaProdutos.js';
import cors from 'cors';
import conectar from './Persistencia/Conexao.js';
import dotenv from 'dotenv';
import rotaTurma from './Rotas/rotaTurma.js'

dotenv.config();


const porta = process.env.PORTA_SERVIDOR || 3000;

const app = express(); //aplicação completa HTTP
//prepara a aplicação para processar dados no formato JSON
app.use(express.json());

//configurar a aplicação para responder requisições não importando a origem
app.use(cors({
                "origin":"*",
                "Access-Control-Allow-Origin":'*'
        }));

//app utilize a pasta 'publico' para disponibilizar o conteúdo ali armazenado
app.use(express.static('./publico'));

app.use("/turmas", rotaTurma);

app.get('/teste-conexao', async (req, res) => {
  try {
      const conexao = await conectar();
      conexao.release(); // Libera a conexão para o pool
      res.json({ mensagem: 'Conexão bem-sucedida!' });
  } catch (erro) {
      res.status(500).json({ erro: 'Falha ao conectar no banco de dados', detalhes: erro.message });
  }
});

// Rota padrão
app.get('/', (req, res) => {
  res.send('🚀 API rodando com Express e CORS!');
});

// Inicia o servidor
app.listen(porta, () => {
  console.log(`🚀 Servidor rodando na porta ${porta}`);
});