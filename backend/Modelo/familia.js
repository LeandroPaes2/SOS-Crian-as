import FamiliaDAO from "../Persistencia/familiaDAO.js";

export default class Familia {

    #id
    #nome
    #sexo
    #dataNascimento
    #grauParentesco
    #profissao
    #escolaridade
    #irmaos
    #temContato

    get id() {
        return this.#id;
    }

    set id(novoId) {
        this.#id = novoId;
    }

    get grauParentesco() {
        return this.#grauParentesco;
    }

    set grauParentesco(novoGrau) {
        this.#grauParentesco = novoGrau;
    }

    get irmaos() {
        return this.#irmaos;
    }

    set irmaos(novosIrmaos) {
        this.#irmaos = novosIrmaos;
    }

    get temContato() {
        return this.#temContato;
    }

    set temContato(novoTemContato) {
        this.#temContato = novoTemContato;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get sexo() {
        return this.#sexo; 
    }

    set sexo(novoSexo) {
        this.#sexo = novoSexo;
    }

    get dataNascimento() {
        return this.#dataNascimento;
    }

    set dataNascimento(novaDataNascimento) {
        this.#dataNascimento = novaDataNascimento;
    }

    get profissao() {
        return this.#profissao;
    }

    set profissao(novoProfissao) {
        this.#profissao = novoProfissao;
    }

    get escolaridade() {
        return this.#escolaridade;
    }

    set escolaridade(novoEscolaridade) {
        this.#escolaridade = novoEscolaridade;
    }

    constructor(id = 0, nome = "", sexo = "", dataNascimento = "", profissao = "", escolaridade = "", grauParentesco = "", irmaos = "", temContato = "") {
        this.#id = id;
        this.#nome = nome;
        this.sexo = sexo;
        this.#dataNascimento = dataNascimento;
        this.#profissao = profissao;
        this.#escolaridade = escolaridade;
        this.#grauParentesco = grauParentesco;
        this.#irmaos = irmaos;
        this.#temContato = temContato;
    }

    toJSON() {
        return {
            "id": this.#id,
            "nome": this.#nome,
            "sexo": this.sexo,
            "dataNascimento": this.#dataNascimento,
            "profissao": this.#profissao,
            "escolaridade": this.#escolaridade,
            "grauParentesco": this.#grauParentesco,
            "irmaos": this.#irmaos,
            "temContato": this.#temContato
        }
    }

    async incluir(conexao) {
        const familiaDAO = new FamiliaDAO();
        return await familiaDAO.incluir(this, conexao);
    }

    async alterar(conexao) {
        const familiaDAO = new FamiliaDAO();
        return await familiaDAO.alterar(this, conexao);
    }

    async excluir(conexao) {
        const familiaDAO = new FamiliaDAO();
        return await familiaDAO.excluir(this, conexao);
    }

    async consultar(termo, conexao) {
        const familiaDAO = new FamiliaDAO();
        return await familiaDAO.consultar(termo, conexao);
    }
}