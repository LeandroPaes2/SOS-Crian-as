//É a classe responsável por traduzir requisições HTTP e produzir respostas HTTP
/*import ListaEspera from "../Modelo/listaEspera.js";
import Aluno from "../Modelo/aluno.js";
import conectar from "./Conexao.js";

export default class ListaEsperaCtrl {

    async gravar(requisicao, resposta) {

        const conexao = await conectar();

        resposta.type("application/json");
    
        if (requisicao.method === 'POST' && requisicao.is("application/json")) {
            const numProtocolo = parseInt(requisicao.params.numProtocolo); // Vem da URL
            const { nome, dataInsercao, aluno } = requisicao.body;
    
            if (!aluno || !aluno.numProtocolo) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Aluno não informado ou inválido."
                });
            }
    
            if (!nome || !dataInsercao || isNaN(numProtocolo) || numProtocolo <= 0) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Informe corretamente todos os dados de uma lista de espera conforme documentação da API."
                });
            }
    
            const alu = new Aluno(aluno.numProtocolo);
            try{
                await conexao.query('BEGIN');
                const listaAlunos = await aluno.consultar(numProtocolo, conexao);
                if (listaAlunos.length > 0) {
                    await conexao.query('COMMIT');
                    const listaEspera = new ListaEspera(0, numProtocolo, nome, dataInsercao, alu);
                    try{
                        await conexao.query('BEGIN');
                            if(listaEspera.incluir(conexao)){
                            await conexao.query('COMMIT');
                            //await conexao.release();
    
                            resposta.status(200).json({
                                "status":true,
                                "mensagem":"Aluno adicionado a Lista de Espera com sucesso!"
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
                }else {
                        resposta.status(400).json({
                            status: false,
                            mensagem: "O aluno informado não existe!"
                        });
                }
            }catch (e) {
                await conexao.query('ROLLBACK');
                throw e
            }finally {
                conexao.release();
            }
    
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
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
                //alterar o listaEspera
                const listaEspera = new ListaEspera(id);
                try{
                    await conexao.query('BEGIN');
                        if(listaEspera.excluir(conexao)){
                        await conexao.query('COMMIT');
                        //await conexao.release();

                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Aluno excluido da Lista de Espera com sucesso!"
                        });
                    }
                    else{
                        await conexao.query('ROLLBACK');
                        //await conexao.release();
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Não foi possível excluir o aluno da lista de espera: "
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
                        "mensagem": "Informe um código válido de um listaEspera conforme documentação da API."
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
                let nome = requisicao.params.nome;
    
                //evitar que código tenha valor undefined
                if (!nome) {
                    nome = "";
                }
    
                const LisaEspera = new ListaEspera();
                //método consultar retorna uma lista de produtos
                try{
                    await conexao.query('BEGIN');
                    const LisaEspera = await funcionario.consultar(nome, conexao);
                    if (Array.isArray(LisaEspera)) {
                        await conexao.query('COMMIT');
                        resposta.status(200).json(LisaEspera);
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

}*/

/*
import ListaEspera from "../Modelo/listaEspera.js";
import Aluno from "../Modelo/aluno.js";
import conectar from "./Conexao.js";

export default class ListaEsperaCtrl {

    async gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === 'POST' && requisicao.is("application/json")) {
            const numProtocolo = parseInt(requisicao.params.numProtocolo);
            const { nome, dataInsercao } = requisicao.body;

            if (!nome || !dataInsercao || isNaN(numProtocolo) || numProtocolo <= 0) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Dados inválidos. Consulte a documentação da API."
                });
            }

            const conexao = await conectar();

            try {
                await conexao.beginTransaction();

                const aluno = new Aluno(numProtocolo);
                const resultadoConsulta = await aluno.consultar(numProtocolo, conexao);

                if (resultadoConsulta.length === 0) {
                    await conexao.rollback();
                    return resposta.status(400).json({
                        status: false,
                        mensagem: "Aluno não encontrado."
                    });
                }

                const listaEspera = new ListaEspera(numProtocolo, nome, dataInsercao, aluno);
                await listaEspera.incluir(conexao);

                await conexao.commit();
                resposta.status(200).json({
                    status: true,
                    mensagem: "Aluno adicionado à lista de espera com sucesso!"
                });

            } catch (erro) {
                await conexao.rollback();
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao gravar lista de espera: " + erro.message
                });
            } finally {
                conexao.release();
            }

        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === 'DELETE') {
            const numProtocolo = parseInt(requisicao.params.numProtocolo);

            if (isNaN(numProtocolo) || numProtocolo <= 0) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Número de protocolo inválido."
                });
            }

            const conexao = await conectar();

            try {
                await conexao.beginTransaction();

                const listaEspera = new ListaEspera(numProtocolo);
                await listaEspera.excluir(conexao);

                await conexao.commit();
                resposta.status(200).json({
                    status: true,
                    mensagem: "Aluno removido da lista de espera com sucesso."
                });

            } catch (erro) {
                await conexao.rollback();
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao excluir da lista de espera: " + erro.message
                });
            } finally {
                conexao.release();
            }

        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === 'GET') {
            let termo = requisicao.params.nome || "";

            const conexao = await conectar();

            try {
                await conexao.beginTransaction();

                const lista = new ListaEspera();
                const resultado = await lista.consultar(termo, conexao);

                await conexao.commit();
                resposta.status(200).json(resultado);

            } catch (erro) {
                await conexao.rollback();
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar lista de espera: " + erro.message
                });
            } finally {
                conexao.release();
            }

        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida! Consulte a documentação da API."
            });
        }
    }
}*/



