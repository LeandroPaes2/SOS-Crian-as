import ResponsavelDAO from "../Persistencia/responsavelDAO.js";

export default class Responsavel{
    //atributos privados
    #cpf;
    #nome;
    #telefone


    get cpf(){
        return this.#cpf;
    }

    set cpf(novoCpf){
        this.#cpf = novoCpf;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome=novoNome;
    }

    get telefone(){
        return this.#telefone
    }

    set telefone(novoTelefone){
        this.#telefone = novoTelefone;
    }

    constructor(cpf="", nome="", telefone=""){
        this.#cpf=cpf;
        this.#nome=nome;
        this.#telefone=telefone;
    }

    toJSON(){
        return {
            "cpf":this.#cpf,
            "nome":this.#nome,
            "telefone":this.#telefone
        }
    }

    async incluir(conexao){
        const respDAO = new ResponsavelDAO();
        await respDAO.incluir(this, conexao);
    }

    async consultar(termo, conexao){
        const respDAO = new ResponsavelDAO();
        return await respDAO.consultar(termo, conexao);
    }

    async excluir(conexao){
        const respDAO = new ResponsavelDAO();
        await respDAO.excluir(this, conexao);
    }

    async alterar(conexao){
        const respDAO = new ResponsavelDAO();
        await respDAO.alterar(this, conexao);
    }
}