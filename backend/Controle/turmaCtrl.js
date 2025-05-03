import Turma from "../Modelo/turma.js";
import supabase from "../Persistencia/Conexao.js";


export default class TurmaCtrl {

    async gravar(req, res) {
        res.type("application/json");

        if (req.method === 'POST' && req.is("application/json")) {
            const { cor, periodo } = req.body;

            if (cor && periodo) {
                try {
                    const turma = new Turma(0, cor, periodo);
                    const resultado = await turma.incluir();

                    if (resultado && !resultado.error) {
                        res.status(200).json({
                            status: true,
                            mensagem: "Turma adicionada com sucesso!",
                            cor: turma.cor
                        });
                    } else {
                        throw new Error(resultado.error?.message || "Erro ao incluir turma");
                    }
                } catch (erro) {
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível incluir a turma: " + erro.message
                    });
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

        if ((req.method === 'PUT' || req.method === 'PATCH') && req.is("application/json")) {
            const id = req.params.id;
            const { cor, periodo } = req.body;

            if (id && cor && periodo) {
                try {
                    const turma = new Turma(id, cor, periodo);
                    const resultado = await turma.alterar();

                    if (resultado && !resultado.error) {
                        res.status(200).json({
                            status: true,
                            mensagem: "Turma alterada com sucesso!"
                        });
                    } else {
                        throw new Error(resultado.error?.message || "Erro ao alterar turma");
                    }
                } catch (erro) {
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível alterar a turma: " + erro.message
                    });
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
    
        if (req.method === 'DELETE') {
            const id = req.params.id;
    
            if (id && !isNaN(id)) {
                try {
                    const turma = new Turma(id);
                    const resultado = await turma.excluir();
    
                    // Verifica se o resultado é nulo ou indefinido
                    if (resultado === null || resultado === undefined) {
                        // Considera como sucesso se não houver erro no retorno
                        res.status(200).json({
                            status: true,
                            mensagem: "Turma excluída com sucesso!"
                        });
                    } else {
                        // Caso o resultado tenha alguma resposta, verifica seu sucesso
                        if (resultado.success) {
                            res.status(200).json({
                                status: true,
                                mensagem: "Turma excluída com sucesso!"
                            });
                        } else {
                            throw new Error(resultado.error?.message || "Erro desconhecido ao excluir a turma");
                        }
                    }
                } catch (erro) {
                    res.status(500).json({
                        status: false,
                        mensagem: "Não foi possível excluir a turma: " + erro.message
                    });
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
        res.type("application/json");

        if (req.method === "GET") {
            const id = req.params.id;
            const turma = new Turma();

            try {
                const listaTurma = await turma.consultar(id);

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
