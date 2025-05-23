import AlunoDAO from "../Persistencia/alunoDAO.js";
import Responsavel from "./responsavel.js";
import Escola from "./escola.js";

export default class Aluno {
    #id;
    #nome;
    #dataNascimento;
    #responsavel;
    #cidade;
    #rua;
    #bairro;
    #numero;
    #escola;
    #telefone;
    #periodoEscola;
    #realizaAcompanhamento;
    #possuiSindrome;
    #descricao;
    #rg;
    #status; // 0 para desligado 1 para ativo
    #periodoProjeto;
    #cep;

    constructor(id = 0, nome = "", dataNascimento = "", responsavel = {}, cidade = "" ,rua = "",bairro = "" ,numero = "", escola = {}, telefone = "", periodoEscola = "", realizaAcompanhamento = "", possuiSindrome = "", descricao = "", rg = "", status = 0, periodoProjeto = "",cep="") {
        this.#id = id;
        this.#nome = nome;
        this.#dataNascimento = dataNascimento;
        this.#responsavel = responsavel;
        this.#cidade = cidade;
        this.#rua = rua;
        this.#bairro = bairro
        this.#numero = numero;
        this.#escola = escola;
        this.#telefone = telefone;
        this.#periodoEscola = periodoEscola;
        this.#realizaAcompanhamento = realizaAcompanhamento;
        this.#possuiSindrome = possuiSindrome;
        this.#descricao = descricao;
        this.#rg = rg;
        this.#status = status;
        this.#periodoProjeto = periodoProjeto;
        this.#cep = cep;
    }

    get id() { return this.#id; }
    set id(novoId) { this.#id = novoId; }


    get nome() { return this.#nome; }
    set nome(novoNome) { this.#nome = novoNome; }


    get dataNascimento() { return this.#dataNascimento; }
    set dataNascimento(novoDataNascimento) { this.#dataNascimento = novoDataNascimento; }


    get responsavel() { 

        return this.#responsavel? this.#responsavel.toJSON(): null; 
    
    }
    set responsavel(novoResponsavel) {
        if (novoResponsavel instanceof Responsavel)
            this.#responsavel = novoResponsavel;
    }


    get cidade() { return this.#cidade; }
    set cidade(novaCidade) { this.#cidade = novaCidade; }

    get rua() { return this.#rua; }
    set rua(novoRua) { this.#rua = novoRua; }


    get bairro() { return this.#bairro; }
    set bairro(novoBairro) { this.#bairro = novoBairro; }


    get numero() { return this.#numero; }
    set numero(novoNumero) { this.#numero = novoNumero; }


    get escola() {
          return this.#escola ?  this.#escola.toJSON() : null; 
        }
    set escola(novaEscola) {
        if (novaEscola instanceof Escola)
            this.#escola = novaEscola;
    }

    get telefone() { return this.#telefone; }
    set telefone(novoTelefone) { this.#telefone = novoTelefone; }


    get periodoEscola() { return this.#periodoEscola; }
    set periodoEscola(novoPeriodoEscola) { this.#periodoEscola = novoPeriodoEscola; }


    get realizaAcompanhamento() { return this.#realizaAcompanhamento; }
    set realizaAcompanhamento(novoRealizaAcompanhamento) { this.#realizaAcompanhamento = novoRealizaAcompanhamento; }


    get possuiSindrome() { return this.#possuiSindrome; }
    set possuiSindrome(novoPossuiSindrome) { this.#possuiSindrome = novoPossuiSindrome; }


    get descricao() { return this.#descricao; }
    set descricao(novaDescricao) { this.#descricao = novaDescricao; }

    get rg() { return this.#rg; }
    set rg(novoRg) { this.#rg = novoRg; }

    get status() { return this.#status; }
    set status(novoStatus) { this.#status = novoStatus; }


    get periodoProjeto() { return this.#periodoProjeto; }
    set periodoProjeto(novoperiodoProjeto) { this.#periodoProjeto = novoperiodoProjeto; }

    get cep() { return this.#cep; }
    set cep(novoCep) { this.#cep = novoCep; }


    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            dataNascimento: this.#dataNascimento,
            responsavel: this.#responsavel,
            cidade: this.#cidade,
            rua: this.#rua,
            bairro: this.#bairro,
            numero: this.#numero,
            escola: this.#escola ,
            telefone: this.#telefone,
            periodoEscola: this.#periodoEscola,
            realizaAcompanhamento: this.#realizaAcompanhamento,
            possuiSindrome: this.#possuiSindrome,
            descricao: this.#descricao,
            rg: this.#rg,
            status: this.#status,
            periodoProjeto: this.#periodoProjeto,
            cep: this.#cep
        };
    }


    async incluir(conexao) {
        const alunoDAO = new AlunoDAO();
        return alunoDAO.incluir(this, conexao);
    }


    async alterar(conexao) {
        const alunoDAO = new AlunoDAO();
         return alunoDAO.alterar(this, conexao);
    }


    async excluir(conexao) {
        const alunoDAO = new AlunoDAO();
       return alunoDAO.excluir(this, conexao);
    }


    async consultar(termo, tipo, conexao) {
        const alunoDAO = new AlunoDAO();
        return alunoDAO.consultar(termo, tipo, conexao);
    }



}
