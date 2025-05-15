import Evento from "../Modelo/evento.js";

/*function dataISOparaBR(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // mês começa do zero
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}*/


export default class EventoDAO {

    static async verificarConflito(evento, conexao) {
        const sql = `
            SELECT * FROM evento 
            WHERE eve_data = ? 
            AND NOT (? >= eve_horaFim OR ? <= eve_horaInicio)
        `;

        //eve_data = ?: Filtra os eventos para trazer apenas os que acontecem no mesmo dia (eve_data). Esse ? será substituído pela data do evento que está tentando inserir.
        //eve_periodo = ?: Filtra os eventos para trazer apenas os que acontecem no mesmo periodo(eve_data). Esse ? será substituído pela data do evento que está tentando inserir.
    
        const parametros = [
            evento.data,
            evento.horaInicio,
            evento.horaFim
        ];
    
        const [linhas] = await conexao.execute(sql, parametros);
        return linhas.length > 0; // Se tiver algum resultado, há conflito
    }
    /*constructor() {
        //this.init();
    }*/

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
            try{
            const sql = `INSERT INTO evento(eve_nome, eve_data,eve_periodo, eve_horaInicio, eve_horaFim)
                VALUES (?,?,?,?,?)
            `;

            /*const [dia, mes, ano] = evento.data.split('/');
            const dataISO = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;*/

            let parametros = [
                evento.nome,
                evento.data,
                evento.periodo,
                evento.horaInicio,
                evento.horaFim
            ];
            const resultado = await conexao.execute(sql, parametros);
            evento.id = resultado[0].insertId;
            }catch(e){
                throw new Error("Erro ao incluir evento: " + e.message);
            }
        }
    }

    async alterar(evento, conexao) {
        if (evento instanceof Evento) {
            try{
            const sql = `UPDATE evento SET eve_nome=?, eve_data=?, eve_periodo=?, eve_horaInicio=?, eve_horaFim=?
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
            }catch(e){
                throw new Error("Erro ao alterar evento: " + e.message);
            }
        }
    }
    
    
    async consultar(termo, conexao) {
        try{
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
        }catch(e){
            throw new Error("Erro ao consultar eventos: " + e.message);
        }
    }

    async excluir(evento, conexao) {
        if (evento instanceof Evento) {
            try{
            const sql = `DELETE FROM evento WHERE eve_id = ?`;
            let parametros = [
                evento.id
            ]; 
            await conexao.execute(sql, parametros);
            }catch(e){
                throw new Error("Erro ao excluir evento: " + e.message);
            }
        }
    }
}