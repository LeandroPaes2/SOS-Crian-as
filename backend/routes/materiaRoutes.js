const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');

// Buscar todas as matérias
router.get('/', materiaController.getAllMaterias);

// Buscar uma matéria pelo nome (PK)
router.get('/:nome', materiaController.getMateriaByNome);

// Criar matéria
router.post('/', materiaController.createMateria);

// Atualizar matéria
router.put('/:nome', materiaController.updateMateria);

// Excluir matéria
router.delete('/:nome', materiaController.deleteMateria);

module.exports = router;