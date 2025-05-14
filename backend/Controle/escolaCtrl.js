import Escola from "../Modelo/escola.js";
import conectar from "../Persistencia/Conexao.js";

export default class EscolaCtrl {

    async gravar(requisicao, resposta) {
        const conexao = await conectar();
    
        resposta.type("application/json");
    
        if (requisicao.method == 'POST' && requisicao.is("application/json")) {
            const nome = requisicao.body.nome;
            const endereco = requisicao.body.endereco;
            const telefone = requisicao.body.telefone;
            const tipo = requisicao.body.tipo;
    
            if (nome && endereco && telefone && tipo) {
                try {
                    const escola = new Escola(0, nome, endereco, telefone, tipo);
                    await conexao.query("BEGIN");
    
                    const resultado = await escola.incluir(conexao);
    
                    if (resultado) {
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Escola adicionada com sucesso!",
                            "nome": escola.nome
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível incluir a escola" 
                        });
                    }
    
                } catch (erro) {
                    if (conexao) 
                        await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível incluir a escola: " + erro.message
                    });
                } finally {
                    if (conexao)
                        conexao.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados de uma escola conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }
    

    async editar(requisicao, resposta) {
        resposta.type("application/json");
        const conexao = await conectar();

        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            const id = requisicao.params.id;
            const nome = requisicao.body.nome;
            const endereco = requisicao.body.endereco;
            const telefone = requisicao.body.telefone;
            const tipo = requisicao.body.tipo;

            if (id && nome && endereco && telefone && tipo) {
           
                try{
                    const escola = new Escola(id, nome, endereco, telefone, tipo);
                    await conexao.query("BEGIN");
                    const resultado = await escola.alterar(conexao);

                    if(resultado){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Escola alterada com sucesso!",
                        });
                    }
                    else{
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível alterar a escola"
                        });
                    }

                }catch(erro){
                    if (conexao) 
                        await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível alterar a escola: " + erro.message
                    });
                } finally{
                    if(conexao)
                        conexao.release();
                }
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

    async excluir(requisicao, resposta) {
        resposta.type("application/json");
        const conexao = await conectar();

        if (requisicao.method == 'DELETE') {
            const id = requisicao.params.id;

            if (id) {
                
                try{
                    const escola = new Escola(id, null, null, null, null);  
                    await conexao.query("BEGIN");
                    const resultado = await escola.excluir(conexao);

                    if(resultado){
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Escola excluída com sucesso!",
                        });
                    }else{
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir a escola"
                        });
                    }
                }catch(erro){
                    if(conexao)
                        await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir a escola: " + erro.mensagem
                    });
                }
                
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

    async consultar(requisicao, resposta) {
        resposta.type("application/json");
        const conexao = await conectar();

        if (requisicao.method == "GET") {
            let id = requisicao.params.id;

            const escola = new Escola();

            try{
                
                const listaEscola = await escola.consultar(id, conexao);

                if(Array.isArray(listaEscola) && listaEscola.length > 0){
                    resposta.status(200).json(listaEscola);
                }else{
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao consultar escola" 
                    });
                }

            }catch(erro){
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar escola: " + erro.message
                });
            }finally{
                if(conexao)
                    conexao.release();
            }

        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

}