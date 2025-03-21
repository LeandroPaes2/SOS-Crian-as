// TelaCadastroMateria.jsx
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

// Importa as telas do CRUD de matérias
import TelaMateriasList from '../Materia/TelaMateriasList';
import TelaMateriaCreate from '../Materia/TelaMateriaCreate';
import TelaMateriaEdit from '../Materia/TelaMateriaEdit';

export default function TelaCadastroMateria() {
  return (
    <div>
      <h1>Cadastro de Matérias</h1>
      <p>Aqui você pode gerenciar as matérias.</p>
      
      {/* Navegação interna */}
      <nav>
        {/* Rota padrão (index) para listagem de matérias */}
        <Link to="">Listar Matérias</Link> |{" "}
        <Link to="create">Criar Matéria</Link>
      </nav>

      {/* Rotas aninhadas */}
      <Routes>
        {/* Rota padrão: /materias -> listagem */}
        <Route path="/" element={<TelaMateriasList />} />

        {/* /materias/create -> tela de criação */}
        <Route path="create" element={<TelaMateriaCreate />} />

        {/* /materias/edit/:nome -> tela de edição */}
        <Route path="edit/:nome" element={<TelaMateriaEdit />} />
      </Routes>
    </div>
  );
}