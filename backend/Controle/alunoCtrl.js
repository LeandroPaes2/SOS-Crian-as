import Aluno from "../Modelo/aluno.js";
import Responsavel from "../Modelo/responsavel.js";
import Escola from "../Modelo/escola.js";

export default class AlunoCtrl {
    async gravar(req, res) {
        res.type("application/json");
    
        if (req.method === "POST" && req.is("application/json")) {
            const {
                numProtocolo,
                nome,
                dataNascimento,
                responsavel,
                rua,
                bairro,
                cidade,
                cep,
                numero,
                escola,
                telefone,
                periodoProjeto,
                periodoEscola,
                realizaAcompanhamento,
                possuiSindrome,
                status
            } = req.body;
    
            // Validação de campos obrigatórios (inclusive os objetos filhos)
            const dadosValidos =
                numProtocolo !== undefined &&
                nome && dataNascimento &&
                responsavel && responsavel.cpf && responsavel.nome &&
                responsavel.telefone && responsavel.email && responsavel.parentesco &&
                rua && bairro && cidade && cep && numero &&
                escola && escola.codigo && escola.nome && escola.endereco &&
                telefone && periodoProjeto && periodoEscola &&
                realizaAcompanhamento !== undefined &&
                possuiSindrome !== undefined &&
                status !== undefined;
    
            if (dadosValidos) {
                let conexao;
                try {
                    const objResponsavel = new Responsavel(
                        responsavel.cpf,
                        responsavel.nome,
                        responsavel.telefone,
                        responsavel.email,
                        responsavel.parentesco
                    );
    
                    const objEscola = new Escola(
                        escola.codigo,
                        escola.nome,
                        escola.endereco
                    );
    
                    const aluno = new Aluno(
                        numProtocolo,
                        nome,
                        dataNascimento,
                        objResponsavel,
                        rua,
                        bairro,
                        cidade,
                        cep,
                        numero,
                        objEscola,
                        telefone,
                        periodoProjeto,
                        periodoEscola,
                        realizaAcompanhamento,
                        possuiSindrome,
                        status
                    );
    
                    conexao = await conectar();
                    await conexao.query("BEGIN");
    
                    const resultado = await aluno.incluir(conexao);
    
                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Aluno cadastrado com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao cadastrar aluno." });
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
                numProtocolo,
                nome,
                dataNascimento,
                responsavel,
                rua,
                bairro,
                cidade,
                cep,
                numero,
                escola,
                telefone,
                periodoProjeto,
                periodoEscola,
                realizaAcompanhamento,
                possuiSindrome,
                status
            } = req.body;
    
            const dadosValidos =
                numProtocolo !== undefined && numProtocolo !== 0 &&
                nome && dataNascimento &&
                responsavel && responsavel.cpf && responsavel.nome &&
                responsavel.telefone && responsavel.email && responsavel.parentesco &&
                rua && bairro && cidade && cep && numero &&
                escola && escola.codigo && escola.nome && escola.endereco &&
                telefone && periodoProjeto && periodoEscola &&
                realizaAcompanhamento !== undefined &&
                possuiSindrome !== undefined &&
                status !== undefined;
    
            if (dadosValidos) {
                let conexao;
                try {
                    const objResponsavel = new Responsavel(
                        responsavel.cpf,
                        responsavel.nome,
                        responsavel.telefone,
                        responsavel.email,
                        responsavel.parentesco
                    );
    
                    const objEscola = new Escola(
                        escola.codigo,
                        escola.nome,
                        escola.endereco
                    );
    
                    const aluno = new Aluno(
                        numProtocolo,
                        nome,
                        dataNascimento,
                        objResponsavel,
                        rua,
                        bairro,
                        cidade,
                        cep,
                        numero,
                        objEscola,
                        telefone,
                        periodoProjeto,
                        periodoEscola,
                        realizaAcompanhamento,
                        possuiSindrome,
                        status
                    );
    
                    conexao = await conectar();
                    await conexao.query("BEGIN");
    
                    const resultado = await aluno.alterar(conexao);
    
                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Aluno alterado com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao alterar aluno." });
                    }
    
                } catch (erro) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao alterar aluno: " + erro.message });
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
            const numProtocolo = parseInt(req.params.numProtocolo); // usa o mesmo nome do model
    
            if (!isNaN(numProtocolo)) {
                const aluno = new Aluno(numProtocolo);
                
    
                let conexao;
    
                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");
    
                    const resultado = await aluno.excluir(conexao);
    
                    if (resultado) {
                        await conexao.query("COMMIT");
                        res.status(200).json({ status: true, mensagem: "Aluno excluído com sucesso!" });
                    } else {
                        await conexao.query("ROLLBACK");
                        res.status(500).json({ status: false, mensagem: "Erro ao excluir aluno. Verifique se o ID existe." });
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
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método DELETE." });
        }
    }
    
    async consultar(req, res) {
        res.type("application/json");
    
        if (req.method === "GET") {
            const termo = req.params.id || ""; // Pode ser número (protocolo) ou string para buscar por nome
            const aluno = new Aluno();
            let conexao;
    
            try {
                conexao = await conectar();
                const listaAluno = await aluno.consultar(termo, conexao);
    
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