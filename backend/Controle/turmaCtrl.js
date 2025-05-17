import Turma from "../Modelo/turma.js";
import criarConexao from "../Persistencia/Conexao.js";

export default class TurmaCtrl {

    async gravar(req, res) {
        res.type("application/json");
        const conexao = await criarConexao();

        if (req.method === 'POST' && req.is("application/json")) {
            const cor = req.body.cor;
            const periodo = req.body.periodo;

            if (cor && periodo) {
                const turma = new Turma(0, cor, periodo);
                await conexao.query("BEGIN");
                try {
                    await turma.incluir(conexao);
                    await conexao.query("COMMIT");
                    res.status(200).json({
                        status: true,
                        mensagem: "Turma adicionada com sucesso!"
                    })
                } catch (erro) {
                    await conexao.query("ROLLBACK");
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível incluir a turma: " + erro.message
                    });
                } finally {
                    if (conexao)
                        conexao.release();
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
        res.type("application/json");
        const conexao = await criarConexao();

        if ((req.method === 'PUT' || req.method === 'PATCH') && req.is("application/json")) {
            const id = req.params.id;
            const cor = req.body.cor;
            const periodo = req.body.periodo;


            if (id && cor && periodo) {
                try {
                    const turma = new Turma(id, cor, periodo);
                    await conexao.query("BEGIN");

                    const resultado = await turma.alterar(conexao);

                    if (resultado && !resultado.error) {
                        await conexao.query("COMMIT");
                        res.status(200).json({
                            status: true,
                            mensagem: "Turma alterada com sucesso!"
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        throw new Error(resultado.error?.message || "Erro ao alterar turma");
                    }
                } catch (erro) {
                    await conexao.query("ROLLBACK");
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível alterar a turma: " + erro.message
                    });
                } finally {
                    conexao.release();
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
        res.type("application/json");
        const conexao = await criarConexao();

        if (req.method === 'DELETE') {
            const id = req.params.id;

            if (id && !isNaN(id)) {
                try {
                    const turma = new Turma(id);
                    await conexao.query("BEGIN");

                    const resultado = await turma.excluir(conexao);

                    if (!resultado || resultado.success) {
                        await conexao.query("COMMIT");
                        res.status(200).json({
                            status: true,
                            mensagem: "Turma excluída com sucesso!"
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        throw new Error(resultado.error?.message || "Erro ao excluir turma");
                    }
                } catch (erro) {
                    await conexao.query("ROLLBACK");
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível excluir a turma: " + erro.message
                    });
                } finally {
                    conexao.release?.();
                }
            } else {
                res.status(400).json({
                    status: false,
                    mensagem: "Informe um código de turma válido."
                });
            }
        } else {
            res.status(405).json({
                status: false,
                mensagem: "Método não permitido. Utilize o método DELETE para exclusão."
            });
        }
    }

    async consultar(req, res) {
        const conexao = await criarConexao();
        res.type("application/json");

        if (req.method === "GET") {
            let id = req.params.id;
            const turma = new Turma();

            try {
                const listaTurma = await turma.consultar(id, conexao);
                if (Array.isArray(listaTurma) && listaTurma.length > 0) {
                    res.status(200).json(listaTurma);
                } else {
                    res.status(404).json({
                        status: false,
                        mensagem: "Nenhuma turma encontrada"
                    });
                }
            } catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar turma: " + erro.message
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }
}
