import Funcionario from "../Modelo/funcionario.js";
import conectar from "../Persistencia/Conexao.js";
import jwt from "jsonwebtoken";
import sgMail from '@sendgrid/mail';

export default class FuncionarioCtrl {
    constructor() {
        this.codigosRecuperacao = {}; // { email: { codigo, expira } }
    }
    async gravar(requisicao, resposta) {
        const conexao = await conectar();
        resposta.type("application/json");

        if (requisicao.method == 'POST' && requisicao.is("application/json")) {
            const { nome, cpf, cargo, nivel, email, senha } = requisicao.body;

            if (nome && cpf && cargo && nivel && email && senha) {
                const funcionario = new Funcionario(nome, cpf, cargo, nivel, email, senha);
                try {
                    await conexao.query('BEGIN');
                    await funcionario.incluir(conexao);
                    await conexao.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Funcionario adicionado com sucesso!"
                    });
                } catch (e) {
                    await conexao.query('ROLLBACK');
                    resposta.status(500).json({ status: false, mensagem: e.message });
                } finally {
                    conexao.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados de um funcionario conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async editar(requisicao, resposta) {
        const conexao = await conectar();
        resposta.type("application/json");

        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            const cpf = requisicao.params.cpf;
            const { nome, cargo, nivel, email, senha } = requisicao.body;

            if (nome && cargo && nivel && email && senha) {
                if (requisicao.body.cpf && requisicao.body.cpf !== cpf) {
                    return resposta.status(400).json({
                        "status": false,
                        "mensagem": "O CPF não pode ser alterado."
                    });
                }

                const funcionario = new Funcionario(nome, cpf, cargo, nivel, email, senha);
                try {
                    await conexao.query('BEGIN');
                    await funcionario.alterar(conexao);
                    await conexao.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Funcionário alterado com sucesso!"
                    });
                } catch (e) {
                    await conexao.query('ROLLBACK');
                    resposta.status(500).json({ status: false, mensagem: e.message });
                } finally {
                    conexao.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados de um funcionário conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async excluir(requisicao, resposta) {
        const conexao = await conectar();
        resposta.type("application/json");

        if (requisicao.method == 'DELETE') {
            const cpf = requisicao.params.cpf;
            if (cpf) {
                const funcionario = new Funcionario("", cpf, "", "", "", "");
                try {
                    await conexao.query('BEGIN');
                    await funcionario.excluir(conexao);
                    await conexao.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Funcionario excluido com sucesso!"
                    });
                } catch (e) {
                    await conexao.query('ROLLBACK');
                    resposta.status(400).json({ 
                    status: false, 
                    mensagem: e.message // Manda a mensagem exata pro front
                });
                } finally {
                    conexao.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe um CPF válido conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async consultar(requisicao, resposta) {
    
        resposta.type("application/json");

        if (requisicao.method == "GET") {
            let cpf = requisicao.params.cpf || "";
            const funcionario = new Funcionario();
            let conexao;
            try {
                conexao = await conectar();
                await conexao.query('BEGIN');
                const listaFuncionario = await funcionario.consultar({ cpf }, conexao);
                await conexao.query('COMMIT');
                resposta.status(200).json(listaFuncionario);
            } catch (e) {
                resposta.status(500).json({ status: false, mensagem: e.message });
            } finally {
                if(conexao)
                    conexao.release();
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }
    
    async consultarEmail(requisicao, resposta) {
    
        resposta.type("application/json");

        if (requisicao.method == "GET") {
            let email = requisicao.params.email || "";
            const funcionario = new Funcionario();
            let conexao;
            try {
                conexao = await conectar();
                await conexao.query('BEGIN');
                const listaFuncionario = await funcionario.consultar({ email }, conexao);
                await conexao.query('COMMIT');
                resposta.status(200).json(listaFuncionario);
            } catch (e) {
                resposta.status(500).json({ status: false, mensagem: e.message });
            } finally {
                if(conexao)
                    conexao.release();
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async consultarPorEmail(email) {
        let conexao;
        try {
            conexao = await conectar();
        
            const resultado = await conexao.query(
                'SELECT * FROM funcionario WHERE func_email = $1',
                [email]
            );

            if(conexao)
                conexao.release();

            if (resultado.rows.length === 0) {
                return null; // ou lançar erro se preferir
            }

            return resultado.rows[0]; // retorna o funcionário encontrado

        } catch (erro) {
            console.error("Erro ao buscar funcionário por e-mail:", erro.message);
            throw new Error("Erro ao buscar funcionário.");
        }
    }


    async autenticar(req, res) {
        const { email, senha } = req.body;

        if (req.method === "POST") {
            let conexao;
            try {
                conexao = await conectar();
                const funcionario = new Funcionario();
                const funcSenhaCorreta = await funcionario.autenticar(email, senha, conexao);

                if (!funcSenhaCorreta || funcSenhaCorreta.error) {
                    return res.status(401).json({ erro: funcSenhaCorreta.error || "Email incorreto" });
                }

               
                    const token = jwt.sign(
                    {
                        email: funcSenhaCorreta.email,
                        nivel: funcSenhaCorreta.nivel
                    },
                        process.env.JWT_SECRET,
                        { expiresIn: "8h" } // você pode ajustar esse tempo
                    );
                    res.status(200).json({
                        mensagem: `Login do funcionario ${funcSenhaCorreta.nome} realizado com sucesso`,
                        funcionario: funcSenhaCorreta,
                        token: token
                    });
                
            } catch (e) {
                res.status(500).json({ status: false, mensagem: e.message });
            } finally {
                if(conexao)
                    conexao.release();
            }
        } else {
            res.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async salvarCodigoRecuperacao(email, codigo) {
        const expira = Date.now() + 10 * 60 * 1000;
        this.codigosRecuperacao[email] = { codigo, expira };
        console.log(`Código salvo para ${email}:`, codigo);
    }

    verificarCodigo(email, codigo) {
        const registro = this.codigosRecuperacao[email];
        console.log('Verificando código:', { email, codigoEnviado: codigo, codigoSalvo: registro?.codigo });
        if (!registro) return false;
        if (registro.codigo.toString() !== codigo.toString()) return false;
        if (Date.now() > registro.expira) {
            delete this.codigosRecuperacao[email];
            return false;
        }
        return true;
    }

    removerCodigo(email) {
        delete this.codigosRecuperacao[email];
    }

    async atualizarSenhaFuncionario(req, res) {
        if (req.method !== "PUT") {
        return res.status(400).json({
            status: false,
            mensagem: "Requisição inválida! Consulte a documentação da API."
        });
        }
        const { email, novaSenha } = req.body;
        let conexao;
        try {
            conexao = await conectar();
            const funcionario = new Funcionario();

            const funcSenhaAlterada = await funcionario.atualizarSenhaFuncionario(
                email,
                novaSenha,
                conexao
            );

            if (funcSenhaAlterada) {
                this.removerCodigo(email);
                return res.status(200).json({
                    mensagem: `Senha alterada com sucesso`,
                    funcionario: funcSenhaAlterada
                });
            } else {
                return res.status(401).json({ erro: "Senha atual incorreta" });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({ status: false, mensagem: "Erro ao atualizar senha: " + e.message });
        } finally {
            if (conexao) conexao.release();
        }
    }

    async alterarSenhaFuncionario(req, res) {
    
        if (req.method !== "PUT") {
        return res.status(400).json({
            status: false,
            mensagem: "Requisição inválida! Consulte a documentação da API."
        });
        }

        const { email, senhaAtual, novaSenha } = req.body;
        console.log(email, senhaAtual, novaSenha);

        let conexao;
        try {
            conexao = await conectar();
            const funcionario = new Funcionario();

            const funcSenhaAlterada = await funcionario.alterarSenhaFuncionario(
                email,
                senhaAtual,
                novaSenha,
                conexao
            );

            if (funcSenhaAlterada) {
                const token = jwt.sign(
                    {
                        email: funcSenhaAlterada.email,
                        nivel: funcSenhaAlterada.nivel
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "2h" }
                );

                return res.status(200).json({
                    mensagem: `Senha do funcionário ${funcSenhaAlterada.nome} alterada com sucesso`,
                    funcionario: funcSenhaAlterada,
                    token: token
                });
            } else {
                return res.status(401).json({ erro: "Senha atual incorreta" });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({ status: false, mensagem: "Erro ao atualizar senha: " + e.message });
        } finally {
            if (conexao) conexao.release();
        }
    }
}
