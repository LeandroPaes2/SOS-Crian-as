import Evento from "../Modelo/evento.js";
import EventoTurmas from "../Modelo/eventoTurmas.js";
import EventoFuncionario from "../Modelo/eventoFuncionario.js";
import Turma from "../Modelo/turma.js";
import Funcionario from "../Modelo/funcionario.js";

export default class EventoDAO {

    /*async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS evento(
                eve_id SERIAL PRIMARY KEY,
                eve_nome VARCHAR (100) NOT NULL,
                eve_tipoEvento VARCHAR (40) NOT NULL,
                eve_dataInicio DATE NOT NULL,
                eve_dataFim DATE NOT NULL,
                eve_periodo VARCHAR (20) NOT NULL,
                eve_horaInicio TIME NOT NULL,
                eve_horaFim TIME NOT NULL
            );
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }*/

    async incluir(evento, conexao) {
        if (evento instanceof Evento) {
            try{
                const sql = `INSERT INTO evento(eve_nome, eve_tipoEvento, eve_dataInicio, eve_dataFim, eve_periodo, eve_horaInicio, eve_horaFim)
                    VALUES ($1,$2,$3,$4,$5, $6, $7)
                    RETURNING eve_id
                `;

                let parametros = [
                    evento.nome,
                    evento.tipoEvento,
                    evento.dataInicio,
                    evento.dataFim,
                    evento.periodo,
                    evento.horaInicio,
                    evento.horaFim
                ];
                const resultado = await conexao.query(sql, parametros);
                const eve_id = resultado.rows[0].eve_id;
                evento.id = eve_id;

                const listaEventoTurmas = evento.listaTurmas;
                if (Array.isArray(listaEventoTurmas)) {
                    for (let i = 0; i < listaEventoTurmas.length; i++) {
                        const objTurmaAux = new Turma(listaEventoTurmas[i]);
                        //console.log(listaEventoTurmas)
                        const eventoTurmas = new EventoTurmas(evento, objTurmaAux);
                     
                        await eventoTurmas.incluir(conexao);
                    }
                }
                const listaEventoFuncionario = evento.listaFuncionario;
                if (Array.isArray(listaEventoFuncionario)) {
                    for (let i = 0; i < listaEventoFuncionario.length; i++) {
                        const objFuncAux = new Turma(listaEventoFuncionario[i]);
                        //console.log(listaEventoTurmas)
                        const eventoFuncionario = new EventoFuncionario(evento, objFuncAux);
                     
                        await eventoFuncionario.incluir(conexao);
                    }
                }
                return true;
            }catch(e){
                throw new Error("Erro ao incluir evento: " + e.message);
            }
        }
    }

