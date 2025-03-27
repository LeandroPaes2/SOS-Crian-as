import MateriaDAO from "../Persistencia/materiaDAO.js";

export default class Materia{
    
    #nome;
    #descricao;


    get nome(){
        return this.#nome;
    }

    set nome(novonome){
        this.#nome = novonome;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novadescricao){
        this.#descricao=novadescricao;
    }

    constructor(nome="", descricao=""){
        this.#nome=nome;
        this.#descricao=descricao;
    }

    toJSON(){
        return {
            "nome":this.#nome,
            "descricao":this.#descricao
        }
    }

    async incluir(){
        const materiaDAO = new MateriaDAO();
        await materiaDAO.incluir(this);
    }

    async consultar(termo){
        const materiaDAO = new MateriaDAO();
        return await materiaDAO.consultar(termo);
    }

    async excluir(){
        const materiaDAO = new MateriaDAO();
        await materiaDAO.excluir(this);
    }

    async alterar(){
        const materiaDAO = new MateriaDAO();
        await materiaDAO.alterar(this);
    }
}