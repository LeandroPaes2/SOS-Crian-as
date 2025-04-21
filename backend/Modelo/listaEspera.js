import ListaEsperaDAO from "../Persistencia/listaEsperaDAO.js";


export default class ListaEspera {   
    //atributos privados
    #numProtocolo;
    #nome;
    #dataInsercao;
    #aluno;

    get numProtocolo() {
        return this.#numProtocolo;
    }

    set numProtocolo(novoNumProtocolo) {
        this.#numProtocolo = novoNumProtocolo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get dataInsercao() {
        return this.#dataInsercao;
    }

    set dataInsercao(novaData) {
        this.#dataInsercao = novaData;
    }

    get aluno() {
        return this.#aluno;
    }

    set aluno(novoAluno) {
        if (novoAluno instanceof Aluno) {
            this.#aluno = novoAluno;
        }
    }

    // Novo construtor sem id
    constructor(numProtocolo=0, nome="", dataInsercao="", aluno={}) {
        this.#numProtocolo = numProtocolo;
        this.#nome = nome;
        this.#dataInsercao = dataInsercao;
        this.#aluno = aluno;
    }

    toJSON() {
        return {
            "numProtocolo": this.#numProtocolo,
            "nome": this.#nome,
            "dataInsercao": this.#dataInsercao,
            "aluno": this.#aluno?.toJSON()
        };
    }

    async incluir(conexao) {
        const dao = new ListaEsperaDAO();
        await dao.incluir(this, conexao);
    }

    async consultar(termo, conexao) {
        const dao = new ListaEsperaDAO();
        return await dao.consultar(termo, conexao);
    }

    async excluir(conexao) {
        const dao = new ListaEsperaDAO();
        await dao.excluir(this, conexao);
    }

    async alterar(conexao) {
        const dao = new ListaEsperaDAO();
        await dao.alterar(this, conexao);
    }
}
