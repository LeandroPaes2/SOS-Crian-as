//DAO - Data Access Object
import Funcionario from "../Modelo/funcionario.js";
//import Aluno from "../Modelo/aluno.js";

import conectar from "./Conexao.js";
export default class FuncionarioDAO {
    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS funcionario(
                func_nome VARCHAR(40) NOT NULL,
                func_cpf VARCHAR(14) NOT NULL,
                func_cargo VARCHAR(40) NOT NULL,
                func_nivel VARCHAR(40) NOT NULL,
                CONSTRAINT pk_funcionario PRIMARY KEY(func_nome)
            );
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            const conexao = await conectar();
            const sql = `INSERT INTO funcionario(func_nome, func_cpf, func_cargo, func_nivel)
                VALUES (?, ?, ?, ?)
            `;
            let parametros = [
                funcionario.nome,
                funcionario.cpf,
                funcionario.cargo,
                funcionario.nivel
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }

    async alterar(funcionario) {
        if (funcionario instanceof Funcionario) {
            const conexao = await conectar();
            const sql = `UPDATE funcionario SET func_cpf =?
                WHERE  func_nome = ?
            `;
            let parametros = [
                funcionario.cpf,
                funcionario.cargo,
                funcionario.nivel,
                funcionario.nome
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
            sql = `SELECT * FROM funcionario t
                   WHERE func_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
        else {
            sql = `SELECT * FROM funcionario t
                   WHERE func_nome = ?`
            parametros = [termo];
        }
        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaFuncionario = [];
        for (const linha of linhas) {
            const funcionario = new Funcionario(
                linha['func_nome'],
                linha['func_cpf'],
                linha['func_cargo'],
                linha['func_nivel']
            );
            listaFuncionario.push(funcionario);
        }
        await conexao.release();
        return listaFuncionario;
    }

    async excluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            const conexao = await conectar();
            const sql = `DELETE FROM funcionario WHERE func_nome = ?`;
            let parametros = [
                funcionario.nome
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
}