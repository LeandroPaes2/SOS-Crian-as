
const express = require('express');
const nodemailer = require('nodemailer');  // Importação do nodemailer
const cors = require('cors');
const app = express();
const PORT = 5000;

require('dotenv').config();
// Habilitar o CORS
app.use(cors());

// Middleware para tratar JSON
app.use(express.json());

// Configuração do Nodemailer para enviar emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Use variáveis de ambiente para armazenar dados sensíveis
    pass: process.env.EMAIL_PASS,  // Use variáveis de ambiente para armazenar dados sensíveis
  },
});

// Simulação de banco de dados (apenas para fins de teste)
const users = [
  { email: 'gabrielbaldassarini@gmail.com', password: 'senha123' },
];

// Rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verifica se as credenciais são válidas
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Se o login for bem-sucedido, envia um email para o administrador
    const mailOptions = {
      from: 'sosSistema1@gmail.com', // O e-mail que está enviando o e-mail
      to: 'lelepaes205@gmail.com',  // Email do administrador (corrigido para o domínio correto)
      subject: 'Novo Login - Aguardando Aprovação',
      text: `O usuário com email ${email} tentou fazer login. Aguardando sua permissão.`,
    };

    // Envia o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Erro ao enviar o email', error });
      }
      console.log('Email enviado: ' + info.response);
      res.status(200).json({ success: true, message: 'Login realizado. Aguardando confirmação.' });
    });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

// Rota para testar a API
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
