// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa as telas principais
import TelaCadastro from './Telas/TelaCadastro/telaCadastro';
import TelaCadastroMateria from './Telas/TelaCadastroMateria/telaCadastroMateria';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-background">
        <Routes>
          {/* Rota para a tela de cadastro geral */}
          <Route path="/" element={<TelaCadastro />} />

          {/* Rota para a tela de cadastro de matérias com rotas aninhadas */}
          <Route path="/materias/*" element={<TelaCadastroMateria />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
