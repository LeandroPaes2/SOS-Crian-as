
import Matricula from "../Modelo/matricula.js"
import Turma from "../Modelo/turma.js";
import Aluno from "../Modelo/aluno.js";
import conectar from "../Persistencia/Conexao.js";

export default class MatriculaCtrl {



    async gravar(req, res) {

        if (req.method == "POST" && req.is("application/json")) {
            res.type("application/json");
            const conexao = await conectar();
            const { aluno, turma, dataAtualMatricula } = req.body;
            const dadosValidos = aluno.id && turma.id && dataAtualMatricula;
            if (!dadosValidos) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Dados incompletos ou inválidos. Verifique a requisição."
                });
            } else {
                try {
                    let alunoValidoAUX = new Aluno();
                    let alunoValido = await alunoValidoAUX.consultar(aluno.id, 3, conexao);
                    let turmaValidaAUX = new Turma();
                    let turmaValida = await turmaValidaAUX.consultar(turma.id, conexao);
                    if (!alunoValido[0] || !turmaValida[0]) {
                        return res.status(400).json({
                            status: false,
                            mensagem: "Aluno ou turma inválido ou inexistente. Verifique a requisição."
                        });
                    }
                    if (alunoValido[0].status === 0) {
                        return res.status(400).json({
                            status: false,
                            mensagem: "Aluno inativo. Verifique a requisição."
                        });
                    }
                    const matricula = new Matricula(0, alunoValido[0], turmaValida[0], "", dataAtualMatricula, "", "", 1);
                    await conexao.query("BEGIN");
                    await matricula.incluir(conexao);
                    await conexao.query("COMMIT");
                    res.status(200).json({
                        status: true,
                        mensagem: "Matricula realizada com sucesso!"
                    });
                } catch (erro) {
                    await conexao.query("ROLLBACK");
                    res.status(500).json({
                        status: false,
                        mensagem: "Nao foi possivel realizar a matricula: " + erro.message
                    });
                } finally {
                    if (conexao)
                        conexao.release();
                }
            }
        }
        else {
            res.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Utilize POST com JSON válido."
            });
        }

    }

    async consultar(req, res) {
        res.type("application/json");
        if (req.method == "GET") {
            let id = req.params.id || "";
            const matricula = new Matricula();
            const conexao = await conectar();
            try {
                let resultado = await matricula.consultar(id, conexao);
                res.status(200).json(resultado);
            }
            catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Nao foi possivel consultar a matricula: " + erro.message
                });
            } finally {
                if (conexao)
                    conexao.release();
            }
        }
        else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }

    }

    async consultarMatALuno(req, res) {
        res.type("application/json");
        if (req.method == "GET") {




            let id = req.params.id || "";


            console.log(id);

            const matricula = new Matricula();
            const conexao = await conectar();
            try {
                let resultado = await matricula.consultarMatAluno(id, conexao);
                res.status(200).json(resultado);
            }
            catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Nao foi possivel consultar a matricula: " + erro.message
                });
            } finally {
                if (conexao)
                    conexao.release();
            }
        }
        else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }

    }



    async alterar(req, res) {
        if ((req.method === "PUT" || req.method === "PATCH") && req.is("application/json")) {
            const { turma,id } = req.body;
            const dadosValidos = turma && id;
            if (!dadosValidos) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Dados incompletos ou inválidos. Verifique a requisição."
                });
            }
            else {
                const conexao = await conectar();
                try {
                    
                    const matriculaAntiga = await new Matricula().consultar(id, conexao);

                    if (!matriculaAntiga[0] || matriculaAntiga[0].status === 0) {
                        return res.status(400).json({
                            status: false,
                            mensagem: "Matricula inexistente ou inativa. Verifique a requisição."
                        });
                    }
                    else {
                        matricula.aluno = matriculaAntiga[0].aluno;
                        matricula.dataInclusaoProjeto = matriculaAntiga[0].dataInclusaoProjeto;
                        matricula.dataVencimento = matriculaAntiga[0].dataVencimento;
                        matricula.dataAtualMatricula = matriculaAntiga[0].dataAtualMatricula;


                        await conexao.query("BEGIN");
                        await matricula.alterar(conexao);
                        await conexao.query("COMMIT");
                        res.status(200).json({
                            status: true,
                            mensagem: "Matricula alterada com sucesso!"
                        });
                    }
                } catch (erro) {
                    await conexao.query("ROLLBACK");
                    res.status(500).json({
                        status: false,
                        mensagem: "Nao foi possivel alterar a matricula: " + erro.message
                    });
                } finally {
                    if (conexao)
                        conexao.release();
                }
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! methodo errado ou json invalido" });
        }
    }

}