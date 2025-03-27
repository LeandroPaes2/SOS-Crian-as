import FuncionarioDAO from "../Persistencia/funcionarioDAO.js";
export default class Funcionario{
    //atributos privados
    #codigo;
    #nome;
    #cpf;
    #cargo;
    #nivel;

    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo=novoCodigo;
    } 

    get nome(){
        return this.#nome;
    }

    set nome(novaDescricao){
        this.#nome = novaDescricao;
    }

    get cpf(){
        return this.#cpf;
    }

    set cpf(novoCPF){
        this.#cpf = novoCPF;
    }

    get cargo(){
        return this.#cargo;
    }

    set cargo(novoCargo){
        this.#cargo = novoCargo;
    }

    get nivel(){
        return this.#nivel;
    }

    set nivel(novaNivel){
        this.#nivel = novaNivel;
    }

    //construtor (criador de um funcionario)
    constructor(codigo=0, nome="", cpf="", cargo="", nivel=""){
        this.#codigo=codigo;
        this.#nome=nome;
        this.#cpf=cpf;
        this.#cargo=cargo;
        this.#nivel=nivel;
    }

    //override do método toJSON
    //o método toJSON é chamado automaticamente quando um funcionario
    //precisar ser convertido no formato JSON
    toJSON(){
        return {
            "codigo":this.#codigo,
            "nome":this.#nome,
            "cpf":this.#cpf,
            "cargo":this.#cargo,
            "nivel":this.#nivel
        }
    }

    async gravar(){
        //instanciar a camada de persistencia do funcionario
        const funcDAO = new FuncionarioDAO();
        await funcDAO.gravar(this); //this referência a si mesmo
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