import Horario from "../Modelo/horario.js";
import Turma from "../Modelo/turma.js";
import Materia from "../Modelo/materia.js";

export default class HorarioDAO {
    async incluir(horario, conexao) {
        if (horario instanceof Horario) {
            const sql = `INSERT INTO horario(hora_turm_id, hora_mat_id, hora_hora, hora_semana)  
                        VALUES (?, ?, ?, ?)`;

            const parametros = [
                horario.Turma.id,
                horario.Materia.id,
                horario.Hora,
                horario.Semana
            ];
            const [resultado] = await conexao.query(sql, parametros);
            return resultado;

        }
    }
    async alterar(horario, conexao) {
        if (horario instanceof Horario) {
            const sql = `UPDATE horario SET hora_turm_id = ?, hora_mat_id = ?, hora_hora = ?, hora_semana = ? WHERE hora_id = ?`;
            const parametros = [
                horario.Turma.id,
                horario.Materia.id,
                horario.Hora,
                horario.Semana,
                horario.id
            ];
            const [resultado] = await conexao.query(sql, parametros);
            return resultado;
        }
    }

    async excluir(horario, conexao) {
        if (horario instanceof Horario) {
            const sql = `DELETE FROM horario WHERE hora_id = ?`;
            const parametros = [horario.id];
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
                new Turma(linha['hora_turm_id']),
                new Materia(linha['hora_mat_id']),
                linha['hora_hora'],
                linha['hora_semana']
            );
            listaHorario.push(horario);
        }
        return listaHorario;
    }
}        