import Turma from "../Modelo/turma.js";
import Evento from "../Modelo/evento.js";
import EventoTurmas from "../Controle/eventoTurmasCtrl.js";

export default class EventoTurmasCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const { evento, turma } = req.body;
            const dadosValidos = evento && evento.id && turma && turma.id;
            if (dadosValidos) {
                let conexao;
                try {
                    conexao = await conectar();
                    let eventoTurmas = new EventoTurmas();
                    const evento = new Evento();
                    let objEvento = await new evento.consultar(evento.id, conexao);
                    const turma = new Turma();
                    let objTurma = await turma.consultar(turma.id, conexao);

                    const eveTurmaCompleto = new EventoTurmas(
                        objEvento,
                        objTurma);

                    await conexao.query("BEGIN");
                    try {
                        await eveTurmaCompleto.incluir(conexao);
                        await conexao.query("COMMIT");
                        res.status(200).json({
                            status: true,
                            mensagem: "Cadastro feito com sucesso."
                        });
                    }
                    catch (erro) {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({
                            status: false,
                            mensagem: "Erro ao cadastrar. Verifique os dados informados. " + erro.message
                        });
                    }
                }
                catch (erro) {
                    if (conexao)
                        await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro interno ao cadastrar eventoTurmas: " + erro.message });
                }
                finally {
                    if (conexao)
                        conexao.release();
                }
            }
            else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos. Verifique a requisição." });
            }
        }
        else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method == 'DELETE') {
            const evento = parseInt(requisicao.params.evento);
            if (!isNaN(id)) {
                const eventoTurmas = new EventoTurmas(evento);
                let conexao;
                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                    const resultado = await eventoTurmas.excluir(conexao);
                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "EventoTurmas desligado com sucesso!" });
                    }
                    else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao excluir EventoTurmas. Verifique se o evento existe." });
                    }
                }
                catch (erro) {
                    if (conexao)
                        await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro interno ao excluir EventosTurmas: " + erro.message });
                }
                finally {
                    if (conexao)
                        conexao.release();
                }
            }
            else {
                res.status(400).json({ status: false, mensagem: "Evento inválido!" });
            }
        }
        else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método DELETE." });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method == 'GET') {
            const termo = parseInt(requisicao.params.id) ;
           
            let conexao;
            try {
                const eventoTurmas = new EventoTurmas();
                conexao = await conectar();
                const resultado = await eventoTurmas.consultar(termo, 1, conexao);
                if (Array.isArray(resultado) && resultado.length > 0) {
                    resposta.status(200).json(resultado);
                }
                else {
                    resposta.status(404).json({ status: false, mensagem: "Nenhum EventoTurmas encontrado." });
                }
            }
            catch (erro) {
                resposta.status(500).json({ status: false, mensagem: "Erro interno ao consultar eventoTurmas: " + erro.message });
            }
            finally {
                if (conexao)
                    conexao.release();
            }
        }
        else {
            resposta.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }
    }


    async consultarTurma(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method == 'GET') {
            const termo = requisicao.params.id;
            let conexao;
            try {
                
                const eventoTurmas = new EventoTurmas();
                conexao = await conectar();
                const resultado = await eventoTurmas.consultar(termo, 2, conexao);
                if (Array.isArray(resultado) && resultado.length > 0) {
                    resposta.status(200).json(resultado);
                }
                else {
                    resposta.status(404).json({ status: false, mensagem: "Nenhum eventoTurmas encontrado." });
                }
            }
            catch (erro) {
                resposta.status(500).json({ status: false, mensagem: "Erro interno ao consultar eventoTurmas: " + erro.message });
            }
            finally {
                if (conexao)
                    conexao.release();
            }
        }
        else {
            resposta.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }
    }

}