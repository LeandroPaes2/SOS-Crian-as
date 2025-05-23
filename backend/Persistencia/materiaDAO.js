import Materia from "../Modelo/materia.js";
import supabase from "./Conexao.js";
export default class MateriaDAO {


    async incluir(materia, supabase) {
        if (materia instanceof Materia) {
            //const conexao = await conectar();
            const sql = `INSERT INTO materia(mat_nome, mat_desc)
            VALUES ($1, $2)`;
            let parametros = [materia.nome, materia.descricao];
            await supabase.query(sql, parametros);
            //await conexao.release();
        }
    }

    async alterar(materia, supabase) {
        if (materia instanceof Materia) {
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
    }

    async consultar(termo, supabase) {
        // Query base: sempre seleciona os campos que existem
        let sql = 'SELECT * FROM materia';
        const parametros = [];

        if (termo) {
            sql += ' WHERE mat_nome ILIKE $1';
            parametros = ['%' + termo + '%'];
        }
        // Executa sempre uma query não-vazia
        const result = await supabase.query(sql, parametros);

        // extrai o array de rows
        const linhas = result.rows;

        // Mapeia cada linha para o objeto Materia
        return linhas.map(linha =>
            new Materia(linha.mat_id, linha.mat_nome, linha.mat_desc)
        );
    }

    async excluir(materia, supabase) {
        if (materia instanceof Materia) {
            const deletedId = materia.id;

            // Exclui horários relacionados
            await supabase.query('DELETE FROM horario WHERE hora_mat_id = $1', [deletedId]);

            const presencas = await supabase.query(
                'SELECT pre_id FROM presenca WHERE mat_id = $1',
                [deletedId]
            );
            
            for (const presenca of presencas.rows) {
                await supabase.query('DELETE FROM presenca_aluno WHERE pre_id = $1', [presenca.pre_id]);
                await supabase.query('DELETE FROM presenca WHERE pre_id = $1', [presenca.pre_id]);
            }
            
            await supabase.query('DELETE FROM materia WHERE mat_id = $1', [deletedId]);

            return true;
        }
    }
}