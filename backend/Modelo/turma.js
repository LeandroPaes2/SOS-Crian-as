import TurmaDAO from "../Persistencia/turmaDAO.js";

export default class Turma{
    #id;
    #cor;
    #periodo;


    get id(){
        return this.#id;
    }

    set id(novoId){    
        this.#id = novoId;
    }

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

    
    constructor(id=0, cor="", periodo=""){
        this.#id=id;
        this.#cor=cor;
        this.#periodo=periodo;
    }

    toJSON(){
        return {
            "id":this.#id,
            "cor":this.#cor,
            "periodo":this.#periodo
        }
    }

    async incluir(conexao){
        const turmDAO = new TurmaDAO();
        return await turmDAO.incluir(this, conexao); 
    }

    async consultar(termo, conexao){
        const turmDAO = new TurmaDAO();
        return await turmDAO.consultar(termo, conexao);
    }

    async excluir(conexao){
        const turmDAO = new TurmaDAO();
        return await turmDAO.excluir(this, conexao);
    }

    async alterar(conexao){
        const turmDAO = new TurmaDAO();
       return await turmDAO.alterar(this, conexao);
    }
}

