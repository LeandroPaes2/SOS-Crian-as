import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMateriaByNome, updateMateria } from '../../services/materiaService';

function TelaMateriaEdit() {
  const { nome } = useParams(); // Nome vem pela URL
  const [descricao, setDescricao] = useState('');
  const [hora, setHora] = useState('');
  const [dia, setDia] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchMateria();
    // eslint-disable-next-line
  }, []);

  const fetchMateria = async () => {
    try {
      const data = await getMateriaByNome(nome);
      if (data) {
        setDescricao(data.descricao || '');
        setHora(data.hora || '');
        setDia(data.dia || '');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMateria(nome, { descricao, hora, dia });
      navigate('/materias');
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar matéria.');
    }
  };

  return (
    <div>
      <h1>Editar Matéria: {nome}</h1>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default TelaMateriaEdit;