import Evento from "../Modelo/evento.js";

export default class EventoDAO {
    constructor() {
        //this.init();
    }

    /*async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS responsavel(
                resp_cpf VARCHAR(14) NOT NULL,
                resp_nome VARCHAR(50) NOT NULL,
                resp_telefone VARCHAR(1) NOT NULL,
                CONSTRAINT pk_responsavel PRIMARY KEY(resp_cpf)
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
            const sql = `INSERT INTO evento(eve_nome, eve_data,eve_periodo, eve_horaInicio, eve_horaFim)
                VALUES (?, str_to_date(?, '%Y-%m-%d'),?,?,?)
            `;
            let parametros = [
                evento.nome,
                evento.data,
                evento.periodo,
                evento.horaInicio,
                evento.horaFim
            ];
            const resultado = await conexao.execute(sql, parametros);
            evento.id = resultado[0].insertId;
        }
    }

    async alterar(evento, conexao) {
        if (evento instanceof Evento) {
            const sql = `UPDATE evento SET eve_nome=?, eve_data=?, eve_periodo=?, eve_dataInicio=?, eve_horaFim=?
                WHERE  eve_id = ?
            `;
            let parametros = [
                evento.nome,
                evento.data,
                evento.periodo,
                evento.horaInicio,
                evento.horaFim,
                evento.id
            ]; 
            await conexao.execute(sql, parametros);
        }
    }
    
    async consultar(termo, conexao) {
        let sql = "";
        let parametros = [];
        if (isNaN(parseInt(termo))) {
            sql = `SELECT * FROM evento e
                   WHERE eve_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
        else {
            sql = `SELECT * FROM evento e
                   WHERE eve_id = ?`
            parametros = [termo];
        }
        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaEvento = [];
        for (const linha of linhas) {
            const evento = new Evento(
                linha['eve_id'],
                linha['eve_nome'],
                linha['eve_data'],
                linha['eve_periodo'],
                linha['eve_horaInicio'],
                linha['eve_horaFim']
            );
            listaEvento.push(evento);
        }
        return listaEvento;
    }

    async excluir(evento, conexao) {
        if (evento instanceof Evento) {
            const sql = `DELETE FROM evento WHERE eve_id = ?`;
            let parametros = [
                evento.id
            ]; 
            await conexao.execute(sql, parametros);
        }
    }
}