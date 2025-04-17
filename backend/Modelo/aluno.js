import AlunoDAO from "../Persistencia/alunoDAO.js";
import Responsavel from "./responsavel.js";
import Escola from "./escola.js";


export default class Aluno {
    #numProtocolo;
    #nome;
    #dataNascimento;
    #responsavel;
    #rua;
    #bairro;
    #cidade;
    #cep;
    #numero;
    #escola;
    #telefone;
    #periodoProjeto;
    #periodoEscola;
    #realizaAcompanhamento;
    #possuiSindrome;
    #status;// 0  aluno Desligado 1 aluno matriculado e 2 para aluno na fila de espera;

    constructor(numProtocolo=0, nome="", dataNascimento="", responsavel={},rua="", bairro="", cidade="", cep="", numero="", escola={} ,telefone="", periodoProjeto="", periodoEscola="", realizaAcompanhamento="", possuiSindrome="",status=0) {
        this.#numProtocolo = numProtocolo;
        this.#nome = nome;
        this.#dataNascimento = dataNascimento;
        this.#responsavel = responsavel;
        this.#rua = rua;
        this.#bairro = bairro;
        this.#cidade = cidade;
        this.#cep = cep;
        this.#numero = numero;
        this.#escola = escola;
        this.#telefone = telefone;
        this.#periodoProjeto = periodoProjeto;
        this.#periodoEscola = periodoEscola;
        this.#realizaAcompanhamento = realizaAcompanhamento;
        this.#possuiSindrome = possuiSindrome;
        this.#status = status;
    }

    get numProtocolo() { return this.#numProtocolo; }
    set numProtocolo(valor) { this.#numProtocolo = valor; }

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

    get bairro() { return this.#bairro; }    
    set bairro(valor) { this.#bairro = valor; }

    get cidade() { return this.#cidade; }
    set cidade(valor) { this.#cidade = valor; }

    get cep() { return this.#cep; }
    set cep(valor) { this.#cep = valor; }

    get numero() { return this.#numero; }
    set numero(valor) { this.#numero = valor; }

    get escola() { return this.#escola; }
    set escola(novaEscola) {
        if(novaEscola instanceof Escola)
         this.#escola = novaEscola;
         }
    
    get telefone() { return this.#telefone; }
    set telefone(valor) { this.#telefone = valor; }

    get periodoProjeto() { return this.#periodoProjeto; }
    set periodoProjeto(valor) { this.#periodoProjeto = valor; }

    get periodoEscola() { return this.#periodoEscola; }
    set periodoEscola(valor) { this.#periodoEscola = valor; }

    get realizaAcompanhamento() { return this.#realizaAcompanhamento; }
    set realizaAcompanhamento(valor) { this.#realizaAcompanhamento = valor; }

    get possuiSindrome() { return this.#possuiSindrome; }
    set possuiSindrome(valor) { this.#possuiSindrome = valor; }

    get status() { return this.#status; }
    set status(valor) { this.#status = valor; }



    toJSON() {
        return {
            numProtocolo: this.#numProtocolo,
            nome: this.#nome,
            dataNascimento: this.#dataNascimento,
            responsavel: this.#responsavel.toJSON(),
            rua: this.#rua,
            bairro: this.#bairro,
            cidade: this.#cidade,
            cep: this.#cep,
            numero: this.#numero,
            escola: this.#escola.toJSON(),
            telefone: this.#telefone,
            periodoProjeto: this.#periodoProjeto,
            periodoEscola: this.#periodoEscola,
            realizaAcompanhamento: this.#realizaAcompanhamento,
            possuiSindrome: this.#possuiSindrome,
            status: this.#status
        };
    }

    async incluir(conexao) {
        const dao = new AlunoDAO();
        await dao.incluir(this,conexao);
    }

    async alterar(conexao) {
        const dao = new AlunoDAO();
        await dao.alterar(this,conexao);
    }

    async excluir(conexao) {
        const dao = new AlunoDAO();
        await dao.excluir(this,conexao);
    }

    async consultar(termo,conexao) {
        const dao = new AlunoDAO();
        return await dao.consultar(termo,conexao);
    }
}
