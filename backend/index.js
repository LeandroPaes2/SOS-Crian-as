import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import rotaTurma from './Rotas/rotaTurma.js';
import rotaEscola from './Rotas/rotaEscola.js';
import rotaMateria from './Rotas/rotaMateria.js';
import rotaResponsavel from './Rotas/rotaResponsavel.js';
import rotaAluno from './Rotas/rotaAluno.js';
import rotaHorario from './Rotas/rotaHorario.js';
import rotaPresenca from './Rotas/rotaPresenca.js';
import rotaEvento from './Rotas/rotaEvento.js';
import rotaFuncionario from './Rotas/rotaFuncionario.js';
import rotaListaEspera from './Rotas/rotaListaEspera.js';
import rotaFamilia from './Rotas/rotaFamilia.js';
import rotaFormularioSaude from './Rotas/rotaFormularioSaude.js';
import rotaAlunoResponsavel from './Rotas/rotaAlunoResponsavel.js';
import FuncionarioCtrl from './Controle/funcionarioCtrl.js';
import supabase from './Persistencia/Conexao.js';

dotenv.config();

const app = express();
const porta = 3000;

const funcionarioCtrl = new FuncionarioCtrl();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*', "Access-Control-Allow-Origin": "*" }));
app.use(express.static('./publico'));
app.use(helmet());

// Configura SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Simples serviço de envio de e-mail com SendGrid
const emailService = {
    async enviarCodigo(email, codigo) {
        const msg = {
            to: email,
            from: process.env.EMAIL_USER, // precisa ser verificado no SendGrid
            subject: 'Seu código de recuperação de senha',
            text: `Seu código de recuperação é: ${codigo}.`,
            html: `<p>Seu código de recuperação é: <strong>${codigo}</strong></p>`,
        };
        await sgMail.send(msg);
    }
};

// 🟡 1. Solicitar código de recuperação
app.post('/recuperarSenha', async (req, res) => {
    const { email } = req.body;

    try {
        const funcionario = await funcionarioCtrl.consultarPorEmail(email);
        if (!funcionario) {
            return res.status(404).json({ 
            mensagem: "Funcionário não encontrado." });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Gera código de 6 dígitos
        await funcionarioCtrl.salvarCodigoRecuperacao(email, codigo); // Salva no banco
        await emailService.enviarCodigo(email, codigo); // Envia por e-mail
        console.log(codigo)

        res.json({ mensagem: "Código enviado por e-mail." });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao enviar código de recuperação." });
    }
});

// 🟡 2. Verificar código
app.post('/verificarCodigo', (req, res) => {
    const { email, codigo } = req.body;
    console.log(email, codigo);
    if (funcionarioCtrl.verificarCodigo(email, codigo)) {
        res.json({ mensagem: "Código verificado com sucesso." });
    } else {
        res.status(400).json({ mensagem: "Código inválido ou expirado." });
    }
});

app.put('/alterarSenha', funcionarioCtrl.alterarSenhaFuncionario);

app.put("/redefinirSenha", (req, res) => funcionarioCtrl.atualizarSenhaFuncionario(req, res));

// Rotas principais
app.use("/turmas", rotaTurma);
app.use("/escolas", rotaEscola);
app.use("/materias", rotaMateria);
app.use("/responsaveis", rotaResponsavel);
app.use("/alunos", rotaAluno);
app.use("/eventos", rotaEvento);
app.use("/funcionarios", rotaFuncionario);
app.use("/listasEspera", rotaListaEspera);
app.use("/horarios", rotaHorario);
app.use("/presencas", rotaPresenca);
app.use("/formulariosSaude",rotaFormularioSaude);
app.use("/alunoResponsavel", rotaAlunoResponsavel);


app.use("/familias", rotaFamilia);

// Teste de conexão
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

// app.listen(porta, () => {
//     console.log(`🚀 Servidor rodando na porta ${porta}`);
// });
export const handler = serverless(app);