    async alterar(evento, conexao) {
        if (evento instanceof Evento) {
            try{
            const sql = `UPDATE evento SET eve_nome=$1, eve_tipoEvento=$2, eve_dataInicio=$3, eve_dataFim=$4, eve_periodo=$5, eve_horaInicio=$6, eve_horaFim=$7
                WHERE  eve_id = $8
            `;
            let parametros = [
                evento.nome,
                evento.tipoEvento,
                evento.dataInicio,
                evento.dataFim,
                evento.periodo,
                evento.horaInicio,
                evento.horaFim,
                evento.id
            ]; 
            await conexao.query(sql, parametros);

            let eventoTurmas = new EventoTurmas();
            let listaTurmaSql = await eventoTurmas.consultar(evento.id, 1, conexao);
            const listaEventoTurmas = evento.listaTurmas;

            let i;
            for (i = 0; i < listaTurmaSql.length; i++) {
                                let flag = false;
                                for (let j = 0; j < listaEventoTurmas.length; j++) {
                                    if (listaEventoTurmas[j] === listaTurmaSql[i].id) {
                                        listaEventoTurmas.splice(j, 1);
                                        j--;
                                        flag = true
                                    }
                                }
                                // console.log("fora do if " );
                                if (flag === false) {
                                    //console.log("Excluindo: " );
                                    let excluir = new EventoTurmas(undefined, listaTurmaSql[i]);  //exclui um responsavel
                                    await excluir.excluirPorTurma(conexao);
                                    listaTurmaSql.splice(i, 1);
                                    i--;
                                }
                            }
            if (Array.isArray(listaEventoTurmas)) {
                                for (let i = 0; i < listaEventoTurmas.length; i++) {
                                    const objTurmaAux = new Turma(listaEventoTurmas[i]);
                                    // console.log("respcpf: ", objRespAux.cpf);
                                    const eventoTurmas = new EventoTurmas(evento, objTurmaAux);
                                    await eventoTurmas.incluir(conexao);
                                }
                            }
            
            let eventoFuncionario = new EventoFuncionario();
            let listaFuncSql = await eventoFuncionario.consultar(evento.id, 1, conexao);
            const listaEventoFuncionario = evento.listaFuncionario;

            for (i = 0; i < listaFuncSql.length; i++) {
                                let flag = false;
                                for (let j = 0; j < listaEventoFuncionario.length; j++) {
                                    if (listaEventoFuncionario[j] === listaFuncSql[i].id) {
                                        listaEventoFuncionario.splice(j, 1);
                                        j--;
                                        flag = true
                                    }
                                }
                                // console.log("fora do if " );
                                if (flag === false) {
                                    //console.log("Excluindo: " );
                                    let excluir = new EventoFuncionario(undefined, listaFuncSql[i]);  //exclui um responsavel
                                    await excluir.excluirPorCPF(conexao);
                                    listaFuncSql.splice(i, 1);
                                    i--;
                                }
                            }

           
            if (Array.isArray(listaEventoFuncionario)) {
                                for (let i = 0; i < listaEventoFuncionario.length; i++) {
                                    
                                    const objFuncAux = new Funcionario("",listaEventoFuncionario[i]);
                                    console.log("respcpf: ", objFuncAux.cpf);
                                    const eventoFuncionario = new EventoFuncionario(evento, objFuncAux);
                                    await eventoFuncionario.incluir(conexao);
                                }
                            }
            return true;
            
            }catch(e){
                console.log("Erro ao alterar evento: " + e);
                throw e;
            }
        }
    }
    
    
    async consultar(termo, conexao) {
        try{
        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM evento`;
        } else if (isNaN(parseInt(termo))) {
            sql = `SELECT * FROM evento e WHERE eve_nome LIKE $1`;
            parametros = ['%' + termo + '%'];
        } else {
            sql = `SELECT * FROM evento e WHERE eve_id = $1`;
            parametros = [termo];
        }

        const resultado = await conexao.query(sql, parametros);
        const linhas = resultado.rows;        
        let listaEvento = [];

        for (const linha of linhas) {
            const evento = new Evento(
                linha['eve_id'],
                linha['eve_nome'],
                linha['eve_tipoevento'],
                linha['eve_datainicio'],
                linha['eve_datafim'],
                linha['eve_periodo'],
                linha['eve_horainicio'],
                linha['eve_horafim']
            );

            listaEvento.push(evento);
        }
        return listaEvento;
        }catch(e){
            throw new Error("Erro ao consultar eventos: " + e.message);
        }
    }

    async excluir(evento, conexao) {
        if (evento instanceof Evento) {
            try{
                const eventoTurmas = new EventoTurmas(evento, {});
                await eventoTurmas.excluir(conexao);

                const eventoFuncionario = new EventoFuncionario(evento, {});
                await eventoFuncionario.excluir(conexao);

                const sql = `DELETE FROM evento WHERE eve_id = $1`;
                let parametros = [evento.id];
                return await conexao.query(sql, parametros);
            } catch (e) {
                
                throw new Error("Erro ao excluir evento: " + e.message);
            }
        }
    }
}