import Horario from "../Modelo/horario.js";
import Turma from "../Modelo/turma.js";
import Materia from "../Modelo/materia.js";

export default class HorarioDAO {
    async incluir(horario, conexao) {
        if(horario instanceof Horario) {
            const sql = `INSERT INTO horario(hora_turm_cor, hora_mat_nome)  
                VALUES (?, ?)
            `;
            const parametros =[
                horario.Turma.id,
                horario.Materia.id
            ];
            const [resultado] = await conexao.query(sql, parametros);
            return resultado;

        }
    }
    async alterar(horario, conexao) {
        if(horario instanceof Horario) {
            const sql = `UPDATE horario SET hora_turm_cor = ?, hora_mat_nome = ? WHERE hora_id = ?`;
            const parametros =[
                horario.Turma.id,
                horario.Materia.id,
                horario.id
            ];
            const [resultado] = await conexao.query(sql, parametros);
            return resultado;
        }
    }

    async excluir(horario, conexao) {
        if(horario instanceof Horario) {
            const sql = `DELETE FROM horario WHERE hora_id = ?`;
            const parametros =[
                horario.id
            ];
            const [resultado] = await conexao.query(sql, parametros);
            return resultado;
        }
    }

    async consultar(termo, conexao) {   
        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM horario`;
        } else {
            sql = `SELECT * FROM horario WHERE hora_id = ?`;
            parametros = [termo];
        }
        const [linhas, campos] = await conexao.query(sql, parametros);
        let listaHorario = [];
        for (const linha of linhas) {
            const horario = new Horario(
                linha['hora_id'], 
                new Turma(linha['hora_turm_cor']),
                new Materia(linha['hora_mat_nome'])
            );
            listaHorario.push(horario);
        }
        return listaHorario;
    }

    /*async consultarTurmasPorMateria(materiaId, conexao) {
        let sql = `
            SELECT t.* 
            FROM horario h
            JOIN turma t ON h.hora_turm_cor = t.turm_id
            WHERE h.hora_mat_nome = ?
            GROUP BY t.turm_id
        `;
        const [linhas] = await conexao.execute(sql, [materiaId]);
        return linhas.map(linha => new Turma(
            linha.turm_id,
            linha.turm_cor,
            linha.turm_per
        ));
    }*/
}        