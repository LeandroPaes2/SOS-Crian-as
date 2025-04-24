import Horario from "../Modelo/horario.js";
import Turma from "../Modelo/turma.js";
import Materia from "../Modelo/materia.js"
import conectar from "../Persistencia/Conexao.js";

export default class HorarioCtrl{

    async gravar(requisicao, resposta){
        requisicao.type("application/json");

        const conexao = await conectar(); 

        if (requisicao.method === "POST" && requisicao.is("application/json")){
            const turma = requisicao.body.turma;
            const materia = requisicao.body.materia;

            if(turma && materia && turma.cor && materia.nome){
                try{
                    const objTurma = new Turma(
                        turma.id,
                        turma.cor,
                        turma.periodo
                    );

                    const objMateria = new Materia(
                        materia.id,
                        materia.nome,
                        materia.descricao
                    );

                    const horario = new Horario(
                        objTurma,
                        objMateria
                    )

                    conexao = await conectar();
                    await conexao.query("BEGIN");
    
                    const resultado = await horario.incluir(conexao);
    
                    if (resultado) {
                        await conexao.query("COMMIT");
                        resposta.status(200).json({ status: true, mensagem: "Horario cadastrado com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({ status: false, mensagem: "Erro ao cadastrar horario." });
                    }
    
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    resposta.status(500).json({ status: false, mensagem: "Não foi possível incluir a horario: " + erro.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                resposta.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos. Verifique a requisição." });
            }
        } else {
            resposta.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }

    }

}