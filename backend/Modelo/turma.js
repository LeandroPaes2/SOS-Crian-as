import TurmaDAO from "../Persistencia/turmaDAO.js";
import Aluno from "./aluno.js";

export default class Turma{
    //atributos privados
    #cor;
    #periodo;
    //#aluno


    get cor(){
        return this.#cor;
    }

    set cor(novaCor){
        this.#cor = novaCor;
    }

    get periodo(){
        return this.#periodo;
    }

    set periodo(novoPeriodo){
        this.#periodo=novoPeriodo;
    }

    /*get categoria(){
        return this.#aluno
    }

    set categoria(novaCategoria){
        if (novoAluno instanceof Aluno){
            this.#aluno = novoAluno;
        }
    }*/

    //construtor (criador de um produto)
    constructor(cor="", periodo=""){
        this.#cor=cor;
        this.#periodo=periodo;
    }

    //override do método toJSON
    //o método toJSON é chamado automaticamente quando um produto
    //precisar ser convertido no formato JSON
    toJSON(){
        return {
            "cor":this.#cor,
            "periodo":this.#periodo
        }
    }

    async incluir(){
        //instanciar a camada de persistencia do produto
        const turmDAO = new TurmaDAO();
        await turmDAO.incluir(this); //this referência a si mesmo
    }

    async consultar(termo){
        const turmDAO = new TurmaDAO();
        return await turmDAO.consultar(termo);
    }

    async excluir(){
        const turmDAO = new TurmaDAO();
        await turmDAO.excluir(this);
    }

    async alterar(){
        const turmDAO = new TurmaDAO();
        await turmDAO.alterar(this);
    }
}

