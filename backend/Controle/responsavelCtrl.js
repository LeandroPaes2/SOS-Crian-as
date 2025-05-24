//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Responsavel from "../Modelo/responsavel.js";
import conectar from "../Persistencia/Conexao.js";

export default class ResponsavelCtrl {

    async gravar(requisicao, resposta){
        const conexao = await conectar();
        resposta.type("application/json");
        
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const cpf  = requisicao.body.cpf;
            const nome = requisicao.body.nome;
            const telefone = requisicao.body.telefone;
            //pseudo validação
            if (cpf && nome && telefone)
            {
                const responsavel = new Responsavel(cpf, nome, telefone);
                try{
                await conexao.query("BEGIN");
                //const resultado = await responsavel.incluir(conexao);
                if(responsavel.incluir(conexao)){
                    await conexao.query("COMMIT");
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Responsavel adicionado com sucesso!",
                        "cpf": responsavel.cpf
                    });
                }
                else{
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível incluir o responsavel: " + erro.message
                    });
                }
                }catch(erro){
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível incluir o responsavel: " + erro.message
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
        const conexao = await conectar();
    
        resposta.type("application/json");
        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")){
       
            const cpf  = requisicao.params.cpf;
            const nome = requisicao.body.nome;
            const telefone = requisicao.body.telefone;
        
            if (cpf && nome && telefone)
            {
                const responsavel = new Responsavel(cpf, nome, telefone);
                
                try{
                    await conexao.query("BEGIN");
                    //const resultado = await responsavel.alterar(conexao);
                    if(responsavel.alterar(conexao)){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Responsavel alterado com sucesso!",
                        });
                    }
                    else{
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível alterar o responsavel: " + erro.message
                        });
                    }
                }
                catch(erro){
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível alterar o responsavel: " + erro.message
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
        
        const conexao = await conectar();
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const cpf = requisicao.params.cpf;
            //pseudo validação
            if (cpf) {
                
                const responsavel = new Responsavel(cpf);
                try{
                   
                    await conexao.query("BEGIN");
                    //const resultado = await responsavel.excluir(conexao);
                
                
                    if(responsavel.excluir(conexao)){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Responsável excluído com sucesso!",
                        });
                    }
                    else{
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir o responsavel: " + erro.message
                        });
                    }
                }catch(erro) {
                    await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o responsavel: " + erro.message
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
        const conexao = await conectar();
        resposta.type("application/json");
        if (requisicao.method == "GET") {
            let cpf = requisicao.params.cpf;

            //evitar que código tenha valor undefined
            if (!cpf) {
                cpf = "";
            }

            const responsavel = new Responsavel();
            
            try{
                
                await conexao.query("BEGIN");
                const listaResponsavel = await responsavel.consultar(cpf, conexao);
                
                if(Array.isArray(listaResponsavel)){
                    await conexao.query('COMMIT');
                    resposta.status(200).json(listaResponsavel);
                }
                else{
                    await conexao.query('ROLLBACK');
                    resposta.status(404).json(
                        {
                            "status": false,
                            "mensagem": "Nenhum responsavel encontrado."
                        }
                    );
                }
                    
            }catch(erro) {
                await conexao.query('ROLLBACK');
                    resposta.status(500).json(
                        {
                            "status": false,
                            "mensagem": "Erro ao consultar responsaveis: " + erro.message
                        }
                    );
            }finally{

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