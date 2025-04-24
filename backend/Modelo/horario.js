import horarioDAO from "../Persistencia/horarioDAO"
import Turma from "./materia";
import Materia from "./turma";

export default class Horario{

    #turma
    #materia

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


    constructor(turma = {}, materia = {}){
        this.#turma = turma;
        this.#materia = materia;
    }

    JSON(){
        return{
            "turma": this.#turma.toJSON(),
            "materia": this.#materia.toJSON()
        }
    }


async incluir(conexao) {
    const dao = new horarioDAO();
    return await dao.incluir(this,conexao);
}

async alterar(conexao) {
    const dao = new horarioDAO();
    return await dao.alterar(this,conexao);
}

async excluir(conexao) {
    const dao = new horarioDAO();
    return await dao.excluir(this,conexao);
}

async consultar(termo,conexao) {
    const dao = new horarioDAO();
    return await dao.consultar(termo,conexao);
    }
}