
import ListaEspera from "../Modelo/listaEspera.js";
import Responsavel from "../Modelo/responsavel.js";
import Escola from "../Modelo/escola.js";
import conectar from "./Conexao.js";

export default class ListaEsperaCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const nome = req.body.nome;
            const dataNascimento = req.body.dataNascimento;
            const responsavel = req.body.responsavel || {};
            const rua = req.body.rua;
            const numero = req.body.numero;
            const escola = req.body.escola || {};
            const telefone = req.body.telefone;
            const periodoEscola = req.body.periodoEscola;
            const realizaAcompanhamento = req.body.realizaAcompanhamento;
            const possuiSindrome = req.body.possuiSindrome;
            const descricao = req.body.descricao;
            const dataInsercao = req.body.dataInsercao;
            if (!escola || !escola.id) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Escola não informada ou inválida."
                });
            }
            if (!responsavel || !responsavel.cpf) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Resposavel não informado ou inválido."
                });
            }


            if (nome && dataNascimento && rua && numero && telefone && periodoEscola && realizaAcompanhamento && possuiSindrome && descricao && dataInsercao) {

                let conexao;

                try {
                    const objResponsavel = new Responsavel(responsavel.cpf, responsavel.nome, responsavel.telefone);
                    const objEscola = new Escola(escola.id, escola.nome, escola.endereco, escola.telefone, escola.tipo);

                    const listaEspera = new ListaEspera(
                        0,
                        nome,
                        dataNascimento,
                        objResponsavel,
                        rua,
                        numero,
                        objEscola,
                        telefone,
                        periodoEscola,
                        realizaAcompanhamento,
                        possuiSindrome,
                        descricao,
                        dataInsercao
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    const resultado = await listaEspera.incluir(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Cadastrado com sucesso na Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao cadastrar listaEspera." });
                    }

                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro interno: " + erro.message });
                } finally {
                    if (conexao) conexao.release();
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
            const nome = req.body.nome;
            const dataNascimento = req.body.dataNascimento;
            const responsavel = req.body.responsavel || {};
            const rua = req.body.rua;
            const numero = req.body.numero;
            const escola = req.body.escola || {};
            const telefone = req.body.telefone;
            const periodoEscola = req.body.periodoEscola;
            const realizaAcompanhamento = req.body.realizaAcompanhamento;
            const possuiSindrome = req.body.possuiSindrome;
            const descricao = req.body.descricao;
            const dataInsercao = req.body.dataInsercao;

            const objResponsavel = new Responsavel(responsavel.cpf, responsavel.nome, responsavel.telefone);
            const objEscola = new Escola(escola.id, escola.nome, escola.endereco, escola.telefone, escola.tipo);


            if (id > 0 && nome && dataNascimento && rua && numero && telefone && periodoEscola && realizaAcompanhamento && possuiSindrome  && descricao && dataInsercao) {
                let conexao;
                try {

                    const listaEspera = new ListaEspera(
                        id,
                        nome,
                        dataNascimento,
                        objResponsavel,
                        rua,
                        numero,
                        objEscola,
                        telefone,
                        periodoEscola,
                        realizaAcompanhamento,
                        possuiSindrome,
                        descricao,
                        dataInsercao
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    const resultado = await listaEspera.alterar(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Alterado com sucesso na Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao alterar listaEspera." });
                    }

                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao alterar listaEspera: " + erro.message });
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
            const id = parseInt(req.params.id); // usa o mesmo nome do model

            if (!isNaN(id)) {
                const listaEspera = new ListaEspera(id);


                let conexao;

                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    const resultado = await listaEspera.excluir(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Excluído com sucesso da Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao excluir na lista de espera. Verifique se o ID existe." });
                    }

                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao excluir listaEspera: " + erro.message });
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