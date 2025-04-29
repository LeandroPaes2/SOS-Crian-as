import EscolaDAO from "../Persistencia/escolaDAO.js";

export default class Escola {
    #id
    #nome;
    #endereco;
    #telefone;
    #tipo; 


    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

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

    constructor(id = 0,nome = "", endereco = "", telefone = "", tipo = "") {
        this.#id = id;
        this.#nome = nome;
        this.#endereco = endereco;
        this.#telefone = telefone;
        this.#tipo = tipo;
    }

    toJSON() {
        return {
            "id": this.#id,
            "nome": this.#nome,
            "endereco": this.#endereco,
            "telefone": this.#telefone,
            "tipo": this.#tipo
        };
    }

    async incluir(conexao) {
        const escolaDAO = new EscolaDAO();
        return await escolaDAO.incluir(this, conexao);
    }

    async consultar(termo, conexao) {
        const escolaDAO = new EscolaDAO();
        return await escolaDAO.consultar(termo, conexao);
    }

    async excluir(conexao) {
        const escolaDAO = new EscolaDAO();
        return await escolaDAO.excluir(this, conexao);
    }

    async alterar(conexao) {
        const escolaDAO = new EscolaDAO();
        return await escolaDAO.alterar(this, conexao);
    }
}
