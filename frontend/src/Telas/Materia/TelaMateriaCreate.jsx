import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMateria } from '../../services/materiaService';

function TelaMateriaCreate() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [hora, setHora] = useState('');
  const [dia, setDia] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMateria({ nome, descricao, hora, dia });
      navigate('/materias'); // redireciona para a lista
    } catch (error) {
      console.error(error);
      alert('Erro ao criar matéria (talvez o nome já exista).');
    }
  };

  return (
    <div>
      <h1>Criar Matéria</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome (chave primária):</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Descrição:</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div>
          <label>Hora:</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>

        <div>
          <label>Dia:</label>
          <input
            type="date"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
          />
        </div>

        <button type="submit">Criar</button>
      </form>
    </div>
  );
}

export default TelaMateriaCreate;