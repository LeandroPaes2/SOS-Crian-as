import AlunoDAO from "../Persistencia/alunoDAO.js";

export default class Aluno {
    #id;
    #nome;
    #idade;
    #responsavel;
    #endereco;
    #telefone;
    #periodoProjeto;
    #periodoEscola;

    constructor(nome = "", idade = "", responsavel = "", endereco = "", telefone = "", periodoProjeto = "", periodoEscola = "", id = 0) {
        this.#id = id;
        this.#nome = nome;
        this.#idade = idade;
        this.#responsavel = responsavel;
        this.#endereco = endereco;
        this.#telefone = telefone;
        this.#periodoProjeto = periodoProjeto;
        this.#periodoEscola = periodoEscola;
    }

    get id() { return this.#id; }
    set id(valor) { this.#id = valor; }

    get nome() { return this.#nome; }
    set nome(valor) { this.#nome = valor; }

    get idade() { return this.#idade; }
    set idade(valor) { this.#idade = valor; }

    get responsavel() { return this.#responsavel; }
    set responsavel(valor) { this.#responsavel = valor; }

    get endereco() { return this.#endereco; }
    set endereco(valor) { this.#endereco = valor; }

    get telefone() { return this.#telefone; }
    set telefone(valor) { this.#telefone = valor; }

    get periodoProjeto() { return this.#periodoProjeto; }
    set periodoProjeto(valor) { this.#periodoProjeto = valor; }

    get periodoEscola() { return this.#periodoEscola; }
    set periodoEscola(valor) { this.#periodoEscola = valor; }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            idade: this.#idade,
            responsavel: this.#responsavel,
            endereco: this.#endereco,
            telefone: this.#telefone,
            periodoProjeto: this.#periodoProjeto,
            periodoEscola: this.#periodoEscola
        };
    }

    async incluir() {
        const dao = new AlunoDAO();
        await dao.incluir(this);
    }

    async alterar() {
        const dao = new AlunoDAO();
        await dao.alterar(this);
    }

    async excluir() {
        const dao = new AlunoDAO();
        await dao.excluir(this);
    }

    async consultar(termo) {
        const dao = new AlunoDAO();
        return await dao.consultar(termo);
    }
}
