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

    async incluir(){
        const respDAO = new ResponsavelDAO();
        await respDAO.incluir(this);
    }

    async consultar(termo){
        const respDAO = new ResponsavelDAO();
        return await respDAO.consultar(termo);
    }

    async excluir(){
        const respDAO = new ResponsavelDAO();
        await respDAO.excluir(this);
    }

    async alterar(){
        const respDAO = new ResponsavelDAO();
        await respDAO.alterar(this);
    }
}

