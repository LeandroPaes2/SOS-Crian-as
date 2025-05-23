import Presenca from "../Modelo/presenca.js";
import supabase from "./Conexao.js";
import Turma from "../Modelo/turma.js";
import Materia from "../Modelo/materia.js";

export default class PresencaDAO{
    /*
    async init(){
        try{
            const conexao = await conectar();
            const sql=`
            CREATE TABLE IF NOT EXISTS presenca (
            pre_id INT AUTO_INCREMENT PRIMARY KEY,
            pre_data_hora DATETIME NOT NULL,
            mat_id INT NOT NULL,
            turm_id INT NOT NULL,
            FOREIGN KEY (mat_id) REFERENCES materia(mat_id),
            FOREIGN KEY (turm_id) REFERENCES turma(turm_id)
            );
        `;
            await conexao.execute(sql);
            const sql2=`
            CREATE TABLE IF NOT EXISTS presenca_aluno (
            pre_id INT,
            alu_id INT,
            presente BOOLEAN,
            PRIMARY KEY (pre_id, alu_num_protocolo),
            FOREIGN KEY (pre_id) REFERENCES presenca(pre_id),
            FOREIGN KEY (alu_num_protocolo) REFERENCES aluno(alu_num_protocolo)
            );
        `;
            await conexao.execute(sql2);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }
    */

    async incluir(presenca, supabase) {
    // Validação (corrigir acesso a rows)
        const sqlValida = `SELECT 1 FROM horario WHERE hora_mat_id = $1 AND hora_turm_id = $2`;
        const validacaoResult = await supabase.query(sqlValida, [presenca.materia.id, presenca.turma.id]);
        if (validacaoResult.rows.length === 0) throw new Error('Matéria não oferecida para esta turma');

        // Inserir presença com RETURNING
        const sqlPresenca = `
            INSERT INTO presenca (pre_data_hora, mat_id, turm_id) 
            VALUES ($1, $2, $3) 
            RETURNING pre_id
        `;
        const result = await supabase.query(sqlPresenca, [
            presenca.dataHora, 
            presenca.materia.id, 
            presenca.turma.id
        ]);
        const presencaId = result.rows[0].pre_id;

        // Inserir alunos (correção de acesso a rows)
        for (const ap of presenca.alunosPresentes) {
            const sqlAluno = `
                INSERT INTO presenca_aluno (pre_id, alu_id, presente) 
                VALUES ($1, $2, $3)
            `;
            await supabase.query(sqlAluno, [
                presencaId, 
                ap.aluno.id,  // Agora usa alu_id
                ap.presente
            ]);
        }
    }

    async consultar(supabase) {
        const sql = `
            SELECT 
                p.pre_id AS id,
                p.pre_data_hora AS "dataHora",
                m.mat_nome AS "materiaNome",
                t.turm_cor AS "turmaCor"
            FROM presenca p
            JOIN materia m ON p.mat_id = m.mat_id
            JOIN turma t ON p.turm_id = t.turm_id
        `;

        const result = await supabase.query(sql);
        return result.rows.map(row => new Presenca(
            row.id,
            new Date(row.dataHora),
            new Materia(0, row.materiaNome),
            new Turma(0, row.turmaCor, '')
        ));
    }

    async consultarTurmasPorMateria(materiaId, supabase) {
        const sql = `
            SELECT DISTINCT
                t.turm_id   AS id,
                t.turm_cor  AS cor,
                t.turm_per  AS periodo
            FROM horario h
            JOIN turma   t ON h.hora_turm_id = t.turm_id
            WHERE h.hora_mat_id = $1
        `;
        // Correção: Acessar result.rows
        const result = await supabase.query(sql, [materiaId]);
        const rows = result.rows;
        return rows.map(r => new Turma(r.id, r.cor, r.periodo));
    }

    async alterar(presenca, supabase) {
        // Inicia transação
        await supabase.query('BEGIN');

        try {
            // Passo 1: Excluir registros antigos de alunos
            await supabase.query(
                'DELETE FROM presenca_aluno WHERE pre_id = $1',
                [presenca.id]
            );

            // Passo 2: Inserir novos registros de alunos
            for (const ap of presenca.alunosPresentes) {
                await supabase.query(
                    'INSERT INTO presenca_aluno (pre_id, alu_id, presente) VALUES ($1, $2, $3)',
                    [presenca.id, ap.aluno.id, ap.presente]
                );
            }

            // Passo 3: Atualizar data/hora da presença
            await supabase.query(
                'UPDATE presenca SET pre_data_hora = $1 WHERE pre_id = $2',
                [presenca.dataHora, presenca.id]
            );

            // Commit da transação
            await supabase.query('COMMIT');
        } catch (erro) {
            await supabase.query('ROLLBACK');
            throw erro;
        }
    }

    async excluir(presenca, supabase)
    {
        if(presenca instanceof Presenca)
        {
            const deletedId = presenca.id;
            const sql2 = `DELETE FROM presenca_aluno WHERE pre_id = $1`;
            await supabase.query(sql2, [deletedId]);
            const sql = `DELETE FROM presenca WHERE pre_id = $1`;
            await supabase.query(sql, [deletedId]);
            return true;
        }
    }
}