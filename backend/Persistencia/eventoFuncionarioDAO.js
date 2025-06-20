import Funcionario from "../Modelo/funcionario.js";
import Evento from "../Modelo/evento.js";
import EventoFuncionario from "../Modelo/eventoFuncionario.js";

export default class EventoFuncionarioDAO{
    /*
    CREATE TABLE IF NOT EXISTS eventoFuncionario(
        eve_id INT NOT NULL,
        func_cpf VARCHAR(14) NOT NULL,
        CONSTRAINT fk_evento FOREIGN KEY (eve_id) 
            REFERENCES evento(eve_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,
        CONSTRAINT fk_funcionario FOREIGN KEY (func_cpf) 
            REFERENCES funcionario(func_cpf)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,
        CONSTRAINT pk_eventoFuncionario PRIMARY KEY (eve_id, func_cpf)
    )
    */

    async incluir(eventoFuncionario, conexao) {
      
            if (eventoFuncionario instanceof EventoFuncionario) {
                const sql = `
                INSERT INTO eventoFuncionario
                (eve_id, func_cpf)
                VALUES ($1, $2);
            `;
    
                const parametros = [
                    eventoFuncionario.evento.id,
                    eventoFuncionario.funcionario.cpf
                ];
    
    
    
                try {
                    await conexao.query(sql, parametros);
                    return true;
                } catch (e) {
                    console.log("Erro ao inserir EventoFuncionario: ", e);
                    throw e;
                }
            } else {
                throw new Error("Objeto passado não é uma instância de EventoTurmas.");
            }
        }
    
        async excluir(eventoFuncionario, conexao) {
            if (eventoFuncionario instanceof EventoFuncionario) {
                const sql = `DELETE FROM eventoFuncionario WHERE eve_id = $1`;
                const parametros = [eventoFuncionario.evento.id];
                await conexao.query(sql, parametros);
            }
        }
    
        async excluirPorFuncionario(eventoFuncionario, conexao) {
            if (eventoFuncionario instanceof EventoFuncionario) {
                const sql = `DELETE FROM eventoFuncionario WHERE func_cpf = $1`;
                const parametros = [eventoFuncionario.funcionario.cpf];
                await conexao.query(sql, parametros);
            }
        }
    
        async consultar(termo, tipo, conexao) {
            if (termo) {
                let sql;
                let parametros;
    
                if (tipo === 2) {
    
                    sql = `SELECT eve_id FROM eventoFuncionario WHERE func_cpf = $1`;
                    
                    parametros = [termo];
    
                    //console.log("TERMO: ", termo);
                    
                    const resposta = await conexao.query(sql, parametros);
                    const listaId = resposta.rows;
                    
                    
                    //console.log( listaId);
    
    
                    let respostaFinal = [];
                    let i;
                    for (i = 0; i < listaId.length; i++) {
                        const evento = new Evento(listaId[i].eve_id);
                        const listaEventos = await evento.consultar(listaId[i].eve_id, 3, conexao);
                        respostaFinal.push(listaEventos[0]);
                    }
                    return respostaFinal;
                }
                else {
                    if (tipo === 1) {
                        sql = `SELECT func_cpf FROM eventoFuncionario WHERE eve_id = $1`;
    
    
                        parametros = [termo];                    
                        const resposta = await conexao.query(sql, parametros);
                        const listaCpf = resposta.rows;
    
                        let respostaFinal = [];
                        let i;
                        for (i = 0; i < listaCpf.length; i++) {
                            const funcionario = new Funcionario(listaCpf[i].func_cpf);
                            const listaFuncionario = await funcionario.consultar(listaCpf[i].func_cpf, conexao);
                            respostaFinal.push(listaFuncionario[0]);
                        }
                        return respostaFinal;
                    }
                }
                return false;
            }
            return false;
        }
}