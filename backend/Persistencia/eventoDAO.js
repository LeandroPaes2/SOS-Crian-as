import Evento from "../Modelo/evento.js";

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
                this.id = resultado.rows[0].id;
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
            }catch(e){
                throw new Error("Erro ao alterar evento: " + e.message);
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
                linha['eve_tipoEvento'],
                linha['eve_dataInicio'],
                linha['eve_dataFim'],
                linha['eve_periodo'],
                linha['eve_horaInicio'],
                linha['eve_horaFim']
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
            const sql = `DELETE FROM evento WHERE eve_id = $1`;
            let parametros = [
                evento.id
            ]; 
            await conexao.query(sql, parametros);
            }catch(e){
                throw new Error("Erro ao excluir evento: " + e.message);
            }
        }
    }
}