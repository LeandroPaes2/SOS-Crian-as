//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Turma from "../Modelo/turma.js";

export default class TurmaCtrl {

    gravar(requisicao, resposta){
        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const cor  = requisicao.body.cor;
            const periodo = requisicao.body.periodo;
            //pseudo validação
            if (cor && periodo)
            {
                //gravar a categoria
                const turma = new Turma(cor, periodo);
                turma.incluir()
                .then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Turma adicionada com sucesso!",
                        "cor": turma.cor
                    });
                })
                .catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível incluir a turma: " + erro.message
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
            const cor  = requisicao.params.cor;
            const periodo = requisicao.body.periodo;
        
            if (cor && periodo)
            {
                //alterar a categoria
                const turma = new Turma(cor, periodo);
                turma.alterar().then(()=>{
                    resposta.status(200).json({
                        "status":true,
                        "mensagem":"Turma alterada com sucesso!",
                    });
                })
                .catch((erro)=>{
                    resposta.status(500).json({
                        "status":false,
                        "mensagem":"Não foi possível alterar a turma: " + erro.message
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
            const cor = requisicao.params.cor;
            //pseudo validação
            if (cor) {
                //alterar o produto
                const turma = new Turma(cor);
                turma.excluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Turma excluído com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir a turma: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json(
                    {
                        "status": false,
                        "mensagem": "Informe um código válido de um produto conforme documentação da API."
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
            let cor = requisicao.params.cor;

            //evitar que código tenha valor undefined
            if (!cor) {
                cor = "";
            }

            const turma = new Turma();
            //método consultar retorna uma lista de produtos
            turma.consultar(cor)
                .then((listaTurma) => {
                    resposta.status(200).json(listaTurma);
                })
                .catch((erro) => {
                    resposta.status(500).json(
                        {
                            "status": false,
                            "mensagem": "Erro ao consultar turmas: " + erro.message
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