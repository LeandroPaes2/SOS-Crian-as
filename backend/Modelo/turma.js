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

    async incluir() {
        const turmDAO = new TurmaDAO();
        return await turmDAO.incluir(this);
    }

    async consultar(termo) {
        const turmDAO = new TurmaDAO();
        return await turmDAO.consultar(termo);
    }

    async excluir() {
        const turmDAO = new TurmaDAO();
        return await turmDAO.excluir(this);
    }

    async alterar() {
        const turmDAO = new TurmaDAO();
        return await turmDAO.alterar(this);
    }
}

