import Presenca from "../Modelo/presenca.js";
import supabase from "./Conexao.js";
import Turma from "../Modelo/turma.js";
import Materia from "../Modelo/materia.js";
import Aluno from "../Modelo/aluno.js";

export default class PresencaDAO{

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
            SELECT DISTINCT
                p.pre_id AS id,
                p.pre_data_hora AS "dataHora",
                m.mat_id AS "materiaId",
                m.mat_nome AS "materiaNome",
                t.turm_id AS "turmaId",
                t.turm_cor AS "turmaCor",
                a.alu_id AS "alunoId",
                a.alu_nome AS "alunoNome",
                pa.presente
            FROM presenca p
            JOIN materia m ON p.mat_id = m.mat_id
            JOIN turma t ON p.turm_id = t.turm_id
            LEFT JOIN presenca_aluno pa ON p.pre_id = pa.pre_id
            LEFT JOIN aluno a ON pa.alu_id = a.alu_id
        `;

        try {
            const result = await supabase.query(sql);
            const rows = result.rows;
            
            // Agrupa os registros por presença
            const presencasMap = new Map();
            
            rows.forEach(row => {
                if (!presencasMap.has(row.id)) {
                    presencasMap.set(row.id, new Presenca(
                        row.id,
                        new Date(row.dataHora),
                        new Materia(row.materiaId, row.materiaNome),
                        new Turma(row.turmaId, row.turmaCor, ''),
                        []
                    ));
                }
                
                if (row.alunoId) {
                    presencasMap.get(row.id).alunosPresentes.push({
                        aluno: new Aluno(row.alunoId, row.alunoNome),
                        presente: row.presente
                    });
                }
            });

            return Array.from(presencasMap.values());
            
        } catch (erro) {
            console.error("Erro na consulta de presenças:", erro);
            throw erro;
        }
    }

    async consultarPorId(id, supabase) {
        const sql = `
            SELECT 
                p.pre_id AS id,
                p.pre_data_hora AS "dataHora",
                m.mat_id AS "materiaId",
                m.mat_nome AS "materiaNome",
                t.turm_id AS "turmaId",
                t.turm_cor AS "turmaCor",
                a.alu_id AS "alunoId",
                a.alu_nome AS "alunoNome",
                pa.presente
            FROM presenca p
            JOIN materia m ON p.mat_id = m.mat_id
            JOIN turma t ON p.turm_id = t.turm_id
            LEFT JOIN presenca_aluno pa ON p.pre_id = pa.pre_id
            LEFT JOIN aluno a ON pa.alu_id = a.alu_id
            WHERE p.pre_id = $1
        `;
    
        try {
            const result = await supabase.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error("Presença não encontrada");
            }
    
            // Processamento dos dados igual ao método consultar()
            const presenca = new Presenca(
                result.rows[0].id,
                new Date(result.rows[0].dataHora),
                new Materia(result.rows[0].materiaId, result.rows[0].materiaNome),
                new Turma(result.rows[0].turmaId, result.rows[0].turmaCor, '')
            );
    
            // Adiciona alunos presentes
            result.rows.forEach(row => {
                if (row.alunoId) {
                    presenca.alunosPresentes.push({
                        aluno: new Aluno(row.alunoId, row.alunoNome),
                        presente: row.presente
                    });
                }
            });
    
            return presenca;
        } catch (erro) {
            console.error("Erro ao consultar presença por ID:", erro);
            throw erro;
        }
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