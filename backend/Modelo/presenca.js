import PresencaDAO from "../Persistencia/presencaDAO.js";
import Materia from "./materia.js";
import Turma from "./turma.js";

export default class Presenca{
    #id;
    #dataHora;
    #materia;
    #turma;
    #alunosPresentes;

    get id() { return this.#id; }
    set id(novoId) { this.#id = novoId; }

    get dataHora() { return this.#dataHora; }
    set dataHora(novaData) { this.#dataHora = novaData; }

    get materia() { return this.#materia; }
    set materia(novaMateria) { 
        if(novaMateria instanceof Materia)
            this.#materia = novaMateria; 
    }

    get turma() { return this.#turma; }
    set turma(novaTurma) { 
        if(novaTurma instanceof Turma)
            this.#turma = novaTurma;
    }

    get alunosPresentes() { return this.#alunosPresentes; }
    set alunosPresentes(novosAlunos) { this.#alunosPresentes = novosAlunos; }

    constructor(id=0, dataHora=new Date(), materia=new Materia, turma=new Turma, alunosPresentes=[])
    {
        this.#id = id;
        this.#dataHora = dataHora;
        this.#materia = materia;
        this.#turma = turma;
        this.#alunosPresentes = alunosPresentes;
    }

    toJSON()
    {
        return {
            "id": this.#id,
            "dataHora": this.#dataHora,
            "materia": this.#materia.toJSON(),
            "turma": this.#turma.toJSON(),
            "alunosPresentes": this.#alunosPresentes.map(ap => ({
                "aluno": ap.aluno.toJSON(),
                "presente": ap.presente
            }))
        }
    }

    async gravar(supabase) {
        const presencaDAO = new PresencaDAO();
        await presencaDAO.incluir(this, supabase);
    }

    async consultar(supabase) {
        const presencaDAO = new PresencaDAO();
        return await presencaDAO.consultar(supabase);
    }

    async consultarTurmasPorMateria(materiaId, supabase){
        const presencaDAO = new PresencaDAO();
        return await presencaDAO.consultarTurmasPorMateria(materiaId, supabase);
    }

    async consultarPorId(supabase) {
        const presencaDAO = new PresencaDAO();
        return await presencaDAO.consultarPorId(this.id, supabase);
    }
    
    async alterar(supabase) {
        const presencaDAO = new PresencaDAO();
        await presencaDAO.alterar(this, supabase);
    }

    async excluir(supabase) {
        const presencaDAO = new PresencaDAO();
        await presencaDAO.excluir(this, supabase);
    }

}