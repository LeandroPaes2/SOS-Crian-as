import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllMaterias, deleteMateria } from '../../services/materiaService';

function TelaMateriasList() {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const data = await getAllMaterias();
      setMaterias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (nome) => {
    try {
      await deleteMateria(nome);
      fetchMaterias(); // recarrega a lista após exclusão
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Lista de Matérias</h1>
      <Link to="/materias/create">Criar Nova Matéria</Link>
      <ul>
        {materias.map((materia) => (
          <li key={materia.nome}>
            <strong>{materia.nome}</strong> — {materia.descricao} — {materia.hora} — {materia.dia}
            {' | '}
            <Link to={`/materias/edit/${encodeURIComponent(materia.nome)}`}>Editar</Link>
            {' | '}
            <button onClick={() => handleDelete(materia.nome)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TelaMateriasList;