import Aluno from "../Modelo/aluno.js";
import Responsavel from "../Modelo/responsavel.js";
import Escola from "../Modelo/escola.js";
import conectar from "../Persistencia/Conexao.js";

export default class AlunoCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const {
                nome,
                dataNascimento,
                responsavel,
                cidade,
                rua,
                bairro,
                numero,
                escola,
                telefone,
                periodoEscola,
                realizaAcompanhamento,
                possuiSindrome,
                descricao,
                rg,
                status,
                periodoProjeto,
                cep
            } = req.body;

            const dadosValidos =
                nome && dataNascimento &&
                cidade &&
                rua && numero &&
                telefone && periodoEscola &&
                realizaAcompanhamento !== undefined &&
                possuiSindrome !== undefined &&
                descricao &&
                rg && status && periodoProjeto && cep && bairro && escola && escola.id && responsavel && responsavel.cpf
            if (dadosValidos) {
                let conexao;
                try {
                    conexao = await conectar();
                    let aluno = new Aluno();

                    let objResponsavel = await aluno.consultarResponsavel(responsavel.cpf, conexao);
                    let objEscola =await aluno.consultarEscola(escola.id, conexao);
                    
                     const alunoCompleto = new Aluno(
                        0,
                        nome,
                        dataNascimento,
                        objResponsavel,
                        cidade,
                        rua,
                        bairro,
                        numero,
                        objEscola,
                        telefone,
                        periodoEscola,
                        realizaAcompanhamento,
                        possuiSindrome,
                        descricao,
                        rg,
                        status,
                        periodoProjeto,
                        cep
                    );


                    await conexao.query("BEGIN");
                    try {
                        await alunoCompleto.incluir(conexao);
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Aluno cadastrado com sucesso!" });
                    } catch (erro) {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao cadastrar aluno. Verifique os dados informados." + erro.message });
                    }

                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro interno ao cadastrar aluno: " + erro.message });
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
                cidade,
                rua,
                bairro,
                numero,
                escola,
                telefone,
                periodoEscola,
                realizaAcompanhamento,
                possuiSindrome,
                descricao,
                rg,
                status,
                periodoProjeto,
                cep
            } = req.body;

            const dadosValidos =
                id !== undefined  &&
                nome && dataNascimento &&
                responsavel &&
                cidade &&
                rua && numero &&
                escola && 
                telefone && periodoEscola &&
                realizaAcompanhamento !== undefined &&
                possuiSindrome !== undefined &&
                descricao &&
                rg && status  && periodoProjeto && cep && bairro;
            if (dadosValidos) {
                let conexao;
                try {
                    const objResponsavel = null;
                    const objEscola =null;


                    // const objFormularioSaude = null; //gambiarra pra rodar por enquanto
                    // const objFicha = null;  //gambiarra pra rodar por enquanto

                    /*
                    const objFormularioSaude = new FormularioSaude(
                        formularioSaude.id,
                        // RESTO DOS ATRIBUTOS
                    );
                    */



                    const aluno = new Aluno(
                        id,
                        nome,
                        dataNascimento,
                        objResponsavel,
                        cidade,
                        rua,
                        bairro,
                        numero,
                        objEscola,
                        telefone,
                        periodoEscola,
                        realizaAcompanhamento,
                        possuiSindrome,
                        descricao,
                        rg,
                        // objFormularioSaude,
                        // objFicha,
                        status,
                        periodoProjeto,
                        cep
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    const resultado = await aluno.alterar(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Aluno alterado com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao alterar aluno. Verifique os dados informados!" });
                    }

                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro interno ao alterar aluno: " + erro.message });
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


    async desligar(req, res) {
        res.type("application/json");

        if (req.method === "DELETE") {
            const id = parseInt(req.params.id); // usa o mesmo nome do model

            if (!isNaN(id)) {
                const aluno = new Aluno(id); // poderia ser rg mas tem chance de duplicidade


                let conexao;

                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    const resultado = await aluno.excluir(conexao);

                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Aluno desligado com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao excluir aluno. Verifique se o ID existe." }); // poderia ser rg
                    }

                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro interno ao excluir aluno: " + erro.message });
                } finally {
                    if (conexao) conexao.release();
                }

            } else {
                res.status(400).json({ status: false, mensagem: "ID inválido!" }); // poderia ser rg
            }

        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método DELETE." });
        }
    }

    async consultar(req, res) {
        res.type("application/json");

        if (req.method === "GET") {
            let termo = req.params.nome || "";
            let tipo = 1;
            if (termo == "") {
                tipo = 2;
                termo = req.params.rg || "";
            }
            if (termo == "") {
                tipo = 3;
                termo = req.params.id || "";
            }
            if (termo == "") {
                tipo = 0;
                termo = "";
            }

            const aluno = new Aluno();
            let conexao;

            try {
                conexao = await conectar();
                const listaAluno = await aluno.consultar(termo, tipo, conexao);

                if (Array.isArray(listaAluno) && listaAluno.length > 0) {
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
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }
    }
}
