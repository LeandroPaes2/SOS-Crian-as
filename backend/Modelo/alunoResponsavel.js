

export default class AlunoResponsavel{

    #aluno
    #responsavel

    get aluno(){
        return this.#aluno? this.#aluno.toJSON(): null;
    }

    set aluno(novoAluno){
        if(novoAluno instanceof Aluno){
            this.#aluno = novoAluno;
        }
    }

    get responsavel(){
        return this.#responsavel? this.#responsavel.toJSON(): null
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
    
    
        /*async consultar(termo, tipo, conexao) {
            const alunoResponsavelDAO = new AlunoResponsavelDAO();
            return alunoResponsavelDAO.consultar(termo, tipo, conexao);
        }*/

}