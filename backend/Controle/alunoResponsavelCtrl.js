import AlunoResponsavel from "../Modelo/alunoResponsavel.js";
import Responsavel from "../Modelo/responsavel.js";
import conectar from "../Persistencia/Conexao.js";


export default class AlunoResponsavelCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const { aluno, responsavel } = req.body;
            const dadosValidos = aluno && aluno.id && responsavel && responsavel.cpf;
            if (dadosValidos) {
                let conexao;
                try {
                    conexao = await conectar();
                    let alunoResponsavel = new AlunoResponsavel();
                    const aluno = new Aluno();
                    let objAluno = await new aluno.consultar(aluno.id, conexao);
                    const responsavel = new Responsavel();
                    let objResponsavel = await responsavel.consultar(responsavel.cpf, conexao);

                    const alunoRespCompleto = new AlunoResponsavel(
                        objAluno,
                        objResponsavel);

                    await conexao.query("BEGIN");
                    try {
                        await alunoRespCompleto.incluir(conexao);
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
                    res.status(500).json({ status: false, mensagem: "Erro interno ao cadastrar alunoResponsavel: " + erro.message });
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
            const aluno = parseInt(requisicao.params.aluno);
            if (!isNaN(id)) {
                const alunoResponsavel = new AlunoResponsavel(aluno);
                let conexao;
                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                    const resultado = await alunoResponsavel.excluir(conexao);
                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "AlunoResponsavel desligado com sucesso!" });
                    }
                    else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao excluir alunoResponsavel. Verifique se o aluno existe." });
                    }
                }
                catch (erro) {
                    if (conexao)
                        await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro interno ao excluir alunoResponsavel: " + erro.message });
                }
                finally {
                    if (conexao)
                        conexao.release();
                }
            }
            else {
                res.status(400).json({ status: false, mensagem: "Aluno inválido!" });
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
            console.log("Termo:", termo);
            let conexao;
            try {
                const alunoResponsavel = new AlunoResponsavel();
                conexao = await conectar();
                const resultado = await alunoResponsavel.consultar(termo, 1,conexao);
                if (Array.isArray(resultado) && resultado.length > 0) {
                    resposta.status(200).json(resultado);
                }
                else {
                    resposta.status(404).json({ status: false, mensagem: "Nenhum alunoResponsavel encontrado." });
                }
            }
            catch (erro) {
                resposta.status(500).json({ status: false, mensagem: "Erro interno ao consultar alunoResponsavel: " + erro.message });
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


    async consultarCPF(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method == 'GET') {
            const termo = requisicao.params.cpf;
            let conexao;
            try {
                console.log("Termo:", termo);
                const alunoResponsavel = new AlunoResponsavel();
                conexao = await conectar();
                const resultado = await alunoResponsavel.consultar(termo, 2, conexao);
                if (Array.isArray(resultado) && resultado.length > 0) {
                    resposta.status(200).json(resultado);
                }
                else {
                    resposta.status(404).json({ status: false, mensagem: "Nenhum alunoResponsavel encontrado." });
                }
            }
            catch (erro) {
                resposta.status(500).json({ status: false, mensagem: "Erro interno ao consultar alunoResponsavel: " + erro.message });
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