import FamiliaDAO from "../Persistencia/familiaDAO.js";

export default class Familia {
    
    #id
    #nome
    #sexo
    #dataNascimento
    #rg
    #cpf
    #companheiro
    #estadoCivil
    #profissao
    #situacaoTrabalho
    #escolaridade
    #rendaFamiliar
    #rendaValor
    #qtdeTrabalho
    #pensaoAlimentar
    #valorPensao
    #quemPagaPensao
    #beneficioSocial
    #qualBeneficio
    #valorBeneficio
    #nomeBeneficio



    get id() {
        return this.#id;
    }

    set id(novoId) {
        this.#id = novoId;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get sexo() {
        return this.#sexo;
    }

    set sexo(novoSexo) {
        this.#sexo = novoSexo;
    }

    get dataNascimento() {
        return this.#dataNascimento;
    }

    set dataNascimento(novaDataNascimento) {
        this.#dataNascimento = novaDataNascimento;
    }

    get rg() {
        return this.#rg;
    }

    set rg(novoRg) {
        this.#rg = novoRg;
    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(novoCpf) {
        this.#cpf = novoCpf;
    }

    get companheiro() {
        return this.#companheiro;
    }

    set companheiro(novoCompanheiro) {
        this.#companheiro = novoCompanheiro;
    }

    get estadoCivil() {
        return this.#estadoCivil;
    }

    set estadoCivil(novoEstadoCivil) {
        this.#estadoCivil = novoEstadoCivil;
    }

    get profissao() {
        return this.#profissao;
    }

    set profissao(novoProfissao) {
        this.#profissao = novoProfissao;
    }

    get situacaoTrabalho() {
        return this.#situacaoTrabalho;
    }

    set situacaoTrabalho(novoSituacaoTrabalho) {
        this.#situacaoTrabalho = novoSituacaoTrabalho;
    }

    get escolaridade() {
        return this.#escolaridade;
    }

    set escolaridade(novoEscolaridade) {
        this.#escolaridade = novoEscolaridade;
    }

    get rendaFamiliar() {
        return this.#rendaFamiliar;
    }

    set rendaFamiliar(novoRendaFamiliar) {
        this.#rendaFamiliar = novoRendaFamiliar;
    }

    get rendaValor() {
        return this.#rendaValor;
    }

    set rendaValor(novoRendaValor) {
        this.#rendaValor = novoRendaValor;
    }

    get qtdeTrabalho() {
        return this.#qtdeTrabalho;
    }

    set qtdeTrabalho(novoQtdeTrabalho) {
        this.#qtdeTrabalho = novoQtdeTrabalho;
    }

    get pensaoAlimentar() {
        return this.#pensaoAlimentar;
    }

    set pensaoAlimentar(novoPensaoAlimentar) {
        this.#pensaoAlimentar = novoPensaoAlimentar;
    }

    get valorPensao() {
        return this.#valorPensao;
    }

    set valorPensao(novoValorPensao) {
        this.#valorPensao = novoValorPensao;
    }

    get quemPagaPensao() {
        return this.#quemPagaPensao;
    }

    set quemPagaPensao(novoQuemPagaPensao) {
        this.#quemPagaPensao = novoQuemPagaPensao;
    }

    get beneficioSocial() {
        return this.#beneficioSocial;
    }

    set beneficioSocial(novoBeneficioSocial) {
        this.#beneficioSocial = novoBeneficioSocial;
    }

    get qualBeneficio() {
        return this.#qualBeneficio;
    }

    set qualBeneficio(novoQualBeneficio) {
        this.#qualBeneficio = novoQualBeneficio;
    }

    get valorBeneficio() {
        return this.#valorBeneficio;
    }

    set valorBeneficio(novoValorBeneficio) {
        this.#valorBeneficio = novoValorBeneficio;
    }

    get nomeBeneficio() {
        return this.#nomeBeneficio;
    }

    set nomeBeneficio(novoNomeBeneficio) {
        this.#nomeBeneficio = novoNomeBeneficio;
    }

    constructor(id=0, nome="", sexo="", dataNascimento="", rg="", cpf="", companheiro="", estadoCivil="", profissao="", situacaoTrabalho="", escolaridade="", rendaFamiliar="", rendaValor="", qtdeTrabalho="", pensaoAlimentar="", valorPensao="", quemPagaPensao="", beneficioSocial="", qualBeneficio="", valorBeneficio="", nomeBeneficio="") {
        this.#id = id;
        this.#nome = nome;
        this.sexo = sexo;
        this.#dataNascimento = dataNascimento;
        this.#rg = rg;
        this.#cpf = cpf;
        this.#companheiro = companheiro;
        this.#estadoCivil = estadoCivil;
        this.#profissao = profissao;
        this.#situacaoTrabalho = situacaoTrabalho;
        this.#escolaridade = escolaridade;
        this.#rendaFamiliar = rendaFamiliar;
        this.#rendaValor = rendaValor;
        this.#qtdeTrabalho = qtdeTrabalho;
        this.#pensaoAlimentar = pensaoAlimentar;
        this.#valorPensao = valorPensao;
        this.#quemPagaPensao = quemPagaPensao;
        this.#beneficioSocial = beneficioSocial;
        this.#qualBeneficio = qualBeneficio;
        this.#valorBeneficio = valorBeneficio;
        this.#nomeBeneficio = nomeBeneficio;

    }

    toJSON(){
        return{
            "id": this.#id,
            "nome": this.#nome,
            "sexo": this.sexo,
            "dataNascimento": this.#dataNascimento,
            "rg": this.#rg,
            "cpf": this.#cpf,
            "companheiro": this.#companheiro,
            "estadoCivil": this.#estadoCivil,
            "profissao": this.#profissao,
            "situacaoTrabalho": this.#situacaoTrabalho,
            "escolaridade": this.#escolaridade,
            "rendaFamiliar": this.#rendaFamiliar,
            "rendaValor": this.#rendaValor,
            "qtdeTrabalho": this.#qtdeTrabalho,
            "pensaoAlimentar": this.#pensaoAlimentar,
            "valorPensao": this.#valorPensao,
            "quemPagaPensao": this.#quemPagaPensao,
            "beneficioSocial": this.#beneficioSocial,
            "qualBeneficio": this.#qualBeneficio,
            "valorBeneficio": this.#valorBeneficio,
            "nomeBeneficio": this.#nomeBeneficio
        }
    }

    async incluir(conexao) {
        const familiaDAO = new FamiliaDAO();
        return await familiaDAO.incluir(this, conexao);
    }

    async alterar(conexao) {
        const familiaDAO = new FamiliaDAO();
        return await familiaDAO.alterar(this, conexao);
    }

    async excluir(conexao) {
        const familiaDAO = new FamiliaDAO();
        return await familiaDAO.excluir(this, conexao);
    }

    async consultar(termo, conexao) {
        const familiaDAO = new FamiliaDAO();
        return await familiaDAO.consultar(termo, conexao);
    }
}