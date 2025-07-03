import bcrypt from "bcrypt";  // Importando o bcrypt
import Funcionario from "../Modelo/funcionario.js";

export default class FuncionarioDAO {

    /* constructor() {
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
                         func_senha TEXT NOT NULL,
                         CONSTRAINT pk_funcionario PRIMARY KEY(func_cpf)
                     )
                 `);
 
                 await conexao.release();
                 console.log("Tabela 'funcionario' foi recriada com sucesso.");
             } catch (e) {
                 console.log("Não foi possível iniciar o banco de dados: " + e.message);
             }
         }*/

    async incluir(conexao) {
        try {
            const senhaCriptografada = await bcrypt.hash(this.senha, 10);
            const sql = `
                INSERT INTO funcionario 
                (func_nome, func_cpf, func_cargo, func_nivel, func_email, func_senha)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            const parametros = [
                this.nome,
                this.cpf,
                this.cargo,
                this.nivel,
                this.email,
                senhaCriptografada
            ];
            await conexao.query(sql, parametros);
        } catch (e) {
            throw new Error("Erro ao incluir funcionário: " + e.message);

        }
    }

    async alterar(funcionario, conexao) {
        if (funcionario instanceof Funcionario) {
            try {
                var func = new Funcionario();
                const sqlBusca = `SELECT func_senha FROM funcionario WHERE func_cpf = $1`;
                const parametrosBusca = [
                    func.cpf
                ];
                ;
                if (await conexao.query(sqlBusca, parametrosBusca) !== funcionario.senha) {
                    // Criptografando a senha antes de atualizar
                    var senhaCriptografada = await bcrypt.hash(funcionario.senha, 10);
                }
                else {
                    var senhaCriptografada = func.senha;
                }

                const sql = `UPDATE funcionario 
                            SET func_nome = $1, func_cargo = $2, func_nivel = $3, func_email = $4, func_senha = $5 
                            WHERE func_cpf = $6`;
                const parametros = [
                    funcionario.nome,
                    funcionario.cargo,
                    funcionario.nivel,
                    funcionario.email,
                    senhaCriptografada,
                    funcionario.cpf
                ];
                await conexao.query(sql, parametros);
            } catch (e) {
                throw new Error("Erro ao alterar funcionário: " + e.message);
            }
        }
    }

    async consultar(termo, conexao) {
        try {
            let sql = "SELECT * FROM funcionario ORDER BY func_nome";
            let parametros = [];

            if (termo?.nome) {
                sql = "SELECT * FROM funcionario WHERE func_nome ILIKE $1 ORDER BY func_nome";
                parametros = [`%${termo.nome}%`];
            } else if (termo?.email) {
                sql = "SELECT * FROM funcionario WHERE func_email ILIKE $1 ORDER BY func_nome";
                parametros = [`%${termo.email}%`];
            }

            const resultado = await conexao.query(sql, parametros);
            return resultado.rows.map(linha => new Funcionario(
                linha.func_nome,
                linha.func_cpf,
                linha.func_cargo,
                linha.func_nivel,
                linha.func_email,
                linha.func_senha
            ));
        } catch (e) {
            throw new Error("Erro ao consultar funcionários: " + e.message);
        }
    }

    /*async verificarSenha(cpf, senha, conexao) {
        try {
            const sql = `SELECT func_senha FROM funcionario WHERE func_cpf = $1`;
            const resultado = await conexao.query(sql, [cpf]);

            if (resultado.rows.length > 0) {
                const senhaArmazenada = resultado.rows[0].func_senha;
                const senhaValida = await bcrypt.compare(senha, senhaArmazenada);
                return senhaValida;
            } else {
                throw new Error("Funcionário não encontrado");
            }
        } catch (e) {
            throw new Error("Erro ao verificar senha: " + e.message);
        }
    }*/

    async autenticar(email, senha, conexao) {
        try {
            const sql = `SELECT * FROM funcionario WHERE func_email = $1`;
            const resultado = await conexao.query(sql, [email]);

            if (resultado.rows.length === 0) {
                throw new Error("Email incorreto"); // Funcionário não encontrado
            }

            const linha = resultado.rows[0];
            console.log("Senha digitada:", senha);
            console.log("Hash armazenado:", linha.func_senha);
            const senhaCorreta = await bcrypt.compare(senha, linha.func_senha);
            console.log("Senha correta?", senhaCorreta);

            if (senhaCorreta) {
                return new Funcionario(
                    linha.func_nome,
                    linha.func_cpf,
                    linha.func_cargo,
                    linha.func_nivel,
                    linha.func_email,
                    linha.func_senha
                );
            } else {
                throw new Error("Senha incorreta"); // Senha incorreta
            }
        } catch (e) {
            return { error: e.message };
        }
    }

    async atualizarSenhaFuncionario(email, novaSenha, conexao) {
        try {
            const sqlSelect = `SELECT * FROM funcionario WHERE func_email = $1`;
            const resultado = await conexao.query(sqlSelect, [email]);
            if (resultado.rows.length === 0) {
                return null; // Funcionário não encontrado
            }

            const linha = resultado.rows[0];

            const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

            const sqlUpdate = `UPDATE funcionario SET func_senha = $1 WHERE func_email = $2`;
            await conexao.query(sqlUpdate, [novaSenhaHash, email]);

            return new Funcionario(
                linha.func_nome,
                linha.func_cpf,
                linha.func_cargo,
                linha.func_nivel,
                linha.func_email,
                novaSenhaHash
            );

        } catch (e) {
            throw new Error("Erro ao atualizar senha: " + e.message);
        }
    }

    async alterarSenhaFuncionario(email, senhaAtual, novaSenha, conexao) {
        try {
            const sqlSelect = `SELECT * FROM funcionario WHERE func_email = $1`;
            const resultado = await conexao.query(sqlSelect, [email]);

            if (resultado.rows.length === 0) {
                return null; // Funcionário não encontrado
            }

            const linha = resultado.rows[0];
            const senhaCorreta = await bcrypt.compare(senhaAtual, linha.func_senha);

            if (!senhaCorreta) {
                return null; // Senha atual incorreta
            }

            const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

            const sqlUpdate = `UPDATE funcionario SET func_senha = $1 WHERE func_email = $2`;
            await conexao.query(sqlUpdate, [novaSenhaHash, email]);

            return new Funcionario(
                linha.func_nome,
                linha.func_cpf,
                linha.func_cargo,
                linha.func_nivel,
                linha.func_email,
                novaSenhaHash
            );
        } catch (e) {
            throw new Error("Erro ao alterar senha: " + e.message);
        }
    }



    async excluir(funcionario, conexao) {
        if (funcionario instanceof Funcionario) {
            try {
                const niveisProtegidos = [3, 4, 5, 6];
                const nivelQuery = await conexao.query(
                    `SELECT func_nivel FROM funcionario WHERE func_cpf = $1`,
                    [funcionario.cpf]
                );

                if (nivelQuery.rows.length === 0) {
                    throw new Error("Funcionário não encontrado.");
                }

                const nivel = nivelQuery.rows[0].func_nivel;
                let countQuery;
                if (niveisProtegidos.includes(nivel)) {
                    countQuery = await conexao.query(
                        `SELECT COUNT(*) FROM funcionario WHERE func_nivel = ANY($1::int[])`,
                        [niveisProtegidos]
                    );
                    const total = parseInt(countQuery.rows[0].count);
                    if (total <= 1) {
                        throw new Error(`Não é possível excluir. Este é o último funcionário com acesso a funcionários`);
                    }
                }
                const sql = `DELETE FROM funcionario WHERE func_cpf = $1`;
                await conexao.query(sql, [funcionario.cpf]);
            } catch (e) {
                throw e;
            }
        }
    }

}