import ListaEspera from "../Modelo/listaEspera.js";
import Responsavel from "../Modelo/responsavel.js";
import Escola from "../Modelo/escola.js";
import conectar from "./Conexao.js";

export default class ListaEsperaCtrl {
    async gravar(req, res) {
        res.type("application/json");
    
        if (req.method === "POST" && req.is("application/json")) {
            const {
                id,
                nome,
                dataNascimento,
                responsavel,
                rua,
                numero,
                escola,
                telefone,
                periodoEscola,
                realizaAcompanhamento,
                possuiSindrome,
                descricao,
                dataInsercao
            } = req.body;
    
            // Validação de campos obrigatórios (inclusive os objetos filhos)
            const dadosValidos =
                id !== undefined &&
                nome && dataNascimento &&
                responsavel && responsavel.cpf && responsavel.nome &&
                responsavel.telefone && responsavel.email && responsavel.parentesco &&
                rua && numero &&
                escola && escola.codigo && escola.nome && escola.endereco &&
                telefone && periodoEscola &&
                realizaAcompanhamento !== undefined &&
                possuiSindrome !== undefined &&
                descricao && dataInsercao;
    
            if (dadosValidos) {
                let conexao;
                try {
                    const objResponsavel = new Responsavel(
                        responsavel.cpf,
                        responsavel.nome,
                        responsavel.telefone
                    );
    
                    const objEscola = new Escola(
                        escola.id,
                        escola.nome,
                        escola.endereco,
                        escola.telefone,
                        escola.tipo
                    );
    
                    const listaEspera = new ListaEspera(
                        id,
                        nome,
                        dataNascimento,
                        objResponsavel,
                        rua,
                        numero,
                        objEscola,
                        telefone,
                        periodoEscola,
                        realizaAcompanhamento,
                        possuiSindrome,
                        descricao,
                        dataInsercao
                    );
    
                    conexao = await conectar();
                    await conexao.query("BEGIN");
    
                    const resultado = await listaEspera.incluir(conexao);
    
                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Cadastrado com sucesso na Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao cadastrar listaEspera." });
                    }
    
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro interno: " + erro.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos. Verifique a requisição." });
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async alterar(req, res) {
        res.type("application/json");
    
        if ((req.method === "PUT" || req.method === "PATCH") && req.is("application/json")) {
            const {
                id,
                nome,
                dataNascimento,
                responsavel,
                rua,
                numero,
                escola,
                telefone,
                periodoEscola,
                realizaAcompanhamento,
                possuiSindrome,
                descricao,
                dataInsercao
            } = req.body;
    
            const dadosValidos =
                id !== undefined && id !== 0 &&
                nome && dataNascimento &&
                responsavel && responsavel.cpf && responsavel.nome &&
                responsavel.telefone && responsavel.email && responsavel.parentesco &&
                rua && numero &&
                escola && escola.codigo && escola.nome && escola.endereco &&
                telefone && periodoEscola &&
                realizaAcompanhamento !== undefined &&
                possuiSindrome !== undefined &&
                descricao && dataInsercao;
    
            if (dadosValidos) {
                let conexao;
                try {
                    const objResponsavel = new Responsavel(
                        responsavel.cpf,
                        responsavel.nome,
                        responsavel.telefone
                    );
    
                    const objEscola = new Escola(
                        escola.id,
                        escola.nome,
                        escola.endereco,
                        escola.telefone,
                        escola.tipo
                    );
    
                    const listaEspera = new ListaEspera(
                        id,
                        nome,
                        dataNascimento,
                        objResponsavel,
                        rua,
                        numero,
                        objEscola,
                        telefone,
                        periodoEscola,
                        realizaAcompanhamento,
                        possuiSindrome,
                        descricao,
                        dataInsercao
                    );
    
                    conexao = await conectar();
                    await conexao.query("BEGIN");
    
                    const resultado = await listaEspera.alterar(conexao);
    
                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Alterado com sucesso na Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao alterar listaEspera." });
                    }
    
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao alterar listaEspera: " + erro.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos." });
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }


    async excluir(req, res) {
        res.type("application/json");
    
        if (req.method === "DELETE") {
            const id = parseInt(req.params.id); // usa o mesmo nome do model
    
            if (!isNaN(id)) {
                const listaEspera = new ListaEspera(id);
                
    
                let conexao;
    
                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");
    
                    const resultado = await listaEspera.excluir(conexao);
    
                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Excluído com sucesso da Lista de Espera!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao excluir na lista de espera. Verifique se o ID existe." });
                    }
    
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao excluir listaEspera: " + erro.message });
                } finally {
                    if (conexao) conexao.release();
                }
    
            } else {
                res.status(400).json({ status: false, mensagem: "ID inválido!" });
            }
    
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método DELETE." });
        }
    }
    
    async consultar(req, res) {
        res.type("application/json");
    
        if (req.method === "GET") {
            const termo = req.params.id || ""; // Pode ser número (protocolo) ou string para buscar por nome
            const listaEspera = new ListaEspera();
            let conexao;
    
            try {
                conexao = await conectar();
                const listaListaEspera = await listaEspera.consultar(termo, conexao);
    
                if (Array.isArray(listaListaEspera) && listaListaEspera.length > 0) {
                    res.status(200).json(listaListaEspera);
                } else {
                    res.status(404).json({ status: false, mensagem: "Nenhuma criança encontrada na Lista de Espera." });
                }
    
            } catch (erro) {
                res.status(500).json({ status: false, mensagem: "Erro ao consultar na lista de esperas: " + erro.message });
            } finally {
                if (conexao) conexao.release();
            }
    
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }
    }
}
