import Escola from "../Modelo/escola.js";

export default class EscolaCtrl {

    gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method == 'POST' && requisicao.is("application/json")) {
            const nome = requisicao.body.nome;
            const endereco = requisicao.body.endereco;
            const telefone = requisicao.body.telefone;
            const tipo = requisicao.body.tipo;

            if (nome && endereco && telefone && tipo) {
                const escola = new Escola(nome, endereco, telefone, tipo);
                escola.incluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Escola adicionada com sucesso!",
                            "nome": escola.nome
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível incluir a escola: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados de uma escola conforme documentação da API."
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    editar(requisicao, resposta) {
        resposta.type("application/json");

        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            const nome = requisicao.params.nome;
            const endereco = requisicao.body.endereco;
            const telefone = requisicao.body.telefone;
            const tipo = requisicao.body.tipo;

            if (nome && endereco && telefone && tipo) {
                const escola = new Escola(nome, endereco, telefone, tipo);
                escola.alterar()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Escola alterada com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível alterar a escola: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados de uma escola conforme documentação da API."
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method == 'DELETE') {
            const nome = requisicao.params.nome;
            if (nome) {
                const escola = new Escola(nome);
                escola.excluir()
                    .then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Escola excluída com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir a escola: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe um código válido de uma escola conforme documentação da API."
                });
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
            let nome = requisicao.params.nome;

            if (!nome) {
                nome = "";
            }

            const escola = new Escola();
            escola.consultar(nome)
                .then((listaEscola) => {
                    resposta.status(200).json(listaEscola);
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao consultar escola: " + erro.message
                    });
                });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

}
