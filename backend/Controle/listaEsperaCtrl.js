import ListaEspera from "../Modelo/listaEspera.js";
import Aluno from "../Modelo/aluno.js";
import conectar from "../Persistencia/Conexao.js";

export default class ListaEsperaCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const aluno = req.body.aluno || {};
            const prioridade = req.body.prioridade;
            const status = req.body.status;
            const dataInsercao = new Date().toISOString().split('T')[0];

            if (!aluno || !aluno.id) {
                return res.status(400).json({
                    "status": false,
                    "mensagem": "Aluno não informado ou inválido."
                });
            }

            if (!isNaN(prioridade) && !isNaN(status)) {
                let conexao;
                try {
                    const objAluno = new Aluno(
                        aluno.id,
                        aluno.nome,
                        aluno.dataNascimento,
                        aluno.responsavel,
                        aluno.cidade,
                        aluno.rua,
                        aluno.bairro,
                        aluno.numero,
                        aluno.escola,
                        aluno.telefone,
                        aluno.periodoEscola,
                        aluno.realizaAcompanhamento,
                        aluno.possuiSindrome,
                        aluno.descricao,
                        aluno.dataInsercaoListaEspera,
                        aluno.rg,
                        aluno.objFormularioSaude,
                        aluno.ficha,
                        aluno.dataInsercaoProjeto,
                        aluno.status,
                        aluno.periodoProjeto,
                        aluno.cep
                    );

                    const listaEspera = new ListaEspera(
                        aluno.id,
                        objAluno,
                        dataInsercao,
                        prioridade,
                        status
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    await listaEspera.incluir(conexao);
                    await conexao.query("COMMIT");

                    res.status(200).json({ status: true, mensagem: "Cadastrado com sucesso na Lista de Espera!" });

                } catch (e) {
                    if (conexao) await conexao.query('ROLLBACK');
                    res.status(500).json({ status: false, mensagem: "Erro ao cadastrar: " + e.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos. Verifique a requisição." });
            }

        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async alterar(req, res) {
        res.type("application/json");

        if ((req.method === "PUT" || req.method === "PATCH") && req.is("application/json")) {
            const id = req.body.id;
            const aluno = req.body.aluno || {};
            const dataInsercao = req.body.dataInsercao;
            const prioridade = req.body.prioridade;
            const status = req.body.status;

            const objAluno = new Aluno(
                aluno.id,
                aluno.nome,
                aluno.dataNascimento,
                aluno.responsavel,
                aluno.cidade,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.escola,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.dataInsercaoListaEspera,
                aluno.rg,
                aluno.objFormularioSaude,
                aluno.ficha,
                aluno.dataInsercaoProjeto,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep
            );

            if (id > 0 && dataInsercao && prioridade >= 0 && status > -1 && status < 2) {
                let conexao;
                try {
                    const listaEspera = new ListaEspera(
                        id,
                        objAluno,
                        dataInsercao,
                        prioridade,
                        status
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    await listaEspera.alterar(conexao);
                    await conexao.query("COMMIT");

                    res.status(200).json({ status: true, mensagem: "Alterado com sucesso na Lista de Espera!" });

                } catch (e) {
                    if (conexao) await conexao.query('ROLLBACK');
                    res.status(500).json({ status: false, mensagem: "Erro ao alterar: " + e.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos." });
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async excluir(req, res) {
        res.type("application/json");

        if (req.method === "DELETE") {
            const id = parseInt(req.params.id);

            if (!isNaN(id)) {
                const listaEspera = new ListaEspera(id);
                let conexao;

                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    await listaEspera.excluir(conexao);
                    await conexao.query("COMMIT");

                    res.status(200).json({ status: true, mensagem: "Excluído com sucesso da Lista de Espera!" });

                } catch (e) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao excluir: " + e.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({ status: false, mensagem: "ID inválido!" });
            }

        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método DELETE." });
        }
    }

    async consultar(req, res) {
        res.type("application/json");

        if (req.method === "GET") {
            let id = req.params.id || "";
            const listaEspera = new ListaEspera();
            const conexao = await conectar();

            try {
                await conexao.query('BEGIN');
                const listasEsp = await listaEspera.consultar({ id }, conexao);
                await conexao.query('COMMIT');
                res.status(200).json(listasEsp);
            } catch (e) {
                await conexao.query('ROLLBACK');
                res.status(500).json({ status: false, mensagem: e.message });
            } finally {
                conexao.release();
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }
    }


}
