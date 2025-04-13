import FuncionarioDAO from "../Persistencia/funcionarioDAO.js";

export default class Funcionario{
    //atributos privados
    #nome;
    #cpf;
    #cargo;
    #nivel;
    #email;
    #senha;

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
        this.#cargo = novoCargo;
    }

    get nivel(){
        return this.#nivel;
    }

    set nivel(novoNivel){
        this.#nivel=novoNivel;
    }

    get email(){
        return this.#email;
    }

    set email(novoEmail){
        this.#email = novoEmail;
    }

    get senha(){
        return this.#senha;
    }

    set senha(novaSenha){
        this.#senha=novaSenha;
    }


    constructor(nome="", cpf=0, cargo = "", nivel="",email="",senha=""){
        this.#nome=nome;
        this.#cpf=cpf;
        this.#cargo = cargo;
        this.#nivel=nivel;
        this.#email = email;
        this.#senha = senha;

    }

    toJSON(){
        return {
            "nome":this.#nome,
            "cpf":this.#cpf,
            "cargo":this.#cargo,
            "nivel":this.#nivel,
            "email":this.#email,
            "senha":this.#senha
        }
    }

    async incluir(){
        const funcDAO = new FuncionarioDAO();
        await funcDAO.incluir(this); 
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

