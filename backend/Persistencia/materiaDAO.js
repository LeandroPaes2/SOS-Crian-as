import Materia from "../Modelo/materia.js";

//import conectar from "./Conexao.js";
export default class MateriaDAO {
    

    async incluir(materia, conexao) {
        if (materia instanceof Materia) {
            try{
                //const conexao = await conectar();
                const sql = `INSERT INTO materia(mat_nome, mat_desc)
                VALUES (?, ?)`;
                let parametros = [ materia.nome, materia.descricao ];
                await conexao.execute(sql, parametros);
                //await conexao.release();
            }
            catch (e) {
                throw new Error("Erro ao inserir matéria: " + e.message);
            }
        }
    }

    async alterar(materia, conexao) {
        if (materia instanceof Materia) {
            try{
                //const conexao = await conectar();
                const sql = `UPDATE materia SET mat_nome = ?, mat_desc = ?
                WHERE mat_id = ?;
                `;
                let parametros = [
                    materia.nome,
                    materia.descricao,
                    materia.id
                ]; 
                await conexao.execute(sql, parametros);
                //await conexao.release();
            }
            catch (e) {
                throw new Error("Erro ao alterar matéria: " + e.message);
            }
        }
    }
    
    async consultar(termo, conexao) {
        try {
          // Query base: sempre seleciona os campos que existem
          let sql = 'SELECT mat_id, mat_nome, mat_desc FROM materia';
          const parametros = [];
      
          if (termo) {
            if (!isNaN(termo)) {
              // se termo for numérico, pesquisa por ID exato
              sql += ' WHERE mat_id = ?';
              parametros.push(termo);
            } else {
              // senão, pesquisa por nome parcial
              sql += ' WHERE mat_nome LIKE ?';
              parametros.push(`%${termo}%`);
            }
          }
          // Executa sempre uma query não-vazia
          const [linhas] = await conexao.execute(sql, parametros);
      
          // Mapeia cada linha para o objeto Materia
          return linhas.map(linha =>
            new Materia(linha.mat_id, linha.mat_nome, linha.mat_desc)
          );
        }
        catch (e) {
          throw new Error("Erro ao consultar matérias: " + e.message);
        }
    }

    async excluir(materia,conexao) {
        if (materia instanceof Materia) {
            try {
                const deletedId = materia.id;
                // Remove a matéria
                await conexao.execute('DELETE FROM materia WHERE mat_id = ?', [deletedId]);
                // Decrementa os IDs das matérias com ID maior que o removido
                await conexao.execute('UPDATE materia SET mat_id = mat_id - 1 WHERE mat_id > ?', [deletedId]);
                // Ajusta o AUTO_INCREMENT para continuar a sequência corretamente
                const [rows] = await conexao.execute('SELECT MAX(mat_id) AS maxId FROM materia');
                const nextId = (rows[0].maxId || 0) + 1;
                await conexao.execute(`ALTER TABLE materia AUTO_INCREMENT = ${nextId}`);
            }
            catch (e) {
                throw new Error("Erro ao excluir matéria: " + e.message);
            }
        }
    }
}