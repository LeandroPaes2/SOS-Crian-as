const db = require('../config/db');

class Materia {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM materias');
    return rows;
  }

  static async findByNome(nome) {
    const [rows] = await db.query('SELECT * FROM materias WHERE nome = ?', [nome]);
    return rows[0];
  }

  static async create({ nome, descricao, hora, dia }) {
    // Como 'nome' é a PK, não há auto-increment
    await db.query(
      'INSERT INTO materias (nome, descricao, hora, dia) VALUES (?, ?, ?, ?)',
      [nome, descricao, hora, dia]
    );
    return nome; // retornamos o próprio nome como “identificador”
  }

  static async update(nomePk, { descricao, hora, dia }) {
    // Atualiza pelos campos que desejar. Aqui atualizamos todos, menos o nome
    await db.query(
      'UPDATE materias SET descricao = ?, hora = ?, dia = ? WHERE nome = ?',
      [descricao, hora, dia, nomePk]
    );
  }

  static async delete(nome) {
    await db.query('DELETE FROM materias WHERE nome = ?', [nome]);
  }
}

module.exports = Materia;