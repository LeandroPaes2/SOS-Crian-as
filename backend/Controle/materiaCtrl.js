import Materia from "../Modelo/materia.js";
import conectar from "../Persistencia/Conexao.js";

export default class MateriaCtrl {

    async gravar(requisicao, resposta){
        const conexao = await conectar();

        resposta.type("application/json");
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const nome  = requisicao.body.nome;
            const descricao = requisicao.body.descricao;
            //pseudo validação
            if (nome && descricao)
            {
                const materia = new Materia(0, nome, descricao);
                try{
                    await conexao.query('BEGIN');
                        if(materia.incluir(conexao)){
                        await conexao.query('COMMIT');
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Materia adicionada com sucesso!",
                            "nome": materia.nome
                        });
                    }
                    else
                    {
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível adicionar a matéria: "
                        });
                    }              
                }
                catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                }
                finally {
                    conexao.release();
                }
            }
            else
            {
                resposta.status(400).json(
                    {
                        "status":false,
                        "mensagem":"Informe nomeretamente todos os dados de uma materia conforme documentação da API."
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
            const id  = requisicao.params.id;
            const nome  = requisicao.body.nome;
            const descricao = requisicao.body.descricao;
        
            if (id && nome && descricao)
            {
                //alterar a categoria
                const materia = new Materia(id, nome, descricao);
                try{
                    await conexao.query('BEGIN');
                        if(materia.alterar(conexao)){
                        await conexao.query('COMMIT');
                        //await conexao.release();

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Matéria alterada com sucesso!",
                        });
                    }
                    else{
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível alterar a matéria: "
                        });
                    }
                }
                catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                } 
                finally {
                    conexao.release();
                }
            }
            else
            {
                resposta.status(400).json(
                    {
                        "status":false,
                        "mensagem":"Informe nomeretamente todos os dados de uma materia conforme documentação da API."
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
        if (requisicao.method == 'DELETE') {
            const id = requisicao.params.id;
            if (id) {
                const materia = new Materia(id);
                try{
                    await conexao.query('BEGIN');
                        if(materia.excluir(conexao)){
                        await conexao.query('COMMIT');
                        //await conexao.release();

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Materia excluída com sucesso!",
                        });
                    }
                    else{
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível excluir a materia: " + erro.message
                        });
                    }
                }
                catch (e) {
                    await conexao.query('ROLLBACK');
                    throw e
                }
                finally {
                    conexao.release();
                }
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

    async consultar(requisicao, resposta) {
        const conexao = await conectar();

        resposta.type("application/json");
        if (requisicao.method == "GET") {
            const idParam   = requisicao.params.id;
            const nomeQuery = requisicao.body.nome;
            let termo = "";
            if (idParam) termo = idParam;
            else if (nomeQuery) termo = nomeQuery;

            const materia = new Materia();
            try{
                await conexao.query('BEGIN');
                const listamateria = await materia.consultar(termo, conexao);
                if (Array.isArray(listamateria)) {
                    await conexao.query('COMMIT');
                    resposta.status(200).json(listamateria);
                } else {
                    await conexao.query('ROLLBACK');
                    resposta.status(500).json({ status: false, mensagem: "Formato inesperado na resposta" });
                }
            }
            catch (e) {
                await conexao.query('ROLLBACK');
                throw e
            }
            finally {
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