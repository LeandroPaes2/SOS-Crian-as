import Responsavel from "../Modelo/responsavel.js";

export default class ResponsavelDAO {
    /*constructor() {
        this.init();
    }*/

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
            try{
            const sql = `INSERT INTO responsavel(resp_cpf, resp_nome,resp_telefone)
                VALUES ($1, $2, $3)
            `;
            let parametros = [
                responsavel.cpf,
                responsavel.nome,
                responsavel.telefone
            ];
            await conexao.query(sql, parametros);
            }catch(e){
                throw new Error("Erro ao incluir funcionário: " + e.message);
            }
        }
    }

    async alterar(responsavel, conexao) {
        if (responsavel instanceof Responsavel) {
            try{
            const sql = `UPDATE responsavel SET resp_nome=$1, resp_telefone=$2
                WHERE  resp_cpf = $3
            `;
            let parametros = [
                responsavel.nome,
                responsavel.telefone,
                responsavel.cpf
            ]; 
            await conexao.query(sql, parametros);
            }catch(e){
                throw new Error("Erro ao alterar funcionário: " + e.message);
            }
        }
    }
    
    async consultar(termo, conexao) {
        try{
        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM responsavel`;
            parametros = [];
        }
        else {
            sql = `SELECT * FROM responsavel r
                   WHERE resp_cpf = $1`
            parametros = [termo];
        }
        const resultado = await conexao.query(sql, parametros);
        const linhas = resultado.rows;
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
        }catch(e){
            throw new Error("Erro ao consultar responsaveis: " + e.message);
        }
    }

    async excluir(responsavel, conexao) {
        if (responsavel instanceof Responsavel) {
            try{
            const sql = `DELETE FROM responsavel WHERE resp_cpf = $1`;
            let parametros = [
                responsavel.cpf
            ]; 
            await conexao.query(sql, parametros);
            }catch(e){
                throw new Error("Erro ao excluir funcionário: " + e.message);
            }
        }
    }
}