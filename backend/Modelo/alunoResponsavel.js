
import AlunoResponsavelDAO from "../Persistencia/alunoResponsavelDAO.js";
import Aluno from "./aluno.js";
import Responsavel from "./responsavel.js";

export default class AlunoResponsavel{

    #aluno
    #responsavel

    get aluno(){
        return this.#aluno?  this.#aluno: null;
    }

    set aluno(novoAluno){
        if(novoAluno instanceof Aluno){
            this.#aluno = novoAluno;
        }
    }

    get responsavel(){
        return this.#responsavel? this.#responsavel: null
    }

    set responsavel(novoResp){
        if(novoResp instanceof Responsavel){
            this.#responsavel = novoResp;
        }
    }

    constructor(aluno = {}, responsavel = {}) {
        this.#aluno = aluno;
        this.#responsavel = responsavel;
    }

    toJSON() {
        return {
            aluno: this.#aluno,
            responsavel: this.#responsavel
        };
    }

    async incluir(conexao) {
            const alunoResponsavelDAO = new AlunoResponsavelDAO();
            return alunoResponsavelDAO.incluir(this, conexao);
        }
    
    
        /*async alterar(conexao) {
            const alunoResponsavelDAO = new AlunoResponsavelDAO();
             return alunoResponsavelDAO.alterar(this, conexao);
        }*/
    
    
        async excluir(conexao) {
            const alunoResponsavelDAO = new AlunoResponsavelDAO();
           return alunoResponsavelDAO.excluir(this, conexao);
        }
    
    
        async consultar(termo, conexao) {
            const alunoResponsavelDAO = new AlunoResponsavelDAO();
            return alunoResponsavelDAO.consultar(termo, conexao);
        }

}