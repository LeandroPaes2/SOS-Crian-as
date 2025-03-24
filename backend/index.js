import nodemailer from 'nodemailer'
import express from 'express'
import cors from 'cors'

const app = express();
const PORT = 7000;

app.use(cors());
app.use(express.json());

// Criando o transportador de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',  // ou outro provedor de e-mail
  auth: {
    user: 'sossistema1@gmail.com',  // Seu e-mail (Use variáveis de ambiente para dados sensíveis)
    pass: 'sosadministrador2003',   // Sua senha ou senha de aplicativo do Gmail
  },
});

// Função para enviar o e-mail de confirmação
function enviarEmailConfirmacao(destinatario) {
  const mailOptions = {
    from: 'sossistema1@gmail.com',  // Seu e-mail
    to: destinatario,               // E-mail do destinatário
    subject: 'Confirmação de Login',
    text: 'Você fez login com sucesso no nosso sistema!',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Erro ao enviar o e-mail:', error);
    }
    console.log('E-mail enviado: ' + info.response);
  });
}

// Rota de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verificação de credenciais (aqui você deve conectar com seu banco de dados)
  if (!(email && senha && email!="" && senha!= "")) {
    return res.status(400).send('Email e senha são obrigatórios');
  }

  // Simulação de validação de usuário (substitua por sua lógica real)
 
  if (1) {
    // Enviar o e-mail de confirmação
    enviarEmailConfirmacao(email);

    return res.status(200).send('Login realizado com sucesso! Uma confirmação foi enviada para seu e-mail.');
  } else {
    return res.status(401).send('Credenciais inválidas');
  }
});

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
