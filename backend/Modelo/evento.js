import EventoDAO from "../Persistencia/eventoDAO.js";

export default class Evento{
    //atributos privados
    #id;
    #nome;
    #tipoEvento;
    #dataInicio;
    #dataFim;
    #periodo;
    #horaInicio;
    #horaFim;
    #listaTurmas
    #listaFuncionario

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome=novoNome;
    }

    get tipoEvento(){
        return this.#tipoEvento;
    }

    set tipoEvento(novoTipo){
        this.#tipoEvento=novoTipo;
    }

    get dataInicio(){
        return this.#dataInicio;
    }

    set dataInicio(novoData){
        this.#dataInicio = novoData;
    }

    get dataFim(){
        return this.#dataFim;
    }

    set dataFim(novaData){
        this.#dataFim=novaData;
    }

    get periodo(){
        return this.#periodo
    }

    set periodo(novoPeriodo){
        this.#periodo = novoPeriodo;
    }

    get horaInicio(){
        return this.#horaInicio
    }

    set horaInicio(novoHoraInicio){
        this.#horaInicio = novoHoraInicio;
    }

    get horaFim(){
        return this.#horaFim
    }

    set horaFim(novoHoraFim){
        this.#horaFim = novoHoraFim;
    }

    get listaTurmas(){
        return this.#listaTurmas
    }

    set listaTurmas(novaLista){
        this.#listaTurmas = novaLista
    }

    get listaFuncionario(){
        return this.#listaFuncionario
    }

    set listaFuncionario(novaListaF){
        this.#listaFuncionario = novaListaF
    }

    constructor(id=0, nome="", tipoEvento="", dataInicio="", dataFim="", periodo="", horaInicio="", horaFim="", listaTurmas=[], listaFuncionario=[]){
        this.#id = id;
        this.#nome=nome;
        this.#tipoEvento=tipoEvento;
        this.#dataInicio = dataInicio;
        this.#dataFim=dataFim;
        this.#periodo=periodo;
        this.#horaInicio=horaInicio;
        this.#horaFim=horaFim;
        this.#listaTurmas=listaTurmas;
        this.#listaFuncionario = listaFuncionario;
    }

    toJSON(){
        return {
            "id":this.#id,
            "nome":this.#nome,
            "tipoEvento": this.#tipoEvento,
            "dataInicio":this.#dataInicio,
            "dataFim":this.#dataFim,
            "periodo":this.#periodo,
            "horaInicio":this.#horaInicio,
            "horaFim":this.#horaFim,
            "listaTurmas":this.#listaTurmas,
            "listaFuncionario": this.#listaFuncionario
        }
    }

    async incluir(conexao){
        const eveDAO = new EventoDAO();
        return await eveDAO.incluir(this, conexao);
    }

    async consultar(termo, conexao){
        const eveDAO = new EventoDAO();
        return await eveDAO.consultar(termo, conexao);
    }

    async excluir(conexao){
        const eveDAO = new EventoDAO();
        return await eveDAO.excluir(this, conexao);
    }

    async alterar(conexao){
        const eveDAO = new EventoDAO();
        return await eveDAO.alterar(this, conexao);
    }
}

