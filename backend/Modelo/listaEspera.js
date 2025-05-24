import Aluno from "./aluno.js";
import ListaEsperaDAO from "../Persistencia/listaEsperaDAO.js";

export default class ListaEspera {
    #num;
    #id;
    #aluno;
    #dataInsercao;
    #cor;
    #status;

    constructor(num=0, id=0, aluno={}, dataInsercao="", cor = "", status=0) {
        this.#num = num;
        this.#id = id;
        this.#aluno = aluno;
        this.#dataInsercao = dataInsercao;
        this.#cor = cor;
        this.#status = status;
    }

    get num() { return this.#num; }
    set num(valor) { this.#num = valor; }

    get id() { return this.#id; }
    set id(valor) { this.#id = valor; }

    get aluno() { return this.#aluno; }
    set aluno(novoAluno) {
        if(novoAluno instanceof Aluno)
            this.#aluno = novoAluno;
        }

    get dataInsercao() { return this.#dataInsercao; }
    set dataInsercao(valor) { this.#dataInsercao = valor; }

    get cor() { return this.#cor; }
    set cor(valor) { this.#cor = valor; }

    get status() { return this.#status; }
    set status(valor) { this.#status = valor; }



    toJSON() {
        return {
            num: this.#num,
            id: this.#id,
            aluno: this.#aluno.toJSON(),
            dataInsercao: this.#dataInsercao,
            cor: this.#cor,
            status: this.#status
        };
    }

    async incluir(conexao) {
        const dao = new ListaEsperaDAO();
      return  await dao.incluir(this,conexao);
    }

    async alterar(conexao) {
        const dao = new ListaEsperaDAO();
       return await dao.alterar(this,conexao);
    }

    async excluir(conexao) {
        const dao = new ListaEsperaDAO();
       return await dao.excluir(this,conexao);
    }

   async consultar(termo, conexao){
           const dao = new ListaEsperaDAO();
           return await dao.consultar(termo, conexao);
    }

}