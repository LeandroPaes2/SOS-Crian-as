//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Funcionario from "../Modelo/funcionario.js";
import conectar from "../Persistencia/Conexao.js";

export default class FuncionarioCtrl {

    async gravar(requisicao, resposta){

        const conexao = await conectar();

        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const nome  = requisicao.body.nome;
            const cpf = requisicao.body.cpf;
            const cargo = requisicao.body.cargo;
            const nivel = requisicao.body.nivel;
            const email = requisicao.body.email;
            const senha = requisicao.body.senha;
            //pseudo validação
            if (nome && cpf && cargo && nivel && email && senha)
            {
                const funcionario = new Funcionario(nome, cpf, cargo, nivel, email, senha);
                try{
                    await conexao.query('BEGIN');
                        if(funcionario.incluir(conexao)){
                        await conexao.query('COMMIT');
                        //await conexao.release();

                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Funcionario adicionado com sucesso!"
                        });
                    }
                    else{
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível incluir o funcionario: "
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
                        "mensagem":"Informe corretamente todos os dados de uma funcionario conforme documentação da API."
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
       // await conexao.query('END;');
    }

    async editar(requisicao, resposta) {
        
        const conexao = await conectar();

        resposta.type("application/json");
        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")) {
            const cpf = requisicao.params.cpf; // CPF vem da URL (padrão REST)
            const nome = requisicao.body.nome;
            const cargo = requisicao.body.cargo;
            const nivel = requisicao.body.nivel;
            const email = requisicao.body.email;
            const senha = requisicao.body.senha;
    
            if (nome && cargo && nivel && email && senha) {
                // Verifica se o CPF enviado no corpo da requisição é o mesmo da URL
                if (requisicao.body.cpf && requisicao.body.cpf !== cpf) {
                    return resposta.status(400).json({
                        "status": false,
                        "mensagem": "O CPF não pode ser alterado."
                    });
                }
    
                const funcionario = new Funcionario(nome, cpf, cargo, nivel, email, senha);
                try{
                    await conexao.query('BEGIN');
                        if(funcionario.alterar(conexao)){
                        await conexao.query('COMMIT');
                        //await conexao.release();

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Funcionário alterado com sucesso!",
                        });
                    }
                    else{
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Não foi possível alterar o funcionário: "
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
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados de um funcionário conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }
    

    async excluir(requisicao, resposta) {

        const conexao = await conectar();

        //preparar o destinatário que a resposta estará no formato JSON
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const cpf = requisicao.params.cpf;
            //pseudo validação
            if (cpf) {
                //alterar o produto
                const funcionario = new Funcionario("", cpf, "", "", "", "");
                try{
                    await conexao.query('BEGIN');
                        if(funcionario.excluir(conexao)){
                        await conexao.query('COMMIT');
                        //await conexao.release();

                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Funcionario excluido com sucesso!"
                        });
                    }
                    else{
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível excluir o funcionario: "
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
            let nome = requisicao.params.nome;

            //evitar que código tenha valor undefined
            if (!nome) {
                nome = "";
            }

            const funcionario = new Funcionario();
            //método consultar retorna uma lista de produtos
            try{
                await conexao.query('BEGIN');
                const listaFuncionario = await funcionario.consultar(nome, conexao);
                if (Array.isArray(listaFuncionario)) {
                    await conexao.query('COMMIT');
                    resposta.status(200).json(listaFuncionario);
                } else {
                    await conexao.query('ROLLBACK');
                    resposta.status(500).json({ status: false, mensagem: "Formato inesperado na resposta" });
                }
                
               /* if(listaFuncionario){
                    await conexao.query('COMMIT');
                    //await conexao.release();
                        
                    resposta.status(200).json(listaFuncionario);
                }
                else{
                    await conexao.query('ROLLBACK');
                    //await conexao.release();
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao consultar funcionarios: "
                    });
                }*/
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