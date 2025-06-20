import Funcionario from "../Modelo/funcionario.js";
import Evento from "../Modelo/evento.js";
import EventoFuncionario from "../Modelo/eventoFuncionario.js";
import conectar from "../Persistencia/Conexao.js";

export default class EventoFuncionarioCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const { evento, funcionario } = req.body;
            const dadosValidos = evento && evento.id && funcionario && funcionario.cpf;
            if (dadosValidos) {
                let conexao;
                try {
                    conexao = await conectar();
                    let eventoFuncionario = new EventoFuncionario();
                    const evento = new Evento();
                    let objEvento = await new evento.consultar(evento.id, conexao);
                    const funcionario = new Funcionario();
                    let objFuncionario = await funcionario.consultar(funcionario.cpf, conexao);

                    const eveFuncionarioCompleto = new EventoFuncionario(
                        objEvento,
                        objFuncionario);

                    await conexao.query("BEGIN");
                    try {
                        await eveFuncionarioCompleto.incluir(conexao);
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
                const eventoFuncionario = new EventoFuncionario(evento);
                let conexao;
                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                    const resultado = await eventoFuncionario.excluir(conexao);
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
            let termo = requisicao.params.id ;
            if(isNaN(termo))
                termo = "";

            let conexao;
            try {
                const eventoFuncionario = new EventoFuncionario();
                conexao = await conectar();
                const resultado = await eventoFuncionario.consultar(termo, 1, conexao);
                if (Array.isArray(resultado)) {
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
                
                const eventoFuncionario = new EventoFuncionario();
                conexao = await conectar();
                const resultado = await eventoFuncionario.consultar(termo, 2, conexao);
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