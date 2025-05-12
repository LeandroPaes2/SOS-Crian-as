import Turma from "../Modelo/turma.js";
import supabase from "./Conexao.js";

export default class TurmaDAO {

    async incluir(turma, supabase) {
        if (turma instanceof Turma) {
            const sql = `INSERT INTO turma(turm_cor, turm_per)
            VALUES ($1, $2)`;
            const parametros = [
                turma.cor,
                turma.periodo
            ];
            await supabase.query(sql, parametros);
        }
    }

    async alterar(turma, supabase) {
        if (turma instanceof Turma) {
            const sql = `UPDATE turma SET turm_cor = $1, turm_per = $2 
                        WHERE turm_id = $3`;
            const parametros = [
                turma.cor,
                turma.periodo,
                turma.id
            ];
            const resultado = await supabase.query(sql, parametros);
            return resultado; // agora retorna algo
        }
        return null;
    }

    async consultar(termo, supabase) {
        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM turma`;
        } else if (!isNaN(parseInt(termo))) {
            sql = `SELECT * FROM turma WHERE turm_id = $1`;
            parametros = [parseInt(termo)];
        } else {
            sql = `SELECT * FROM turma WHERE turm_cor ILIKE $1 OR turm_per ILIKE $1`;
            parametros = ['%' + termo + '%'];
        }
        const resultado = await supabase.query(sql, parametros);
        const linhas = resultado.rows;
        let listaTurma = [];
        for (const linha of linhas) {
            const turma = new Turma(
                linha['turm_id'],
                linha['turm_cor'],
                linha['turm_per']
            );
            listaTurma.push(turma);
        }
        return listaTurma;
    }

    async excluir(turma, supabase) {
        if (turma instanceof Turma) {
            const sql = `DELETE FROM turma WHERE turm_id = $1`;
            const parametros = [turma.id];
            await supabase.query(sql, parametros);
        }
    }
}