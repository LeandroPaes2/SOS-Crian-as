//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Evento from "../Modelo/evento.js";
import conectar from "../Persistencia/Conexao.js";
import EventoDAO from "../Persistencia/eventoDAO.js";

async function verificarConflito(evento, conexao) {
        const sql = `
            SELECT * FROM evento 
            WHERE eve_dataInicio = $1 
            AND NOT ($2 >= eve_horaFim OR $3 <= eve_horaInicio)
        `;
        const parametros = [
            evento.dataInicio, // ou eve_data
            evento.horaInicio,
            evento.horaFim
        ];

        const resultado = await conexao.query(sql, parametros);
        return resultado.rows.length > 0;
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
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível incluir o evento: " + erro.message
                        });
                    }
                }catch(erro){
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível incluir o evento: " + erro.message
                    });
                }finally {
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
                    const conflito = await this.verificarConflito(evento, conexao);
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