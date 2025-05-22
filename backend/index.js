import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rotaTurma from './Rotas/rotaTurma.js'
import rotaEscola from './Rotas/rotaEscola.js';
import rotaMateria from './Rotas/rotaMateria.js';
import rotaResponsavel from './Rotas/rotaResponsavel.js';
import rotaAluno from './Rotas/rotaAluno.js';
import rotaHorario from './Rotas/rotaHorario.js';
import rotaEvento from './Rotas/rotaEvento.js';
import rotaFuncionario from './Rotas/rotaFuncionario.js';
import supabase from './Persistencia/Conexao.js';
import rotaFamilia from './Rotas/rotaFamilia.js';

dotenv.config();

const porta = 3000;

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
app.use("/eventos", rotaEvento);
app.use("/funcionarios",rotaFuncionario);
app.use("/horarios", rotaHorario);
app.use("/familias", rotaFamilia);

app.get('/teste-conexao', async (req, res) => {
    try {
        const conexao = await supabase();
        conexao.release(); 
        res.json({ mensagem: 'Conexão bem-sucedida!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Falha ao conectar no banco de dados', detalhes: erro.message });
    }
});

app.get('/', (req, res) => {
    res.send('🚀 API rodando com Express e CORS!');
});

app.listen(porta, () => {
    console.log(`🚀 Servidor rodando na porta ${porta}`);
});