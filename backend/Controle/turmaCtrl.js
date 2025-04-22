import Turma from "../Modelo/turma.js";
import conectar from "../Persistencia/Conexao.js";

export default class TurmaCtrl {

    async gravar(req, res) {
        const conexao = await conectar();

        res.type("application/json");

        if (req.method === 'POST' && req.is("application/json")) {
            const { cor, periodo } = req.body;

            if (cor && periodo) {
                try {
                    const turma = new Turma(0, cor, periodo);
                    await conexao.query("BEGIN");

                    const resultado = await turma.incluir(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({
                            status: true,
                            mensagem: "Turma adicionada com sucesso!",
                            cor: turma.cor
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({
                            status: false,
                            mensagem: "Não foi possível incluir a turma"
                        });
                    }
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível incluir a turma: " + erro.message
                    });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({
                    status: false,
                    mensagem: "Informe corretamente todos os dados de uma turma conforme documentação da API."
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async editar(req, res) {
        const conexao = await conectar();

        res.type("application/json");

        if ((req.method === 'PUT' || req.method === 'PATCH') && req.is("application/json")) {
            const id = req.params.id;
            const cor = req.body.cor;
            const periodo = req.body.periodo;

            if (id && cor && periodo) {
                try {
                    const turma = new Turma(id, cor, periodo);
                    await conexao.query("BEGIN");

                    const resultado = await turma.alterar(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({
                            status: true,
                            mensagem: "Turma alterada com sucesso!"
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({
                            status: false,
                            mensagem: "Não foi possível alterar a turma"
                        });
                    }
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível alterar a turma: " + erro.message
                    });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({
                    status: false,
                    mensagem: "Informe corretamente todos os dados de uma turma conforme documentação da API."
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async excluir(req, res) {
        const conexao = await conectar();

        res.type("application/json");

        if (req.method === 'DELETE') {
            const id = req.params.id;

            if (id) {
                try {
                    const turma = new Turma(id, null, null);
                    await conexao.query("BEGIN");

                    const resultado = await turma.excluir(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({
                            status: true,
                            mensagem: "Turma excluída com sucesso!"
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({
                            status: false,
                            mensagem: "Não foi possível excluir a turma"
                        });
                    }
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível excluir a turma: " + erro.message
                    });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({
                    status: false,
                    mensagem: "Informe um código válido de uma turma conforme documentação da API."
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async consultar(req, res) {
        res.type("application/json");
        const conexao = await conectar();

        if (req.method === "GET") {
            let id = req.params.id;  

            const turma = new Turma();

            try {
                const listaTurma = await turma.consultar(id, conexao);

                if (Array.isArray(listaTurma) && listaTurma.length > 0) {
                    res.status(200).json(listaTurma);
                } else {
                    res.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar turma"
                    });
                }
            } catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar turma: " + erro.message
                });
            } finally {
                if (conexao) 
                    conexao.release();
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }
}
