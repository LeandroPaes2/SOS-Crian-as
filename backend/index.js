import nodemailer from 'nodemailer'
import express from 'express'
import cors from 'cors'

const app = express();
const PORT = 5000;
const transporter = nodemailer.createTransport({
  host:'live.smtp.mailtrap.io',
  port:587,
  secure:'false',
  auth: {
    user: 'sossistema1@gmail.com',  // Use variáveis de ambiente para armazenar dados sensíveis
    pass: 'sosadministrador2003',  // Use variáveis de ambiente para armazenar dados sensíveis
  }

})

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/login', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

