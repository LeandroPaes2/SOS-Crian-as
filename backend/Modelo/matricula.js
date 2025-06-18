export default class Matricula {
    #id;
    #aluno;
    #turma;
    #dataInclusaoProjeto;
    #dataMAtricula;
    #dataVencimento;
    #motivoDesligamento
    #status;


    constructor(id = 0, aluno = {}, turma = {}, dataInclusaoProjeto = "", dataMatricula = "", dataVencimento = "", motivoDesligamento = "", status = 0) {
        this.#id = id;
        this.#aluno = aluno;
        this.#turma = turma;
        this.#dataInclusaoProjeto = dataInclusaoProjeto;
        this.#dataMAtricula = dataMatricula;
        this.#dataVencimento = dataVencimento;
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

    get dataMatricula() { return this.#dataMAtricula; }
    set dataMatricula(novaDataMatricula) { this.#dataMAtricula = novaDataMatricula; }

    get dataVencimento() { return this.#dataVencimento; }
    set dataVencimento(novaDataVencimento) { this.#dataVencimento = novaDataVencimento; }

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
            dataMatricula: this.#dataMAtricula,
            dataVencimento: this.#dataVencimento,
            motivoDesligamento: this.#motivoDesligamento,
            status: this.#status
        };
    }


    async incluir(conexao) {
        matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.incluir(this,conexao);
    }

    async excluir(conexao) {
        matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.excluir(this,conexao);
    }

    async alterar(conexao) {
        matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.alterar(this,conexao);
    }

    async consultar(termo,conexao) {
        matriculaDAO = new MatriculaDAO(conexao);
        return matriculaDAO.consultar(termo,conexao);
    }


}