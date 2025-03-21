const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

const materiaRoutes = require('./routes/materiaRoutes');

app.use(cors());
app.use(express.json());

// Rota simples de teste
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Rotas de matéria
app.use('/api/materias', materiaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});