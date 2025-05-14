import Materia from "../Modelo/materia.js";
import supabase from "./Conexao.js";

//import conectar from "./Conexao.js";
export default class MateriaDAO {
    

    async incluir(materia, supabase) {
        if (materia instanceof Materia) {
            try{
                //const conexao = await conectar();
                const sql = `INSERT INTO materia(mat_nome, mat_desc)
                VALUES ($1, $2)`;
                let parametros = [ materia.nome, materia.descricao ];
                await supabase.query(sql, parametros);
                //await conexao.release();
            }
            catch (e) {
                throw new Error("Erro ao inserir matéria: " + e.message);
            }
        }
    }

    async alterar(materia, supabase) {
        if (materia instanceof Materia) {
            try{
                //const conexao = await conectar();
                const sql = `UPDATE materia SET mat_nome = $1, mat_desc = $2
                WHERE mat_id = $3;
                `;
                let parametros = [
                    materia.nome,
                    materia.descricao,
                    materia.id
                ]; 
                await supabase.query(sql, parametros);
                //await conexao.release();
            }
            catch (e) {
                throw new Error("Erro ao alterar matéria: " + e.message);
            }
        }
    }
    
    async consultar(termo, supabase) {
        try {
          // Query base: sempre seleciona os campos que existem
          let sql = 'SELECT * FROM materia';
          const parametros = [];
      
            if (termo) {
              sql += ' WHERE mat_nome ILIKE $1';
              parametros = ['%' + termo + '%'];
            }
          // Executa sempre uma query não-vazia
          const [linhas] = await supabase.query(sql, parametros);
      
          // Mapeia cada linha para o objeto Materia
          return linhas.map(linha =>
            new Materia(linha.mat_id, linha.mat_nome, linha.mat_desc)
          );
        }
        catch (e) {
          throw new Error("Erro ao consultar matérias: " + e.message);
        }
    }

    async excluir(materia, supabase) {
        if (materia instanceof Materia) {
            try {
                const deletedId = materia.id;
    
                // Exclui horários relacionados
                await supabase.query('DELETE FROM horario WHERE hora_mat_id = $1', [deletedId]);
    
                // Remove a matéria
                await supabase.query('DELETE FROM materia WHERE mat_id = $1', [deletedId]);
    
                // Reorganiza os IDs
                await supabase.query('UPDATE materia SET mat_id = mat_id - 1 WHERE mat_id > $1', [deletedId]);
    
                // Corrige o AUTO_INCREMENT
                const [rows] = await supabase.query('SELECT MAX(mat_id) AS maxId FROM materia');
                const nextId = (rows[0].maxId || 0) + 1;
                await supabase.query(`ALTER TABLE materia AUTO_INCREMENT = ${nextId}`);
    
                return true;
            } catch (e) {
                throw new Error("Erro ao excluir matéria: " + e.message);
            }
        }
    }
}