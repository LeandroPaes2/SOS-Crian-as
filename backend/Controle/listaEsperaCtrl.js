
import ListaEspera from "../Modelo/listaEspera.js";
import Aluno from "../Modelo/aluno.js";
import conectar from "./Conexao.js";

export default class ListaEsperaCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const aluno = req.body.aluno || {};
            const dataInsercao = req.body.dataInsercao;
            const prioridade = req.body.prioridade;
            const status = req.body.status;

            if (!aluno || !aluno.id) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Aluno não informado ou inválido."
                });
            }


            if (dataInsercao && prioridade && !isNaN(status)) {

                let conexao;

                try {
                    const objAluno = new Aluno(
                        aluno.id,
                        aluno.nome,
                        aluno.dataNascimento,
                        aluno.objResponsavel,
                        aluno.cidade,
                        aluno.rua,
                        aluno.bairro,
                        aluno.numero,
                        aluno.objEscola,
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
                        aluno.cep);

                    const listaEspera = new ListaEspera(
                        aluno.id,
                        objAluno,
                        dataInsercao,
                        prioridade,
                        status
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    if (listaEspera.incluir(conexao)) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Cadastrado com sucesso na Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao cadastrar listaEspera." });
                    }

                } catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                }
                finally {
                    conexao.release();
                }
            } else 
                res.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos. Verifique a requisição." });
            
            
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
                aluno.objResponsavel,
                aluno.cidade,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.objEscola,
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
                aluno.cep);


            if (id > 0 && dataInsercao && prioridade && status>-1 && status < 2) {
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

                    if (listaEspera.alterar(conexao)) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Alterado com sucesso na Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao alterar listaEspera." });
                    }

                } catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                } 
                finally {
                    conexao.release();
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
            const id = parseInt(req.params.id); // usa o mesmo nome do model

            if (!isNaN(id)) {
                const listaEspera = new ListaEspera(id);


                let conexao;

                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    if (listaEspera.excluir(conexao)) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Excluído com sucesso da Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao excluir na lista de espera. Verifique se o ID existe." });
                    }

                } catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                } 
                finally {
                    conexao.release();
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
            const termo = req.params.id || ""; // Pode ser número (protocolo) ou string para buscar por nome
            const listaEspera = new ListaEspera();
            let conexao;

            try {
                conexao = await conectar();
                const listaListaEspera = await listaEspera.consultar(termo, conexao);

                if (Array.isArray(listaListaEspera) && listaListaEspera.length > 0) {
                    res.status(200).json(listaListaEspera);
                } else {
                    res.status(404).json({ status: false, mensagem: "Nenhuma criança encontrada na Lista de Espera." });
                }

            } catch (erro) {
                res.status(500).json({ status: false, mensagem: "Erro ao consultar na lista de esperas: " + erro.message });
            } finally {
                if (conexao) conexao.release();
            }

        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }
    }
}