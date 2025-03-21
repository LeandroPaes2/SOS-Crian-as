const Materia = require('../models/materiaModel');

exports.getAllMaterias = async (req, res) => {
  try {
    const materias = await Materia.findAll();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMateriaByNome = async (req, res) => {
  try {
    const { nome } = req.params;
    const materia = await Materia.findByNome(nome);
    if (!materia) {
      return res.status(404).json({ error: 'Matéria não encontrada' });
    }
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMateria = async (req, res) => {
  try {
    const { nome, descricao, hora, dia } = req.body;
    // Cria a matéria
    await Materia.create({ nome, descricao, hora, dia });
    // Busca a matéria recém-criada
    const newMateria = await Materia.findByNome(nome);
    res.status(201).json(newMateria);
  } catch (error) {
    // Se o nome já existir como PK, dará erro de chave duplicada
    res.status(500).json({ error: error.message });
  }
};

exports.updateMateria = async (req, res) => {
  try {
    const { nome } = req.params; // PK original
    const { descricao, hora, dia } = req.body;

    // Verifica se existe
    const existingMateria = await Materia.findByNome(nome);
    if (!existingMateria) {
      return res.status(404).json({ error: 'Matéria não encontrada' });
    }

    // Atualiza
    await Materia.update(nome, { descricao, hora, dia });

    // Retorna a matéria atualizada
    const updatedMateria = await Materia.findByNome(nome);
    res.json(updatedMateria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMateria = async (req, res) => {
  try {
    const { nome } = req.params;
    const existingMateria = await Materia.findByNome(nome);
    if (!existingMateria) {
      return res.status(404).json({ error: 'Matéria não encontrada' });
    }
    await Materia.delete(nome);
    res.json({ message: 'Matéria removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};