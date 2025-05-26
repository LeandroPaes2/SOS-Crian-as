//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Evento from "../Modelo/evento.js";
import conectar from "../Persistencia/Conexao.js";
import EventoDAO from "../Persistencia/eventoDAO.js";

async function verificarConflito(evento, conexao) {
        function horaParaMinutos(horaStr) {
        const [h, m] = horaStr.split(':').map(Number);
        return h * 60 + m;
        }

    const inicioMin = horaParaMinutos(evento.horaInicio);
    const fimMin = horaParaMinutos(evento.horaFim);

    // 1. Verifica se horário de início é menor que fim
    if (fimMin <= inicioMin) {
        throw new Error("Horário de fim deve ser maior que horário de início.");
    }

    // 2. Verifica se o evento não está tentando ser marcado entre 18:00 e 08:00
    // Permitimos somente das 08:00 até 18:00 (minutos 480 a 1080)
    if (inicioMin < 480 && fimMin > 480) {
        throw new Error("Evento não pode começar antes das 08:00.");
    }
    if (inicioMin < 1080 && fimMin > 1080) {
        throw new Error("Evento não pode terminar depois das 18:00.");
    }
    if (inicioMin < 480 || fimMin > 1080) {
        throw new Error("Evento deve estar entre 08:00 e 18:00.");
    }

    // 3. Verifica se não está cadastrando entre 12:00 e 13:30 (720 a 810 minutos)
    const almocoInicio = 720;
    const almocoFim = 810;

    if (!(fimMin <= almocoInicio || inicioMin >= almocoFim)) {
        throw new Error("Evento não pode ocorrer durante o horário de almoço (12:00-13:30).");
    }

    if (evento.periodo === "manhã" && inicioMin > 810) {
        throw new Error("No período da manhã, o horário de início não pode ser depois das 13:30.");
    }
    if (evento.periodo === "tarde" && inicioMin < 810) {
        throw new Error("No período da tarde, o horário de início não pode ser antes das 13:30.");
    }

    // 4. Verifica se dataFim não vem antes da dataInicio
    const dataInicio = new Date(evento.dataInicio);
    const dataFim = new Date(evento.dataFim);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataFim < dataInicio) {
        throw new Error("Data de fim não pode ser anterior à data de início.");
    }

    if (dataInicio < hoje) {
        throw new Error("Não é possível cadastrar eventos com data de início no passado.");
    }

    // 5. Verifica se já existe conflito com outro evento no mesmo dia
    // Consulta eventos no mesmo dia (dataInicio)
    const sql = `
    SELECT * FROM evento
    WHERE
        NOT (eve_dataFim < $1 OR eve_dataInicio > $2)
        AND NOT ($4 >= eve_horaFim OR $5 <= eve_horaInicio)
        AND ($3 = 0 OR eve_id <> $3)
    `;
    const parametros = [
        evento.dataInicio, // $1 - intervalo de datas começa
        evento.dataFim,    // $2 - intervalo de datas termina
        evento.id || 0,    // $3 - id do evento atual, 0 se novo (ignorar na consulta)
        evento.horaInicio, // $4 - hora inicio do evento
        evento.horaFim     // $5 - hora fim do evento
    ];

    const resultado = await conexao.query(sql, parametros);

        if(resultado.rows.length > 0)
            return true;

        return false; // sem conflito
}

export default class EventoCtrl {

