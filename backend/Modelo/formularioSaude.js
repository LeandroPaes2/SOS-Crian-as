import Aluno from "./aluno.js";
import ListaEsperaDAO from "../Persistencia/listaEsperaDAO.js";

export default class ListaEspera {
    #num;
    #id;
    #aluno;
    #alergia_alimentar;
    #crise_alergica_alimentar;
    #alergia_nao_alimentar;
    #crise_alergica_nao_alimentar;
    #maior_atencao;
    #crise_maior_atencao;
    #medicacao_continua;
    #quem_prescreveu;
    #plano_saude;
    #tipo_sanguineo;
    #data_insercao;
    #assitatura_responsavel;
    #status;

    constructor(num = 0, id = 0, aluno = {}, alergia_alimentar = "", crise_alergica_alimentar = "",
        alergia_nao_alimentar = "", crise_alergica_nao_alimentar = "", crise_alergica_nao_alimentar = "",
        maior_atencao = "", crise_maior_atencao="", medicacao_continua="", quem_prescreveu = "",
        plano_saude="", tipo_sanguineo="", data_insercao="", assitatura_responsavel = "",status = 0) {
        this.#num = num;
        this.#id = id;
        this.#aluno = aluno;
        this.#alergia_alimentar = alergia_alimentar;
        this.#crise_alergica_alimentar = crise_alergica_alimentar;
        this.#alergia_nao_alimentar = alergia_nao_alimentar;
        this.#crise_alergica_nao_alimentar = crise_alergica_nao_alimentar;
        this.#maior_atencao = maior_atencao;
        this.#crise_maior_atencao = crise_maior_atencao;
        this.#medicacao_continua = medicacao_continua;
        this.#quem_prescreveu = quem_prescreveu;
        this.#plano_saude = plano_saude;
        this.#tipo_sanguineo = tipo_sanguineo;
        this.#data_insercao = data_insercao;
        this.#assitatura_responsavel = assitatura_responsavel;
        this.#status = status;
    }

    get num() { return this.#num; }
    set num(valor) { this.#num = valor; }

    get id() { return this.#id; }
    set id(valor) { this.#id = valor; }

    get aluno() { return this.#aluno; }
    set aluno(novoAluno) {
        if (novoAluno instanceof Aluno)
            this.#aluno = novoAluno;
    }

    get alergia_alimentar() { return this.#alergia_alimentar; }
    set alergia_alimentar(valor) { this.#alergia_alimentar = valor; }

    get crise_alergica_alimentar() { return this.#crise_alergica_alimentar; }
    set crise_alergica_alimentar(valor) { this.#crise_alergica_alimentar = valor; }

    get alergia_nao_alimentar() { return this.#alergia_nao_alimentar; }
    set alergia_nao_alimentar(valor) { this.#alergia_nao_alimentar = valor; }

    get crise_alergica_nao_alimentar() { return this.#crise_alergica_nao_alimentar; }
    set crise_alergica_nao_alimentar(valor) { this.#crise_alergica_nao_alimentar = valor; }

    get maior_atencao() { return this.#maior_atencao; }
    set maior_atencao(valor) { this.#maior_atencao = valor; }

    get crise_maior_atencao() { return this.#crise_maior_atencao; }
    set crise_maior_atencao(valor) { this.#crise_maior_atencao = valor; }

    get medicacao_continua() { return this.#medicacao_continua; }
    set medicacao_continua(valor) { this.#medicacao_continua = valor; }

    get quem_prescreveu() { return this.#quem_prescreveu; }
    set quem_prescreveu(valor) { this.#quem_prescreveu = valor; }

    get plano_saude() { return this.#plano_saude; }
    set plano_saude(valor) { this.#plano_saude = valor; }

    get tipo_sanguineo() { return this.#tipo_sanguineo; }
    set tipo_sanguineo(valor) { this.#tipo_sanguineo = valor; }

    get data_insercao() { return this.#data_insercao; }
    set data_insercao(valor) { this.#data_insercao = valor; }

    get assitatura_responsavel() { return this.#assitatura_responsavel; }
    set assitatura_responsavel(valor) { this.#assitatura_responsavel = valor; }

    get status() { return this.#status; }
    set status(valor) { this.#status = valor; }



    toJSON() {
        return {
            num: this.#num,
            id: this.#id,
            aluno: this.#aluno.toJSON(),
            status: this.#status
        };
    }

    async incluir(conexao) {
        const dao = new ListaEsperaDAO();
        return await dao.incluir(this, conexao);
    }

    async alterar(conexao) {
        const dao = new ListaEsperaDAO();
        return await dao.alterar(this, conexao);
    }

    async excluir(conexao) {
        const dao = new ListaEsperaDAO();
        return await dao.excluir(this, conexao);
    }

    async consultar(termo, conexao) {
        const dao = new ListaEsperaDAO();
        return await dao.consultar(termo, conexao);
    }

}