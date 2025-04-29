import MateriaDAO from "../Persistencia/materiaDAO.js";

export default class Materia{
    
    #id;
    #nome;
    #descricao;

    get id() {
        return this.#id;
    }

    set id(novoId) {
        this.#id = novoId;
    }

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

    constructor(id = "", nome = "", descricao = ""){
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
    }

    toJSON(){
        return {
            "id": this.#id,
            "nome": this.#nome,
            "descricao": this.#descricao
        }
    }

    async incluir(conexao){
        const materiaDAO = new MateriaDAO();
        await materiaDAO.incluir(this, conexao);
    }

    async consultar(termo, conexao){
        const materiaDAO = new MateriaDAO();
        return await materiaDAO.consultar(termo, conexao);
    }

    async excluir(conexao){
        const materiaDAO = new MateriaDAO();
        await materiaDAO.excluir(this, conexao);
    }

    async alterar(conexao){
        const materiaDAO = new MateriaDAO();
        await materiaDAO.alterar(this, conexao);
    }
}