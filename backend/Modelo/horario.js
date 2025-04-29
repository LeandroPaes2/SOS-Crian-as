import HorarioDAO from "../Persistencia/horarioDAO.js"
import Turma from "./materia.js";
import Materia from "./turma.js";

export default class Horario{

    #id
    #turma
    #materia
    #hora
    #semana

    get Hora(){
        return this.#hora;
    }

    set Hora(novaHora){
        this.#hora = novaHora;
    }

    get Semana(){
        return this.#semana
    }

    set Semana(novaSemana){
        this.#semana = novaSemana;
    }

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;    
    }

    get Turma(){
        return this.#turma;
    }

    set Turma(NovaTurma){
        if(NovaTurma instanceof Turma)
            this.#turma = NovaTurma;
    }

    get Materia(){
        return this.#materia;
    }

    set Materia(NovaMateria){
        if(NovaMateria instanceof Materia)
            this.#materia = NovaMateria;
    }


    constructor(id = 0, turma = {}, materia = {}, hora = "", semana = ""){
        this.#id = id;
        this.#turma = turma;
        this.#materia = materia;
        this.#hora = hora;
        this.#semana = semana;        
    }

    JSON(){
        return{
            "id": this.#id,
            "turma": this.#turma.toJSON(),
            "materia": this.#materia.toJSON(),
            "hora": this.#hora.toJSON(),
            "semana": this.#semana.toJSON()
        }
    }


async incluir(conexao) {
    const dao = new HorarioDAO();
    return await dao.incluir(this,conexao);
}

async alterar(conexao) {
    const dao = new HorarioDAO();
    return await dao.alterar(this,conexao);
}

async excluir(conexao) {
    const dao = new HorarioDAO();
    return await dao.excluir(this,conexao);
}

async consultar(termo,conexao) {
    const dao = new HorarioDAO();
    return await dao.consultar(termo,conexao);
    }
}