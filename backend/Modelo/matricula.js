import MatriculaDAO from "../Persistencia/matriculaDAO.js";
export default class Matricula {
    #id;
    #aluno;
    #turma;
    #dataInclusaoProjeto;
    #dataAtualMatricula;
    #dataVencimento;
    #dataDesligamento;
    #motivoDesligamento
    #status;


    constructor(id = 0, aluno = {}, turma = {}, dataInclusaoProjeto = "", dataAtualMatricula = "", dataVencimento = "",dataDesligamento = "", motivoDesligamento = "", status = 0) {
        this.#id = id;
        this.#aluno = aluno;
        this.#turma = turma;
        this.#dataInclusaoProjeto = dataInclusaoProjeto;
        this.#dataAtualMatricula = dataAtualMatricula;
        this.#dataVencimento = dataVencimento;
        this.#dataDesligamento = dataDesligamento;
        this.#motivoDesligamento = motivoDesligamento;
        this.#status = status;
    }

    get id() { return this.#id; }
    set id(novoId) { this.#id = novoId; }

    get aluno() { return this.#aluno; }
    set aluno(novoAluno) { this.#aluno = novoAluno; }

    get turma() { return this.#turma; }
    set turma(novaTurma) { this.#turma = novaTurma; }

    get dataInclusaoProjeto() { return this.#dataInclusaoProjeto; }
    set dataInclusaoProjeto(novaDataInclusaoProjeto) { this.#dataInclusaoProjeto = novaDataInclusaoProjeto; }

    get dataAtualMatricula() { return this.#dataAtualMatricula; }
    set dataAtualMatricula(novadataAtualMatricula) { this.#dataAtualMatricula = novadataAtualMatricula; }

    get dataVencimento() { return this.#dataVencimento; }
    set dataVencimento(novaDataVencimento) { this.#dataVencimento = novaDataVencimento; }

    get dataDesligamento() { return this.#dataDesligamento; }
    set dataDesligamento(novaDataDesligamento) { this.#dataDesligamento = novaDataDesligamento; }

    get motivoDesligamento() { return this.#motivoDesligamento; }
    set motivoDesligamento(novoMotivoDesligamento) { this.#motivoDesligamento = novoMotivoDesligamento; }

    get status() { return this.#status; }
    set status(novoStatus) { this.#status = novoStatus; }



    toJSON() {
        return {
            id: this.#id,
            aluno: this.#aluno,
            turma: this.#turma,
            dataInclusaoProjeto: this.#dataInclusaoProjeto,
            dataAtualMatricula: this.#dataAtualMatricula,
            dataVencimento: this.#dataVencimento,
            motivoDesligamento: this.#motivoDesligamento,
            status: this.#status
        };
    }


    async incluir(conexao) {
       const matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.incluir(this,conexao);
    }

    
    async alterar(conexao) {
        const matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.alterar(this,conexao);
    }
    async excluir(conexao) {
        const matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.excluir(this,conexao);
    }
    
    async consultar(termo,conexao) {
        const matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.consultar(termo,conexao);
    }

     async consultarMatAluno(termo,conexao) {
        const matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.consultarMatAluno(termo,conexao);
    }


}