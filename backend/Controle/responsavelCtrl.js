//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
import Responsavel from "../Modelo/responsavel.js";
import conectar from "../Persistencia/Conexao.js";

export default class ResponsavelCtrl {

    async gravar(requisicao, resposta){
        resposta.type("application/json");
        
        if (requisicao.method == 'POST' && requisicao.is("application/json")){
            const cpf  = requisicao.body.cpf;
            const rg = requisicao.body.rg;
            const nome = requisicao.body.nome;
            const telefone = requisicao.body.telefone;
            const email = requisicao.body.email;
            const sexo = requisicao.body.sexo;
            const dtNascimento = requisicao.body.dtNascimento;
            const estCivil = requisicao.body.estCivil;
            const conjuge = requisicao.body.conjuge;
            const profissao = requisicao.body.profissao;
            const situTrabalho = requisicao.body.situTrabalho;
            const escolaridade = requisicao.body.escolaridade;
            const rendaFamiliar = requisicao.body.rendaFamiliar;
            const valorRenda = requisicao.body.valorRenda;
            const qtdeTrabalhadores = requisicao.body.qtdeTrabalhadores;
            const pensaoAlimenticia = requisicao.body.pensaoAlimenticia;
            const valorPensao = requisicao.body.valorPensao;
            const pagadorPensao = requisicao.body.pagadorPensao;
            const beneficioSocial = requisicao.body.beneficioSocial;
            const tipoBeneficio = requisicao.body.tipoBeneficio;
            const valorBeneficio = requisicao.body.valorBeneficio;
            const beneficiario = requisicao.body.beneficiario;

            if (cpf && rg && nome && telefone && email && sexo && dtNascimento && estCivil && conjuge && situTrabalho && escolaridade && rendaFamiliar && valorRenda>0.00 && qtdeTrabalhadores>=0 && pensaoAlimenticia && beneficioSocial)
            {
                if(pensaoAlimenticia=='Sim' ){
                    if(valorPensao<=0 || !pagadorPensao){
                        await conexao.query("ROLLBACK");
                        return resposta.status(400).json(
                        {
                            "status":false,
                            "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                        });
                    }
                }else if(beneficioSocial=='Sim'){
                    if(!tipoBeneficio || valorBeneficio<=0 || !beneficiario){
                        await conexao.query("ROLLBACK");
                        return resposta.status(400).json(
                        {
                            "status":false,
                            "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                        });
                    }
                }
                
                let conexao;
                const responsavel = new Responsavel(cpf, rg, nome, telefone, email, sexo, dtNascimento, estCivil, conjuge, profissao, situTrabalho, escolaridade, rendaFamiliar, valorRenda, qtdeTrabalhadores, pensaoAlimenticia, valorPensao, pagadorPensao, beneficioSocial, tipoBeneficio, valorBeneficio, beneficiario);
                try{
                    conexao=await conectar();
                    await conexao.query("BEGIN");
                    const resultado = await responsavel.incluir(conexao);
                    
                    if(resultado){
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
    
        resposta.type("application/json");
        if ((requisicao.method == 'PUT' || requisicao.method == 'PATCH') && requisicao.is("application/json")){
       
            const cpf  = requisicao.params.cpf;
            const rg = requisicao.body.rg;
            const nome = requisicao.body.nome;
            const telefone = requisicao.body.telefone;
            const email = requisicao.body.email;
            const sexo = requisicao.body.sexo;
            const dtNascimento = requisicao.body.dtNascimento;
            const estCivil = requisicao.body.estCivil;
            const conjuge = requisicao.body.conjuge;
            const profissao = requisicao.body.profissao;
            const situTrabalho = requisicao.body.situTrabalho;
            const escolaridade = requisicao.body.escolaridade;
            const rendaFamiliar = requisicao.body.rendaFamiliar;
            const valorRenda = requisicao.body.valorRenda;
            const qtdeTrabalhadores = requisicao.body.qtdeTrabalhadores;
            const pensaoAlimenticia = requisicao.body.pensaoAlimenticia;
            const valorPensao = requisicao.body.valorPensao;
            const pagadorPensao = requisicao.body.pagadorPensao;
            const beneficioSocial = requisicao.body.beneficioSocial;
            const tipoBeneficio = requisicao.body.tipoBeneficio;
            const valorBeneficio = requisicao.body.valorBeneficio;
            const beneficiario = requisicao.body.beneficiario;
        
            if (cpf && rg && nome && telefone && email && sexo && dtNascimento && estCivil && conjuge && situTrabalho && escolaridade && rendaFamiliar && valorRenda>0.00 && qtdeTrabalhadores>=0 && pensaoAlimenticia && beneficioSocial)
            {
                if(pensaoAlimenticia=='Sim' ){
                    if(valorPensao<=0 || !pagadorPensao){
                        await conexao.query("ROLLBACK");
                        return resposta.status(400).json(
                        {
                            "status":false,
                            "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                        });
                    }
                }else if(beneficioSocial=='Sim'){
                    if(!tipoBeneficio || valorBeneficio<=0 || !beneficiario){
                        await conexao.query("ROLLBACK");
                        return resposta.status(400).json(
                        {
                            "status":false,
                            "mensagem":"Informe corretamente todos os dados de uma turma conforme documentação da API."
                        });
                    }
                }

                let conexao;
                const responsavel = new Responsavel(cpf, rg, nome, telefone, email, sexo, estCivil, conjuge, profissao, situTrabalho, escolaridade, rendaFamiliar, valorRenda, qtdeTrabalhadores, pensaoAlimenticia, valorPensao, pagadorPensao, beneficioSocial, tipoBeneficio, valorBeneficio, beneficiario);
                
                try{
                    conexao = await conectar();
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
        
        resposta.type("application/json");
        //Verificando se o método da requisição é POST e conteúdo é JSON
        if (requisicao.method == 'DELETE') {
            //o código será extraída da URL (padrão REST)
            const cpf = requisicao.params.cpf;
            //pseudo validação
            if (cpf) {
                let conexao;
                
                const responsavel = new Responsavel(cpf);
                try{
                   
                    conexao = await conectar()
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
        
        resposta.type("application/json");
        if (requisicao.method == "GET") {
            let cpf = requisicao.params.cpf;

            //evitar que código tenha valor undefined
            if (!cpf) {
                cpf = "";
            }

            let conexao;
            const responsavel = new Responsavel();
            
            try{
                conexao = await conectar();
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
                    resposta.status(500).json(
                        {
                            "status": false,
                            "mensagem": "Erro ao consultar responsaveis: " + erro.message
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