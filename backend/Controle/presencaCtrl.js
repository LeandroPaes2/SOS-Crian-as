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
                                mensagem:"Presença adicionada com sucesso!",
                        });
                    }
                    else
                    {
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status":false,
                            mensagem:"Não foi possível adicionar a presença: "
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
                        mensagem:"Informe corretamente todos os dados de uma presença conforme documentação da API."
                    }
                );
            }
        }
    }
    async consultar(requisicao, resposta) {
        const conexao = await conectar();
        resposta.type("application/json");
        if (requisicao.method === "GET") {
            const presenca = new Presenca();
            try {
                await conexao.query('BEGIN');
                const listaPresencas = await presenca.consultar(conexao);

                if (Array.isArray(listaPresencas)) {
                    await conexao.query('COMMIT');
                    resposta.status(200).json(listaPresencas);
                } else {
                    await conexao.query('ROLLBACK');
                    resposta.status(500).json({ status: false, mensagem: "Formato inesperado na resposta" });
                }
            } 
            catch (e) {
                await conexao.query('ROLLBACK');
                throw e
            }
            finally {
                conexao.release();
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async excluir(requisicao, resposta) {
        const conexao = await conectar();
        resposta.type("application/json");
        if (requisicao.method === "DELETE") {
            const id = parseInt(requisicao.params.id);
            if(id)
            {
                const presenca = new Presenca(id);
                try {
                    await conexao.query("BEGIN");
                        if (presenca.excluir(conexao)){
                            await conexao.query("COMMIT");
                            resposta.status(200).json({
                                status: true,
                                mensagem: "Presença excluída com sucesso!"
                            });
                        }
                        else {
                            await conexao.query("ROLLBACK");
                            resposta.status(500).json({
                                status: false,
                                mensagem: "Não foi possível excluir a materia: " + erro.message
                            });
                        }
                } catch (erro) {
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir presença: " + erro.message
                    });
                } finally {
                    if (conexao) conexao.release();
                }
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }
}