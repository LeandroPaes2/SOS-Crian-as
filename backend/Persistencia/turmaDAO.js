import Turma from "../Modelo/turma.js";

export default class TurmaDAO {

    async incluir(turma, conexao) {
        if (turma instanceof Turma) {

            const sql = `INSERT INTO turma(turm_cor, turm_per)
                VALUES (?, ?)
            `;
            let parametros = [
                turma.cor,
                turma.periodo
            ]; 
            const [resultado] = await conexao.execute(sql, parametros);
            return resultado;
        }
    }

    async alterar(turma, conexao) {
        if (turma instanceof Turma) {
            
            const sql = `UPDATE turma 
                        SET turm_cor = ?, turm_per = ?
                        WHERE  turm_id = ?
            `;
            let parametros = [
                turma.cor,
                turma.periodo,
                turma.id
            ]; 
            const [resultado] = await conexao.execute(sql, parametros);
            return resultado;
 
        }
    }
    
    async consultar(termo, conexao) {

        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM turma`;
        }
        else {
            sql = `SELECT * FROM turma WHERE turm_id LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
        const [linhas, campos] = await conexao.execute(sql, parametros);
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

    async excluir(turma, conexao) {
        if (turma instanceof Turma) {
            const sql = `DELETE FROM turma WHERE turm_id = ?`;
            let parametros = [
                turma.id
            ]; 
            const [resultado] = await conexao.execute(sql, parametros);
            return resultado;
 
        }
    }
}