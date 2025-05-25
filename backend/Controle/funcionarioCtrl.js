import Funcionario from "../Modelo/funcionario.js";
import conectar from "../Persistencia/Conexao.js";

export default class FuncionarioCtrl {
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
                    resposta.status(500).json({ status: false, mensagem: e.message });
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

    async autenticar(req, res) {
        const { email, senha } = req.body;

        if (req.method === "POST") {
            let conexao;
            try {
                conexao = await conectar();
                const funcionario = new Funcionario();
                const funcSenhaCorreta = await funcionario.autenticar(email, senha, conexao);

                if (funcSenhaCorreta !== null) {
                    res.status(200).json({
                        mensagem: `Login do funcionario ${funcSenhaCorreta.nome} realizado com sucesso`,
                        funcionario: funcSenhaCorreta
                    });
                } else {
                    res.status(401).json({ erro: "Senha incorreta" });
                }
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


}
