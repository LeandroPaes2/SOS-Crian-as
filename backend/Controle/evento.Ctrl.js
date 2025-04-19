//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Evento from "../Modelo/evento.js";
import conectar from "../Persistencia/Conexao.js";

export default class EventoCtrl {

    async gravar(requisicao, resposta){
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const nome  = requisicao.body.nome;
            const data = requisicao.body.data;
            const periodo = requisicao.body.periodo;
            const horaInicio = requisicao.body.horaInicio;
            const horaFim = requisicao.body.horaFim;
            
            if (nome && data && periodo && horaInicio && horaFim)
            {
                let conexao;
                try{
                const evento = new Evento(0, nome, data, periodo, horaInicio, horaFim);
                conexao = await conectar();
                await conexao.query("BEGIN");
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
            const data = requisicao.body.data;
            const periodo = requisicao.body.periodo;
            const horaInicio = requisicao.body.horaInicio;
            const horaFim = requisicao.body.horaFim;
        
            if (id > 0 && nome && data && periodo && horaInicio && horaFim)
            {
                let conexao;
                try{
                    const evento = new Evento(id, nome, data, horaInicio, horaFim);
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                    const resultado = await evento.alterar(conexao);
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
                    if(conexao)
                        await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível alterar o evento: " + erro.message
                    });
                }finally{
                    if (conexao) conexao.release();
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
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const id = requisicao.params.id;
            //pseudo validação
            if (id > 0) {
                let conexao;
                try{
                    const evento = new Evento(id);
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                    const resultado = await evento.excluir(conexao);
                
                
                    if(resultado){
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
                    if(conexao)
                        await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o evento: " + erro.message
                    });
                }finally{
                    if (conexao) conexao.release();
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

            //evitar que código tenha valor undefined
            if (isNaN(id)) {
                id = "";
            }

            const evento = new Evento();
            let conexao;
            
            try{
                conexao = await conectar();
                await conexao.query("BEGIN");
                const listaEvento = evento.consultar(id, conexao);
                
                if(Array.isArray(listaEvento) && listaEvento.length > 0){
                    resposta.status(200).json(listaEvento);
                }
                else{
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
                if (conexao) 
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