    async gravar(requisicao, resposta){
        
        resposta.type("application/json");
      
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const nome  = requisicao.body.nome;
            const tipoEvento = requisicao.body.tipoEvento;
            const dataInicio = requisicao.body.dataInicio;
            const dataFim = requisicao.body.dataFim;
            const periodo = requisicao.body.periodo;
            const horaInicio = requisicao.body.horaInicio;
            const horaFim = requisicao.body.horaFim;
            
            if (nome && tipoEvento && dataInicio && dataFim && periodo && horaInicio && horaFim)
            {
                let conexao;
                try{
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                    const evento = new Evento(0, nome, tipoEvento, dataInicio, dataFim, periodo, horaInicio, horaFim);
                    const conflito = await verificarConflito(evento, conexao);
                    if (conflito) {
                        await conexao.query("ROLLBACK");
                        resposta.status(400).json({
                            status: false,
                            mensagem: "Conflito de horário! Já existe um evento nesse dia, período e horário.",
                        });
                        return;
                    }

                    const resultado = await evento.incluir(conexao);
                    if(resultado){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Evento adicionado com sucesso!",
                            "nome": evento.nome
                        });
                    }
                    else{
                        if(conexao)
                            await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível incluir o evento: " + erro.message
                        });
                    }
                }catch(erro){
                    if(conexao)
                        await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível incluir o evento: " + erro.message
                    });
                }finally {
                    if(conexao)
                        conexao.release();
                }
            }
            else
            {
                resposta.status(400).json(
                    {
                        "status":false,
                        "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                    }
                );
            }

        }
        else
        {
            resposta.status(400).json({
                "status":false,
                "mensagem":"Requisição inválida! Consulte a documentação da API."
            });

        }

    }

    async editar(requisicao, resposta){
        resposta.type("application/json");
        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")){
       
            const id  = requisicao.params.id;
            const nome = requisicao.body.nome;
            const tipoEvento = requisicao.body.tipoEvento;
            const dataInicio = requisicao.body.dataInicio;
            const dataFim = requisicao.body.dataFim;
            const periodo = requisicao.body.periodo;
            const horaInicio = requisicao.body.horaInicio;
            const horaFim = requisicao.body.horaFim;
        
            if (id > 0 && nome && tipoEvento && dataInicio && dataFim && periodo && horaInicio && horaFim)
            {
                let conexao;

                try{
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                    const evento = new Evento(id, nome, tipoEvento, dataInicio, dataFim, periodo, horaInicio, horaFim);
                    const conflito = await verificarConflito(evento, conexao);
                    if (conflito) {
                        await conexao.query("ROLLBACK");
                        resposta.status(400).json({
                            status: false,
                            mensagem: "Conflito de horário! Já existe um evento nesse dia, período e horário.",
                        });
                        return;
                    }

                    const resultado = evento.alterar(conexao);
                    if(resultado){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Evento alterado com sucesso!",
                        });
                    }
                    else{
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível alterar o evento: " + erro.message
                        });
                    }
                }
                catch(erro){
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível alterar o evento: " + erro.message
                    });
                }finally{
                    conexao.release();
                }
            }
            else
            {
                resposta.status(400).json(
                    {
                        "status":false,
                        "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                    }
                );
            }
        }
        else
        {
            resposta.status(400).json({
                "status":false,
                "mensagem":"Requisição inválida! Consulte a documentação da API."
            });

        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");
        
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const id = requisicao.params.id;
            //pseudo validação
            if (id > 0) {
                let conexao;
                const evento = new Evento(id);
                try{
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                
                    if(evento.excluir(conexao)){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Evento excluído com sucesso!",
                        });
                    }
                    else{
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir o evento: " + erro.message
                        });
                    }
                }catch(erro) {
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o evento: " + erro.message
                    });
                }finally{
                    conexao.release();
                }
            }
            else {
                resposta.status(400).json(
                    {
                        "status": false,
                        "mensagem": "Informe um cpf válido de um responsavel conforme documentação da API."
                    }
                );
            }

        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });

        }
    }

    async consultar(requisicao, resposta) {
  
        resposta.type("application/json");
        if (requisicao.method == "GET") {
            let id = requisicao.params.id;

            if (isNaN(id)) {
                id = "";
            }

            const evento = new Evento();
            let conexao;
            try{
                conexao = await conectar();
                await conexao.query("BEGIN");
                const listaEvento = await evento.consultar(id, conexao);
                
                if(Array.isArray(listaEvento)){
                    await conexao.query('COMMIT');
                    resposta.status(200).json(listaEvento);
                }
                else{
                    await conexao.query('ROLLBACK');
                    resposta.status(404).json(
                        {
                            "status": false,
                            "mensagem": "Nenhum evento encontrado."
                        }
                    );
                }
                    
            }catch(erro) {
                if (conexao) 
                    await conexao.query("ROLLBACK");
                resposta.status(500).json(
                        {
                            "status": false,
                            "mensagem": "Erro ao consultar evento: " + erro.message
                        }
                    );
            }finally{
                if(conexao)
                    conexao.release();
            }

        }
        else {
            resposta.status(400).json(
                {
                    "status": false,
                    "mensagem": "Requisição inválida! Consulte a documentação da API."
                }
            );
        }
    }

}