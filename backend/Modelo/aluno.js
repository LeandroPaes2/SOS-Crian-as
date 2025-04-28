import AlunoDAO from "../Persistencia/alunoDAO.js";

import ListaEspera from "./listaEspera.js";

export default class Aluno extends ListaEspera {
    #rg
    #formularioSaude;
    #ficha;
    #dataInclusaoProjeto;
    #status;
    #PeriodoProjeto;
    #cep;

    constructor(id=0, nome="", dataNascimento="", responsavel={},rua="",numero="", escola={} ,telefone="",periodoEscola="", realizaAcompanhamento="", possuiSindrome="", descricao="", dataInsercao="",rg="" ,formularioSaude={}, ficha={}, dataInclusaoProjeto="", status="", PeriodoProjeto="") {
       super(id, nome, dataNascimento, responsavel, rua, numero, escola, telefone, periodoEscola, realizaAcompanhamento, possuiSindrome, descricao, dataInsercao);
       this.#rg = rg;
       this.#formularioSaude = formularioSaude;
       this.#ficha = ficha;
       this.#dataInclusaoProjeto = dataInclusaoProjeto;
       this.#status = status;
       this.#PeriodoProjeto = PeriodoProjeto;
    }

    get rg() { return this.#rg; } // get privado
    set rg(novoRg) { this.#rg = novoRg; } // set privado


    get formularioSaude() { return this.#formularioSaude; } // get privado
    set formularioSaude(novoFormularioSaude) { this.#formularioSaude = novoFormularioSaude; } // set privado


    get ficha() { return this.#ficha; } // get privado
    set ficha(novoFicha) { this.#ficha = novoFicha; } // set privado


    get dataInclusaoProjeto() { return this.#dataInclusaoProjeto; } // get privado
    set dataInclusaoProjeto(novoDataInclusaoProjeto) { this.#dataInclusaoProjeto = novoDataInclusaoProjeto; } // set privado


    get status() { return this.#status; } // get privado
    set status(novoStatus) { this.#status = novoStatus; } // set privado


    get PeriodoProjeto() { return this.#PeriodoProjeto; } // get privado
    set PeriodoProjeto(novoPeriodoProjeto) { this.#PeriodoProjeto = novoPeriodoProjeto; } // set privado

  
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
            dataInclusaoProjeto: this.#dataInclusaoProjeto,
            status: this.#status,
            PeriodoProjeto: this.#PeriodoProjeto
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


    consultar(termo,tipo,conexao) {
        const alunoDAO = new AlunoDAO();
        return alunoDAO.consultar(termo,tipo,conexao);
    }

}
