import Familia from "../Modelo/familia.js";
import conectar from "../Persistencia/Conexao.js";

export default class FamiliaCtrl {

    async gravar(requisicao, resposta) {
        const conexao = await conectar();

        resposta.type("application/json");

        if (requisicao.method == 'POST' && requisicao.is("application/json")) {
            const nome = requisicao.body.nome;
            const sexo = requisicao.body.sexo;
            const dataNascimento = requisicao.body.dataNascimento;
            const profissao = requisicao.body.profissao
            const escolaridade = requisicao.body.escolaridade;
            const grauParentesco = requisicao.body.grauParentesco;
            const irmaos = requisicao.body.irmaos;
            const temContato = requisicao.body.temContato;

            if (nome && sexo && dataNascimento && escolaridade && grauParentesco) {

                if(irmaos.includes("pai") || irmaos.includes("mae")){
                    if(!temContato){
                        await conexao.query("ROLLBACK");
                        return resposta.status(400).json(
                        {
                            "status":false,
                            "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                        });
                    }
                }else{
                    if(temContato=="Sim"){
                        await conexao.query("ROLLBACK");
                        return resposta.status(400).json(
                        {
                            "status":false,
                            "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                        });
                    }
                }

                try {
                    const familia = new Familia(0, nome, sexo, dataNascimento, profissao, escolaridade, grauParentesco, irmaos, temContato);
                    await conexao.query("BEGIN");

                    const resultado = await familia.incluir(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Familia adicionada com sucesso!",
                            "nome": familia.nome
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Nao foi possivel incluir a familia"
                        });
                    }
                } catch (erro) {
                    if (conexao)
                        await conexao.query("ROLLBACK");
                    console.log(erro);
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Nao foi possivel incluir a familia: " + erro.message
                    });
                } finally {
                    if (conexao)
                        await conexao.end();
                }
            } else {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Nao foi possivel incluir a familia"
                });
            }
        } else {
            resposta.status(500).json({
                "status": false,
                "mensagem": "Nao foi possivel incluir a familia"
            });
        }
    }

    async alterar(requisicao, resposta) {
        const conexao = await conectar();

        resposta.type("application/json");

        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            const id = requisicao.params.id;
            const nome = requisicao.body.nome;
            const sexo = requisicao.body.sexo;
            const dataNascimento = requisicao.body.dataNascimento;
            const profissao = requisicao.body.profissao;
            const escolaridade = requisicao.body.escolaridade;
            const grauParentesco = requisicao.body.grauParentesco;
            const irmaos = requisicao.body.irmaos;
            const temContato = requisicao.body.temContato;
            

            if (id>0 && nome && sexo && dataNascimento && escolaridade && grauParentesco) {

                if(irmaos.includes("pai") || irmaos.includes("mae")){
                    if(!temContato){
                        await conexao.query("ROLLBACK");
                        return resposta.status(400).json(
                        {
                            "status":false,
                            "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                        });
                    }
                }else{
                    if(temContato=="Sim"){
                        await conexao.query("ROLLBACK");
                        return resposta.status(400).json(
                        {
                            "status":false,
                            "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                        });
                    }
                }

                try {
                    const familia = new Familia(id, nome, sexo, dataNascimento, profissao, escolaridade, grauParentesco, irmaos, temContato);
                    await conexao.query("BEGIN");

                    const resultado = await familia.alterar(conexao);


                    if (resultado && resultado.rowCount > 0) {
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Familia alterada com sucesso!",
                            "nome": familia.nome
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        resposta.status(404).json({
                            "status": false,
                            "mensagem": "Nao foi possivel alterar a familia"
                        });
                    }
                } catch (erro) {
                    if (conexao)
                        await conexao.query("ROLLBACK");
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Nao foi possivel: " + erro.message
                    });
                } finally {
                    if (conexao)
                        await conexao.end();
                }
            } else {

                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Nao foi possivel alterar."
                    
                });
            }
        } else {
            resposta.status(500).json({
                "status": false,
                "mensagem": "Nao foi possivel alterar a familia"
            });
        }

    }


    async excluir(requisicao, resposta) {
        const conexao = await conectar();

        resposta.type("application/json");

        if (requisicao.method == 'DELETE') {
            const id = requisicao.params.id;

            if (id) {
                try {
                    const familia = new Familia(id);
                    await conexao.query("BEGIN");
                    const resultado = await familia.excluir(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Familia excluida com sucesso!"
                        });
                    } else {
                        await conexao.query("ROLLBACK");
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Nao foi possivel excluir a familia"
                        });
                    }
                } catch (erro) {
                    if (conexao)
                        await conexao.query("ROLLBACK");
                    console.log(erro);
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Nao foi possivel excluir a familia"
                    });
                } finally {
                    if (conexao)
                        await conexao.end();
                }
            } else {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Nao foi possivel excluir a familia"
                });
            }
        } else {
            resposta.status(500).json({
                "status": false,
                "mensagem": "Nao foi possivel excluir a familia"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");
        const conexao = await conectar();

        if (requisicao.method === 'GET') {

            let id = requisicao.params.id;
            const familia = new Familia();

            try {
                const listaFamilia = await familia.consultar(id, conexao);

                if (Array.isArray(listaFamilia) && listaFamilia.length > 0) {
                    resposta.status(200).json(listaFamilia);
                } else {
                    resposta.status(404).json({
                        "status": false,
                        "mensagem": "Não há família cadastrada."
                    });
                }

            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar família: " + erro.message
                });
            } finally {
                if (conexao) await conexao.release();
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Método não permitido para esta rota"
            });
        }
    }

}