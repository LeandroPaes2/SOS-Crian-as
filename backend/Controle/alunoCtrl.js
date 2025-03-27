import Aluno from "../Modelo/aluno.js";

export default class AlunoCtrl {
    async gravar(req, res) {
        res.type("application/json");
        if (req.method === 'POST' && req.is("application/json")) {
            const { nome, idade, responsavel, endereco, telefone, periodoProjeto, periodoEscola } = req.body;
            if (nome && idade && responsavel && endereco && telefone && periodoProjeto && periodoEscola) {
                const aluno = new Aluno(nome, idade, responsavel, endereco, telefone, periodoProjeto, periodoEscola);
                try {
                    await aluno.incluir();
                    res.status(200).json({ status: true, mensagem: "Aluno cadastrado com sucesso!", nome: aluno.nome });
                } catch (erro) {
                    res.status(500).json({ status: false, mensagem: "Erro ao cadastrar aluno: " + erro.message });
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos! Consulte a documentação da API." });
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async consultar(req, res) {
        res.type("application/json");
        if (req.method === "GET") {
            let termo = req.params.nome || "";
            try {
                const aluno = new Aluno();
                const listaAlunos = await aluno.consultar(termo);
                res.status(200).json(listaAlunos);
            } catch (erro) {
                res.status(500).json({ status: false, mensagem: "Erro ao consultar alunos: " + erro.message });
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async excluir(req, res) {
        res.type("application/json");
        if (req.method === "DELETE") {
            const nome = req.params.nome;
            if (nome) {
                try {
                    const aluno = new Aluno(nome);
                    await aluno.excluir();
                    res.status(200).json({ status: true, mensagem: "Aluno excluído com sucesso!" });
                } catch (erro) {
                    res.status(500).json({ status: false, mensagem: "Erro ao excluir aluno: " + erro.message });
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Nome do aluno não informado!" });
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }
}