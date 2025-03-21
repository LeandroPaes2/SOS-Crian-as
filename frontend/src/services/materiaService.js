import axios from 'axios';

const API_URL = 'http://localhost:5000/api/materias';

export const getAllMaterias = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getMateriaByNome = async (nome) => {
  const response = await axios.get(`${API_URL}/${encodeURIComponent(nome)}`);
  return response.data;
};

export const createMateria = async (materia) => {
  const response = await axios.post(API_URL, materia);
  return response.data;
};

export const updateMateria = async (nome, materia) => {
  const response = await axios.put(`${API_URL}/${encodeURIComponent(nome)}`, materia);
  return response.data;
};

export const deleteMateria = async (nome) => {
  const response = await axios.delete(`${API_URL}/${encodeURIComponent(nome)}`);
  return response.data;
};
