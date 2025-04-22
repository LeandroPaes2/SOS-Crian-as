import Materia from "../Modelo/materia.js";
import Presenca from "../Modelo/presenca.js";
import Turma from "../Modelo/turma.js";
import conectar from "../Persistencia/Conexao.js";
import Aluno from "../Modelo/aluno.js"

export default class PresencaCtrl{
    async gravar(requisicao, resposta)
    {
        const conexao = await conectar();
        resposta.type("application/json");
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const { materiaId, turmaId, alunos } = req.body;
            if(materiaId && turmaId && alunos)
            {
                const presenca = new Presenca(0,new Date,new Materia(materiaId),new Turma(turmaId),alunos.map(a => ({ aluno: new Aluno(a.id), presente: a.presente })));
                try{
                    await conexao.query('BEGIN');
                        if(presenca.incluir(conexao)){
                            await conexao.query('COMMIT');
                            resposta.status(200).json({
                                "status":true,
                                "mensagem":"Presença adicionada com sucesso!",
                        });
                    }
                    else
                    {
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível adicionar a presença: "
                        });
                    }   
                }
                catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                }
                finally {
                    conexao.release();
                }
            }
            else
            {
                resposta.status(400).json(
                    {
                        "status":false,
                        "mensagem":"Informe nomeretamente todos os dados de uma presença conforme documentação da API."
                    }
                );
            }
        }
    }
    async consultar(req, res) {
        res.type("application/json");
        if (req.method === "GET") {
            try {
                const conexao = await conectar();
                const presenca = new Presenca();
                const listaPresencas = await presenca.consultar(conexao);

                if (listaPresencas.length > 0) {
                    res.status(200).json(listaPresencas);
                } else {
                    res.status(404).json({
                        status: false,
                        mensagem: "Nenhum registro de presença encontrado"
                    });
                }
            } catch (erro) {
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar presenças: " + erro.message
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido! Use GET"
            });
        }
    }

    async excluir(req, res) {
        res.type("application/json");
        if (req.method === "DELETE") {
            try {
                const id = parseInt(req.params.id);
                
                if (isNaN(id)) {
                    res.status(400).json({
                        status: false,
                        mensagem: "ID inválido!"
                    });
                    return;
                }

                const conexao = await conectar();
                await conexao.query("BEGIN");

                const presenca = new Presenca(id);
                const resultado = await presenca.excluir(conexao);

                if (resultado) {
                    await conexao.query("COMMIT");
                    res.status(200).json({
                        status: true,
                        mensagem: "Presença excluída com sucesso!"
                    });
                } else {
                    await conexao.query("ROLLBACK");
                    res.status(404).json({
                        status: false,
                        mensagem: "Presença não encontrada!"
                    });
                }
            } catch (erro) {
                await conexao.query("ROLLBACK");
                res.status(500).json({
                    status: false,
                    mensagem: "Erro ao excluir presença: " + erro.message
                });
            } finally {
                if (conexao) conexao.release();
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido! Use DELETE"
            });
        }
    }
}