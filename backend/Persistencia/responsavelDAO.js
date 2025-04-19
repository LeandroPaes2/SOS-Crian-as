import Responsavel from "../Modelo/responsavel.js";

import conectar from "./Conexao.js";
export default class ResponsavelDAO {
    constructor() {
        //this.init();
    }

    /*async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS responsavel(
                resp_cpf VARCHAR(14) NOT NULL,
                resp_nome VARCHAR(50) NOT NULL,
                resp_telefone VARCHAR(1) NOT NULL,
                CONSTRAINT pk_responsavel PRIMARY KEY(resp_cpf)
            );
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }*/

    async incluir(responsavel, conexao) {
        if (responsavel instanceof Responsavel) {
            const sql = `INSERT INTO responsavel(resp_cpf, resp_nome,resp_telefone)
                VALUES (?, ?,?)
            `;
            let parametros = [
                responsavel.cpf,
                responsavel.nome,
                responsavel.telefone
            ];
            await conexao.execute(sql, parametros);
        }
    }

    async alterar(responsavel, conexao) {
        if (responsavel instanceof Responsavel) {
            const sql = `UPDATE responsavel SET resp_nome=?, resp_telefone=?
                WHERE  resp_cpf = ?
            `;
            let parametros = [
                responsavel.nome,
                responsavel.telefone,
                responsavel.cpf
            ]; 
            await conexao.execute(sql, parametros);
        }
    }
    
    async consultar(termo, conexao) {
        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM responsavel r
                   WHERE resp_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
        else {
            sql = `SELECT * FROM responsavel r
                   WHERE resp_cpf = ?`
            parametros = [termo];
        }
        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaResponsavel = [];
        for (const linha of linhas) {
            const responsavel = new Responsavel(
                linha['resp_cpf'],
                linha['resp_nome'],
                linha['resp_telefone']
            );
            listaResponsavel.push(responsavel);
        }
        return listaResponsavel;
    }

    async excluir(responsavel, conexao) {
        if (responsavel instanceof Responsavel) {
            const sql = `DELETE FROM responsavel WHERE resp_cpf = ?`;
            let parametros = [
                responsavel.cpf
            ]; 
            await conexao.execute(sql, parametros);
        }
    }
}