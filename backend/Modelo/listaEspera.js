import Responsavel from "./responsavel.js";
import Escola from "./escola.js";
import ListaEsperaDAO from "../Persistencia/listaEsperaDAO.js";

export default class ListaEsperaDAO {
    #id;
    #nome;
    #dataNascimento;
    #responsavel;
    #rua;
    #numero;
    #escola;
    #telefone;
    #periodoEscola;
    #realizaAcompanhamento;
    #possuiSindrome;
    #descricao;
    #dataInsercao;

    constructor(id=0, nome="", dataNascimento="", responsavel={},rua="",numero="", escola={} ,telefone="",periodoEscola="", realizaAcompanhamento="", possuiSindrome="", descricao="", dataInsercao="") {
        this.#id = id;
        this.#nome = nome;
        this.#dataNascimento = dataNascimento;
        this.#responsavel = responsavel;
        this.#rua = rua;
        this.#numero = numero;
        this.#escola = escola;
        this.#telefone = telefone;
        this.#periodoEscola = periodoEscola;
        this.#realizaAcompanhamento = realizaAcompanhamento;
        this.#possuiSindrome = possuiSindrome;
        this.#descricao = descricao;
        this.#dataInsercao = dataInsercao;
    }

    get id() { return this.#id; }
    set id(valor) { this.#id = valor; }

    get nome() { return this.#nome; }
    set nome(valor) { this.#nome = valor; }

   get dataNascimento() { return this.#dataNascimento; }
    set dataNascimento(valor) { this.#dataNascimento = valor; }

    get responsavel() { return this.#responsavel; }
    set responsavel(novoResponsavel) {
        if(novoResponsavel instanceof Responsavel)
            this.#responsavel = novoResponsavel;
        }

    get rua() { return this.#rua; }
    set rua(valor) { this.#rua = valor; }

    get numero() { return this.#numero; }
    set numero(valor) { this.#numero = valor; }

    get escola() { return this.#escola; }
    set escola(novaEscola) {
        if(novaEscola instanceof Escola)
         this.#escola = novaEscola;
         }
    
    get telefone() { return this.#telefone; }
    set telefone(valor) { this.#telefone = valor; }

    get periodoEscola() { return this.#periodoEscola; }
    set periodoEscola(valor) { this.#periodoEscola = valor; }

    get realizaAcompanhamento() { return this.#realizaAcompanhamento; }
    set realizaAcompanhamento(valor) { this.#realizaAcompanhamento = valor; }

    get possuiSindrome() { return this.#possuiSindrome; }
    set possuiSindrome(valor) { this.#possuiSindrome = valor; }

    get descricao() { return this.#descricao; }
    set descricao(valor) { this.#descricao = valor; }

    get dataInsercao() { return this.#dataInsercao; }
    set dataInsercao(valor) { this.#dataInsercao = valor; }



    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            dataNascimento: this.#dataNascimento,
            responsavel: this.#responsavel.toJSON(),
            rua: this.#rua,
            numero: this.#numero,
            escola: this.#escola.toJSON(),
            telefone: this.#telefone,
            periodoEscola: this.#periodoEscola,
            realizaAcompanhamento: this.#realizaAcompanhamento,
            possuiSindrome: this.#possuiSindrome,
            descricao: this.#descricao,
            dataInsercao: this.#dataInsercao
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