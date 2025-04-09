import EscolaDAO from "../Persistencia/escolaDAO.js";

export default class Escola {
    #nome;
    #endereco;
    #telefone;
    #tipo; // tipo de escola: pública, privada, filantrópica

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get endereco() {
        return this.#endereco;
    }

    set endereco(novoEndereco) {
        this.#endereco = novoEndereco;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(novoTelefone) {
        this.#telefone = novoTelefone;
    }

    get tipo() {
        return this.#tipo;
    }

    set tipo(novoTipo) {
        this.#tipo = novoTipo;
    }

    constructor(nome = "", endereco = "", telefone = "", tipo = "") {
        this.#nome = nome;
        this.#endereco = endereco;
        this.#telefone = telefone;
        this.#tipo = tipo;
    }

    toJSON() {
        return {
            "nome": this.#nome,
            "endereco": this.#endereco,
            "telefone": this.#telefone,
            "tipo": this.#tipo
        };
    }

    async incluir() {
        const escolaDAO = new EscolaDAO();
        await escolaDAO.incluir(this);
    }

    async consultar(termo) {
        const escolaDAO = new EscolaDAO();
        return await escolaDAO.consultar(termo);
    }

    async excluir() {
        const escolaDAO = new EscolaDAO();
        await escolaDAO.excluir(this);
    }

    async alterar() {
        const escolaDAO = new EscolaDAO();
        await escolaDAO.alterar(this);
    }
}
