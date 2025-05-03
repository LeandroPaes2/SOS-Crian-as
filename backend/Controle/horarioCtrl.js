import Horario from "../Modelo/horario.js";
import Turma from "../Modelo/turma.js";
import Materia from "../Modelo/materia.js"
import conectar from "../Persistencia/Conexao.js";

export default class HorarioCtrl {

    async gravar(requisicao, resposta) {
        resposta.type("application/json");

        let conexao = await conectar();

        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const turma = requisicao.body.turma;
            const materia = requisicao.body.materia;
            const hora = requisicao.body.hora;
            const semana = requisicao.body.semana;

            if (turma && materia && turma.cor && materia.nome && hora && semana) {
                try {
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
                        0,
                        objTurma,
                        objMateria,
                        hora,
                        semana
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    // Verifica duplicidade
                    const [linhas] = await conexao.query(
                        `SELECT COUNT(*) AS total 
                         FROM horario 
                         WHERE hora_hora = ? AND hora_semana = ?`,
                        [hora, semana]
                    );
                    
                    

                    if (linhas[0].total > 0) {
                        await conexao.query("ROLLBACK");
                        resposta.status(400).json({ status: false, mensagem: "Já existe um horário cadastrado para este dia e hora." });
                        return;
                    }

                    const resultado = await horario.incluir(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        resposta.status(200).json({ status: true, mensagem: "Horario cadastrado com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({ status: false, mensagem: "Erro ao cadastrar horario." });
                    }

                } catch (erro) {
                    console.error(erro);
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


    async alterar(requisicao, resposta) {
        resposta.type("application/json");
        const conexao = await conectar();

        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            const id = requisicao.params.id;
            const turma = requisicao.body.turma;
            const materia = requisicao.body.materia;
            const hora = requisicao.body.hora;
            const semana = requisicao.body.semana;

            if (id && turma && materia && turma.cor && materia.nome && hora && semana) {
                try {
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
                        id,
                        objTurma,
                        objMateria,
                        hora,
                        semana

                    );

                    await conexao.query("BEGIN");

                    const resultado = await horario.alterar(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        resposta.status(200).json({ status: true, mensagem: "Horario alterado com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({ status: false, mensagem: "Erro ao alterar horario." });
                    }

                } catch (erro) {

                    if (conexao) await conexao.query("ROLLBACK");
                    resposta.status(500).json({ status: false, mensagem: "Não foi possível alterar a horario: " + erro.message });
                } finally {
                    if (conexao) {
                        conexao.release();
                    }
                }
            }
            else {
                resposta.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos. Verifique a requisição." });
            }
        }
        else {
            resposta.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");
        const conexao = await conectar();
    
        if (requisicao.method == 'DELETE') {
            const id = requisicao.params.id;
    
            if (id) {
                try {
                    const horario = new Horario(id);
                    await conexao.query("BEGIN");
    
                    const resultado = await horario.excluir(conexao);
    
                    if (resultado.affectedRows > 0) {
                        await conexao.query("COMMIT");
                        resposta.status(200).json({ status: true, mensagem: "Horário excluído com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({ status: false, mensagem: "Erro ao excluir horário." });
                    }
    
                } catch (erro) {
                    console.error("Erro ao excluir horário:", erro);
                    if (conexao) await conexao.query("ROLLBACK");
                    resposta.status(500).json({ status: false, mensagem: "Não foi possível excluir o horário: " + erro.message });
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
    

    async consultar(requisicao, resposta) {
        resposta.type("application/json");
        const conexao = await conectar();

        if (requisicao.method == "GET") {
            let id = requisicao.params.id;

            const horario = new Horario();

            try {
                await conexao.query("BEGIN");
                const listahorario = await horario.consultar(id, conexao);
                if (Array.isArray(listahorario)) {
                    await conexao.query("COMMIT");
                    resposta.status(200).json(listahorario);
                } else {
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({ status: false, mensagem: "Formato inesperado na resposta" });
                }

            } catch (erro) {
                if (conexao) await conexao.query("ROLLBACK");
                resposta.status(500).json({ status: false, mensagem: "Erro ao consultar horario: " + erro.message });
            } finally {
                if (conexao) {
                    conexao.release();
                }
            }
        }
        else {
            resposta.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }
}