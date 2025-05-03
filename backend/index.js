import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rotaTurma from './Rotas/rotaTurma.js'
import rotaEscola from './Rotas/rotaEscola.js';
import rotaMateria from './Rotas/rotaMateria.js';
import rotaResponsavel from './Rotas/rotaResponsavel.js';
import rotaAluno from './Rotas/rotaAluno.js';
import rotaHorario from './Rotas/rotaHorario.js';
import supabase from './Persistencia/Conexao.js';

dotenv.config();

const porta = process.env.PORTA_SERVIDOR || 3000;

const app = express();

app.use(express.json());

app.use(cors({
    "origin": "*",
    "Access-Control-Allow-Origin": "*"
}));

app.use(express.static('./publico'));

app.use("/turmas", rotaTurma);
app.use("/escolas", rotaEscola);
app.use("/materias", rotaMateria);
app.use("/responsaveis", rotaResponsavel);
app.use("/alunos", rotaAluno);
app.use("/horarios", rotaHorario);

// Teste de conexão ao Supabase
app.get('/teste-conexao', async (req, res) => {
    try {
        const { data, error } = await supabase.from('turma').select().limit(1);
        if (error) throw error;
        res.json({ mensagem: 'Conexão bem-sucedida com o Supabase!', dados: data });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha ao conectar no Supabase', detalhes: erro.message });
    }
});

app.get('/', (req, res) => {
    res.send('🚀 API rodando com Express e CORS!');
});

app.listen(porta, () => {
    console.log(`🚀 Servidor rodando na porta ${porta}`);
});