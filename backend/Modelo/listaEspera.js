import Aluno from "./aluno.js";
import ListaEsperaDAO from "../Persistencia/listaEsperaDAO.js";

export default class ListaEspera {
    #id;
    #aluno;
    #dataInsercao;
    #prioridade;
    #status;

    constructor(id=0, aluno={}, dataInsercao="", prioridade = 0, status=0) {
        this.#id = id;
        this.#aluno = aluno;
        this.#dataInsercao = dataInsercao;
        this.#prioridade = prioridade;
        this.#status = status;
    }

    get id() { return this.#id; }
    set id(valor) { this.#id = valor; }

    get aluno() { return this.#aluno; }
    set aluno(novoAluno) {
        if(novoAluno instanceof Aluno)
            this.#aluno = novoAluno;
        }

    get dataInsercao() { return this.#dataInsercao; }
    set dataInsercao(valor) { this.#dataInsercao = valor; }

    get prioridade() { return this.#prioridade; }
    set prioridade(valor) { this.#prioridade = valor; }

    get status() { return this.#status; }
    set status(valor) { this.#status = valor; }



    toJSON() {
        return {
            id: this.#id,
            aluno: this.#aluno.toJSON(),
            dataInsercao: this.#dataInsercao,
            prioridade: this.#prioridade,
            status: this.#status
        };
    }

    async incluir(conexao) {
        const dao = new ListaEsperaDAO();
        await dao.incluir(this,conexao);
    }

    async alterar(conexao) {
        const dao = new ListaEsperaDAO();
        await dao.alterar(this,conexao);
    }

    async excluir(conexao) {
        const dao = new ListaEsperaDAO();
        await dao.excluir(this,conexao);
    }

    async consultar(termo,conexao) {
        const dao = new ListaEsperaDAO();
        return await dao.consultar(termo,conexao);
    }
}