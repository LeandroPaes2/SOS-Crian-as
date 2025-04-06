//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Responsavel from "../Modelo/responsavel.js";

export default class ResponsavelCtrl {

    gravar(requisicao, resposta){
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const cpf  = requisicao.body.cpf;
            const nome = requisicao.body.nome;
            const telefone = requisicao.body.telefone;
            //pseudo validação
            if (cpf && nome && telefone)
            {
                //gravar a categoria
                const responsavel = new Responsavel(cpf, nome, telefone);
                responsavel.incluir()
                .then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Responsavel adicionado com sucesso!",
                        "cpf": responsavel.cpf
                    });
                })
                .catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível incluir o responsavel: " + erro.message
                    });
                });
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

    editar(requisicao, resposta){
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")){
            //o código será extraída da URL (padrão REST)
            const cpf  = requisicao.params.cpf;
            const nome = requisicao.body.nome;
            const telefone = requisicao.body.telefone;
        
            if (cpf && nome && telefone)
            {
                //alterar a categoria
                const responsavel = new Responsavel(cpf, nome, telefone);
                responsavel.alterar().then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Responsavel alterado com sucesso!",
                    });
                })
                .catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível alterar o responsavel: " + erro.message
                    });
                });
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

    excluir(requisicao, resposta) {
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const cpf = requisicao.params.cpf;
            //pseudo validação
            if (cpf) {
                //alterar o produto
                const responsavel = new Responsavel(cpf);
                responsavel.excluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Responsável excluído com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir o responsavel: " + erro.message
                        });
                    });
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

    consultar(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method == "GET") {
            let cpf = requisicao.params.cpf;

            //evitar que código tenha valor undefined
            if (!cpf) {
                cpf = "";
            }

            const responsavel = new Responsavel();
            //método consultar retorna uma lista de produtos
            responsavel.consultar(cpf)
                .then((listaResponsavel) => {
                    resposta.status(200).json(listaResponsavel);
                })
                .catch((erro) => {
                    resposta.status(500).json(
                        {
                            "status": false,
                            "mensagem": "Erro ao consultar responsaveis: " + erro.message
                        }
                    );
                });

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