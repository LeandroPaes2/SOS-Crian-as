import FuncionarioDAO from "../Persistencia/funcionarioDAO.js";

export default class Funcionario{
    //atributos privados
    #nome;
    #cpf;
    #cargo;
    #nivel;


    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome = novoNome;
    }

    get cpf(){
        return this.#cpf;
    }

    set cpf(novoCPF){
        this.#cpf=novoCPF;
    }

    get cargo(){
        return this.#cargo;
    }

    set cargo(novoCargo){
        this.#cargo=novoCargo;
    }

    get nivel(){
        return this.#nivel;
    }

    set nivel(novoNivel){
        this.#nivel=novoNivel;
    }

    //construtor (criador de um produto)
    constructor(nome="", cpf="", cargo="", nivel=""){
        this.#nome=nome;
        this.#cpf=cpf;
        this.#cargo = cargo;
        this.#nivel = nivel;
    }

    //override do método toJSON
    //o método toJSON é chamado automaticamente quando um produto
    //precisar ser convertido no formato JSON
    toJSON(){
        return {
            "nome":this.#nome,
            "cpf":this.#cpf,
            "cargo":this.#cargo,
            "nivel":this.#nivel
        }
    }

    async incluir(){
        //instanciar a camada de persistencia do produto
        const funcDAO = new FuncionarioDAO();
        await funcDAO.incluir(this); //this referência a si mesmo
    }

    async consultar(termo){
        const funcDAO = new FuncionarioDAO();
        return await funcDAO.consultar(termo);
    }

    async excluir(){
        const funcDAO = new FuncionarioDAO();
        await funcDAO.excluir(this);
    }

    async alterar(){
        const funcDAO = new FuncionarioDAO();
        await funcDAO.alterar(this);
    }
}

