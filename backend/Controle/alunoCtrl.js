import Aluno from "../Modelo/aluno.js";

export default class AlunoCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {

            const nome = req.body.nome;
            const idade = req.body.idade;
            const responsavel = req.body.responsavel;
            const endereco = req.body.endereco;
            const telefone = req.body.telefone;
            const periodoProjeto = req.body.periodoProjeto;
            const periodoEscola = req.body.periodoEscola;


            if (nome && idade && responsavel && endereco && telefone && periodoProjeto && periodoEscola) {
                const aluno = new Aluno(nome, idade, responsavel, endereco, telefone, periodoProjeto, periodoEscola);

                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");
                
                    if (await aluno.incluir(conexao)) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Aluno cadastrado com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao cadastrar aluno." });
                    }
                
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao cadastrar aluno: " + erro.message });
                } finally {
                    if (conexao) conexao.release();
                }
                

            } else {
                res.status(400).json({ "status": false, "mensagem": "Dados incompletos! Consulte a documentação." });
            }
        } else {
            res.status(400).json({ "status": false, "mensagem": "Requisição inválida!" });
        }
    }


    async alterar(req, res) {
        res.type("application/json");

        if ((req.method === "PUT" || req.method === "PATCH") && req.is("application/json")) {

            const nome = req.body.nome;
            const idade = req.body.idade;
            const responsavel = req.body.responsavel;
            const endereco = req.body.endereco;
            const telefone = req.body.telefone;
            const periodoProjeto = req.body.periodoProjeto;
            const periodoEscola = req.body.periodoEscola;
            const id = parseInt(req.params.id);

            if (id && nome && idade && responsavel && endereco && telefone && periodoProjeto && periodoEscola) {
                const aluno = new Aluno(nome, idade, responsavel, endereco, telefone, periodoProjeto, periodoEscola, id);

                const conexao = await conectar();
                try {

                    await conexao.query("BEGIN");
                    if (await aluno.alterar(conexao)) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ "status": true, "mensagem": "Aluno alterado com sucesso!" });
                    }
                    else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ "status": false, "mensagem": "Erro ao alterar aluno: " + erro.message });
                    }


                } catch (erro) {
                    await conexao.query("ROLLBACK");
                    res.status(500).json({ "status": false, "mensagem": "Erro ao alterar aluno: " + erro.message });
                }
                finally {
                    if (conexao) {
                        await conexao.release();
                    }
                }
            } else {
                res.status(400).json({ "status": false, "mensagem": "Dados incompletos ou inválidos." });
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }


    async excluir(req, res) {
        res.type("application/json");
    
        if (req.method === "DELETE") {
            const id = parseInt(req.params.id);
    
            if (!isNaN(id)) {
                const aluno = new Aluno(id);
                let conexao;
    
                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");
    
                    if (await aluno.excluir(conexao)) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Aluno excluído com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao excluir aluno." });
                    }
    
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao excluir aluno: " + erro.message });
                } finally {
                    if (conexao) conexao.release();
                }
    
            } else {
                res.status(400).json({ status: false, mensagem: "ID inválido!" });
            }
    
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }
    
    async consultar(req, res) {
        res.type("application/json");

        if (req.method === "GET") {
            let id = req.params.id || "";
            const aluno = new Aluno();
            let conexao;

            try {
                conexao = await conectar();
                const listaAluno = await aluno.consultar(id, conexao);

                if (listaAluno) {
                    res.status(200).json(listaAluno);
                } else {
                    res.status(404).json({ status: false, mensagem: "Nenhum aluno encontrado." });
                }

            } catch (erro) {
                res.status(500).json({ status: false, mensagem: "Erro ao consultar alunos: " + erro.message });
            } finally {
                if (conexao) conexao.release();
            }

        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

}
