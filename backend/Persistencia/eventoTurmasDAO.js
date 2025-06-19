

export default class EventoTurmasDAO{
    /*
    CREATE TABLE IF NOT EXISTS eventoTurmas(
        eve_id INT NOT NULL,
        turm_id INT NOT NULL,
        CONSTRAINT fk_evento FOREIGN KEY (eve_id) 
            REFERENCES evento(eve_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,
        CONSTRAINT fk_turma FOREIGN KEY (turm_id) 
            REFERENCES turma(turm_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,
        CONSTRAINT pk_eventoTurmas PRIMARY KEY (eve_id, turm_id)
    )
    */

    async incluir(eventoTurmas, conexao) {
            if (eventoTurmas instanceof EventoTurmas) {
                const sql = `
                INSERT INTO eventoTurmas
                (eve_id, turm_id)
                VALUES ($1, $2);
            `;
    
                const parametros = [
                    eventoTurmas.evento.id,
                    eventoTurmas.turma.id
                ];
    
    
    
                try {
                    await conexao.query(sql, parametros);
                    return true;
                } catch (e) {
                    console.log("Erro ao inserir EventoTurmas: ", e);
                    throw e;
                }
            } else {
                throw new Error("Objeto passado não é uma instância de EventoTurmas.");
            }
        }
    
        async excluir(eventoTurmas, conexao) {
            if (eventoTurmas instanceof EventoTurmas) {
                const sql = `DELETE FROM eventoTurmas WHERE eve_id = $1`;
                const parametros = [eventoTurmas.evento.id];
                await conexao.query(sql, parametros);
            }
        }
    
        async excluirPorTurma(eventoTurmas, conexao) {
            if (eventoTurmas instanceof EventoTurmas) {
                const sql = `DELETE FROM eventoTurmas WHERE turm_id = $1`;
                const parametros = [eventoTurmas.turma.id];
                await conexao.query(sql, parametros);
            }
        }
    
        async consultar(termo, tipo, conexao) {
            if (termo) {
                let sql;
                let parametros;
    
                if (tipo === 2) {
    
                    sql = `SELECT alu_id FROM alunoresponsavel WHERE resp_cpf = $1`;
                    
                    parametros = [termo];
    
                    //console.log("TERMO: ", termo);
                    
                    const resposta = await conexao.query(sql, parametros);
                    const listaId = resposta.rows;
                    
                    
                    //console.log( listaId);
    
    
                    let respostaFinal = [];
                    let i;
                    for (i = 0; i < listaId.length; i++) {
                        const aluno = new Aluno(listaId[i].alu_id);
                        const listaAlunos = await aluno.consultar(listaId[i].alu_id, 3, conexao);
                        respostaFinal.push(listaAlunos[0]);
                    }
                    return respostaFinal;
                }
                else {
                    if (tipo === 1) {
                        sql = `SELECT resp_cpf FROM alunoresponsavel WHERE alu_id = $1`;
    
    
                        parametros = [termo];                    
                        const resposta = await conexao.query(sql, parametros);
                        const listaCPF = resposta.rows;
    
                        let respostaFinal = [];
                        let i;
                        for (i = 0; i < listaCPF.length; i++) {
                            const responsavel = new Responsavel(listaCPF[i].resp_cpf);
                            const listaResponsaveis = await responsavel.consultar(listaCPF[i].resp_cpf, conexao);
                            respostaFinal.push(listaResponsaveis[0]);
                        }
                        return respostaFinal;
                    }
                }
                return false;
            }
            return false;
        }
}