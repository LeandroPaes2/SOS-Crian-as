import Aluno from "../Modelo/aluno";
import Turma from "../Modelo/turma";
import conectar from "../Persistencia/Conexao";
import Matricula from "../Modelo/Matricula";
export default class MatriculaCtrl {

    constructor() { }

    async gravar(req, res) {
        if (req.method == "POST" && req.is("application/json")) {

            res.type("application/json");
            const conexao = await conectar();
            const { aluno, turma } = req.body;
            const dadosValidos = aluno.id && turma.id;
            if (!dadosValidos) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Dados incompletos ou inválidos. Verifique a requisição."
                });
            } else {
                try {


                    const alunoValido = await Aluno.consultar(aluno.id,3,conexao);
                    const turmaValida = await Turma.consultar(parseInt(turma.id), conexao);

                    if (!alunoValido[0] || !turmaValida[0]) {
                        return res.status(400).json({
                            status: false,
                            mensagem: "Aluno ou turma inválido ou inexistente. Verifique a requisição."
                        });
                    }
                    const matricula = new Matricula(alunoValido[0],turmaValida[0]);
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

}