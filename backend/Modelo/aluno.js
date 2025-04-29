import AlunoDAO from "../Persistencia/alunoDAO.js";

export default class Aluno {
    #id;
    #nome;
    #dataNascimento;
    #responsavel;
    #rua;
    #bairro
    #numero;
    #escola;
    #telefone;
    #periodoEscola;
    #realizaAcompanhamento;
    #possuiSindrome;
    #descricao;
    #dataInsercaoListaEspera;
    #rg
    #formularioSaude;
    #ficha;
    #dataInsercaoProjeto;
    #status;
    #periodoProjeto;
    #cep;

    constructor(id = 0, nome = "", dataNascimento = "", responsavel = {}, rua = "",bairro = "" ,numero = "", escola = {}, telefone = "", periodoEscola = "", realizaAcompanhamento = "", possuiSindrome = "", descricao = "", dataInsercao = "", rg = "", formularioSaude = {}, ficha = {}, dataInsercaoProjeto = "", status = "", periodoProjeto = "") {
        this.#id = id;
        this.#nome = nome;
        this.#dataNascimento = dataNascimento;
        this.#responsavel = responsavel;
        this.#rua = rua;
        this.#bairro = bairro
        this.#numero = numero;
        this.#escola = escola;
        this.#telefone = telefone;
        this.#periodoEscola = periodoEscola;
        this.#realizaAcompanhamento = realizaAcompanhamento;
        this.#possuiSindrome = possuiSindrome;
        this.#descricao = descricao;
        this.#dataInsercaoListaEspera = dataInsercao;
        this.#rg = rg;
        this.#formularioSaude = formularioSaude;
        this.#ficha = ficha;
        this.#dataInsercaoProjeto = dataInsercaoProjeto;
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


    get responsavel() { return this.#responsavel.toJSON(); }
    set responsavel(novoResponsavel) {
        if (novoResponsavel instanceof Responsavel)
            this.#responsavel = novoResponsavel;
    }


    get rua() { return this.#rua; }
    set rua(novoRua) { this.#rua = novoRua; }


    get bairro() { return this.#bairro; }
    set bairro(novoBairro) { this.#bairro = novoBairro; }


    get numero() { return this.#numero; }
    set numero(novoNumero) { this.#numero = novoNumero; }


    get escola() { return this.#escola.toJSON(); }
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


    get dataInsercaoListaEspera() { return this.#dataInsercaoListaEspera; }
    set dataInsercaoListaEspera(novoDataInsercaoListaEspera) { this.#dataInsercaoListaEspera = novoDataInsercaoListaEspera; }

    get rg() { return this.#rg; }
    set rg(novoRg) { this.#rg = novoRg; }


    get formularioSaude() { return this.#formularioSaude.toJSON(); }
    set formularioSaude(novoFormularioSaude) { 

        this.#formularioSaude = novoFormularioSaude;

        /*
        if(novoFormularioSaude instanceof FormularioSaude)
        this.#formularioSaude = novoFormularioSaude;*/
    
    
    }


    get ficha() { return this.#ficha.toJSON(); }     /// ainda nn existe
    set ficha(novoFicha) { 
        this.#ficha = novoFicha; 

        /*
        if(novoFicha instanceof Ficha)
            this.#ficha = novoFicha; 
        */
    }


    get dataInsercaoProjeto() { return this.#dataInsercaoProjeto; }
    set dataInsercaoProjeto(novoDataInsercaoProjeto) { this.#dataInsercaoProjeto = novoDataInsercaoProjeto; }


    get status() { return this.#status; }
    set status(novoStatus) { this.#status = novoStatus; }


    get periodoProjeto() { return this.#periodoProjeto; }
    set periodoProjeto(novoperiodoProjeto) { this.#periodoProjeto = novoperiodoProjeto; }

    get cep() { return this.#cep; }
    set cep(novoCep) { this.#cep = novoCep; }


    toJSON() {
        return {
            id: this.getid(),
            nome: this.getnome(),
            dataNascimento: this.getdataNascimento(),
            responsavel: this.getresponsavel().toJSON(),
            rua: this.getrua(),
            numero: this.getnumero(),
            escola: this.getescola().toJSON(),
            telefone: this.gettelefone(),
            periodoEscola: this.getperiodoEscola(),
            realizaAcompanhamento: this.getrealizaAcompanhamento(),
            possuiSindrome: this.getpossuiSindrome(),
            descricao: this.getdescricao(),
            dataInsercao: this.getdataInsercao(),
            rg: this.#rg,
            formularioSaude: this.#formularioSaude,
            ficha: this.#ficha,
            dataInsercaoProjeto: this.#dataInsercaoProjeto,
            status: this.#status,
            periodoProjeto: this.#periodoProjeto
        };
    }


    incluir(conexao) {
        const alunoDAO = new AlunoDAO();
        alunoDAO.incluir(this, conexao);
    }


    alterar(conexao) {
        const alunoDAO = new AlunoDAO();
        alunoDAO.alterar(this, conexao);
    }


    excluir(conexao) {
        const alunoDAO = new AlunoDAO();
        alunoDAO.excluir(this, conexao);
    }


    consultar(termo, tipo, conexao) {
        const alunoDAO = new AlunoDAO();
        return alunoDAO.consultar(termo, tipo, conexao);
    }

}
