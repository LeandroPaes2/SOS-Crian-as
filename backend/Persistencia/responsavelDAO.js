import Responsavel from "../Modelo/responsavel.js";

import conectar from "./Conexao.js";
export default class ResponsavelDAO {
    constructor() {
        this.init();
    }

    async init() {
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
    }

    async incluir(responsavel) {
        if (responsavel instanceof Responsavel) {
            const conexao = await conectar();
            const sql = `INSERT INTO responsavel(resp_cpf, resp_nome,resp_telefone)
                VALUES (?, ?,?)
            `;
            let parametros = [
                responsavel.cpf,
                responsavel.nome,
                responsavel.telefone
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }

    async alterar(responsavel) {
        if (responsavel instanceof Responsavel) {
            const conexao = await conectar();
            const sql = `UPDATE responsavel SET resp_nome =?, resp_telefone=?, resp_cpf=?
                WHERE  resp_cpf = ?
            `;
            let parametros = [
                responsavel.nome,
                responsavel.telefone,
                responsavel.cpf
            ]; 
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
    
    async consultar(termo) {
        //resuperar as linhas da tabela produto e transformá-las de volta em produtos
        const conexao = await conectar();
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
        await conexao.release();
        return listaResponsavel;
    }

    async excluir(responsavel) {
        if (responsavel instanceof Responsavel) {
            const conexao = await conectar();
            const sql = `DELETE FROM responsavel WHERE resp_cpf = ?`;
            let parametros = [
                responsavel.cpf
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
}