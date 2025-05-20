import EventoDAO from "../Persistencia/eventoDAO.js";

export default class Evento{
    //atributos privados
    #id;
    #nome;
    #data;
    #periodo;
    #horaInicio;
    #horaFim;

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

    get data(){
        return this.#data
    }

    set data(novoData){
        this.#data = novoData;
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


    constructor(id=0, nome="", data="", periodo="", horaInicio="", horaFim=""){
        this.#id = id;
        this.#nome=nome;
        this.#data = data;
        this.#periodo=periodo;
        this.#horaInicio=horaInicio;
        this.#horaFim=horaFim;
    }

    toJSON(){
        return {
            "id":this.#id,
            "nome":this.#nome,
            "data":this.#data,
            "periodo":this.#periodo,
            "horaInicio":this.#horaInicio,
            "horaFim":this.#horaFim
        }
    }

    async incluir(conexao){
        const eveDAO = new EventoDAO();
        await eveDAO.incluir(this, conexao);
    }

    async consultar(termo, conexao){
        const eveDAO = new EventoDAO();
        return await eveDAO.consultar(termo, conexao);
    }

    async excluir(conexao){
        const eveDAO = new EventoDAO();
        await eveDAO.excluir(this, conexao);
    }

    async alterar(conexao){
        const eveDAO = new EventoDAO();
        await eveDAO.alterar(this, conexao);
    }
}

