import Horario from "../Modelo/horario.js";
import Turma from "../Modelo/turma.js";
import Materia from "../Modelo/materia.js";

export default class HorarioDAO {
    async incluir(horario, conexao) {
        if (horario instanceof Horario) {
            const sql = `INSERT INTO horario(hora_turm_id, hora_mat_id, hora_hora, hora_semana)  
                         VALUES ($1, $2, $3, $4)`;

            const parametros = [
                horario.Turma.id,
                horario.Materia.id,
                horario.Hora,
                horario.Semana
            ];

            await conexao.query(sql, parametros);
            return true;
        }
        return false;
    }

    async alterar(horario, conexao) {
        if (horario instanceof Horario) {
            const sql = `UPDATE horario 
                         SET hora_turm_id = $1, hora_mat_id = $2, hora_hora = $3, hora_semana = $4 
                         WHERE hora_id = $5`;

            const parametros = [
                horario.Turma.id,
                horario.Materia.id,
                horario.Hora,
                horario.Semana,
                horario.id
            ];

            const resultado = await conexao.query(sql, parametros);
            return resultado.rowCount > 0;
        }
        return false;
    }

    async excluir(horario, conexao) {
    if (horario instanceof Horario) {
        const sql = `DELETE FROM horario WHERE hora_id = $1`;
        const parametros = [horario.id];
        const resultado = await conexao.query(sql, parametros);
        return resultado.rowCount;  // retorna número de linhas afetadas
    }
    return 0;
}


    async consultar(termo, conexao) {
        let sql = "";
        let parametros = [];

        if (!termo) {
            sql = `SELECT * FROM horario`;
        } else if (!isNaN(parseInt(termo))) {
            sql = `SELECT * FROM horario WHERE hora_id = $1`;
            parametros = [parseInt(termo)];
        } else {
            sql = `SELECT * FROM horario WHERE hora_hora ILIKE $1 OR hora_semana ILIKE $1`;
            parametros = ['%' + termo + '%'];
        }

        const resultado = await conexao.query(sql, parametros);
        const linhas = resultado.rows;
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
