//DAO - Data Access Object
import Funcionario from "../Modelo/funcionario.js";
import conectar from "./Conexao.js";

export default class FuncionarioDAO {

    constructor() {
        this.init();
    }

        async init() {
            try {
                const conexao = await conectar();

                await conexao.execute(`
                    CREATE TABLE IF NOT EXISTS funcionario (
                        func_nome VARCHAR(50) NOT NULL,
                        func_cpf VARCHAR(14) NOT NULL UNIQUE,
                        func_cargo VARCHAR(20) NOT NULL,
                        func_nivel VARCHAR(20) NOT NULL,
                        func_email VARCHAR(50) NOT NULL,
                        func_senha VARCHAR(15) NOT NULL,
                        CONSTRAINT pk_funcionario PRIMARY KEY(func_cpf)
                    )
                `);

                await conexao.release();
                console.log("Tabela 'funcionario' foi recriada com sucesso.");
            } catch (e) {
                console.log("Não foi possível iniciar o banco de dados: " + e.message);
            }
        }
        

    async incluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            try {
                const conexao = await conectar();
                const sql = `INSERT INTO funcionario(func_nome, func_cpf, func_cargo, func_nivel, func_email, func_senha)
                             VALUES (?, ?, ?, ?, ?, ?)`;
                const parametros = [
                    funcionario.nome,
                    funcionario.cpf,
                    funcionario.cargo,
                    funcionario.nivel,
                    funcionario.email,
                    funcionario.senha
                ];
                await conexao.execute(sql, parametros);
                await conexao.release();
            } catch (e) {
                throw new Error("Erro ao incluir funcionário: " + e.message);
            }
        }
    }

    async alterar(funcionario) {
        if (funcionario instanceof Funcionario) {
            try {
                const conexao = await conectar();
                const sql = `UPDATE funcionario 
                             SET func_nome = ?, func_cargo = ?, func_nivel = ?, func_email = ?, func_senha = ? 
                             WHERE func_cpf = ?`;
                const parametros = [
                    funcionario.nome,
                    funcionario.cargo,
                    funcionario.nivel,
                    funcionario.email,
                    funcionario.senha,
                    funcionario.cpf
                ];
                await conexao.execute(sql, parametros);
                await conexao.release();
            } catch (e) {
                throw new Error("Erro ao alterar funcionário: " + e.message);
            }
        }
    }

    async excluir(funcionario) {
        if (funcionario instanceof Funcionario) {
            try {
                const conexao = await conectar();
                const sql = `DELETE FROM funcionario WHERE func_cpf = ?`;
                await conexao.execute(sql, [funcionario.cpf]);
                await conexao.release();
            } catch (e) {
                throw new Error("Erro ao excluir funcionário: " + e.message);
            }
        }
    }
        async consultar(termo) {
            try {
                const conexao = await conectar();
                let sql = "";
                let parametros = [];
        
                if (!termo) {
                    sql = `SELECT * FROM funcionario ORDER BY func_nome`;
                } else {
                    sql = `SELECT * FROM funcionario WHERE func_nome LIKE ? ORDER BY func_nome`;
                    parametros = ['%' + termo + '%'];
                }
        
                const [linhas] = await conexao.execute(sql, parametros);
                const listaFuncionario = linhas.map(linha => new Funcionario(
                    linha['func_nome'],
                    linha['func_cpf'],
                    linha['func_cargo'],
                    linha['func_nivel'],
                    linha['func_email'],
                    linha['func_senha']
                ));
                await conexao.release();
                return listaFuncionario;
            } catch (e) {
                throw new Error("Erro ao consultar funcionários: " + e.message);
            }
        }
        
}
