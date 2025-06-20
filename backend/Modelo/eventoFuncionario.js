
import EventoFuncionarioDAO from "../Persistencia/eventoFuncionarioDAO.js";
import Evento from "./evento.js";
import Funcionario from "./funcionario.js";

export default class EventoFuncionario{

    #evento
    #funcionario

    get evento(){
        return this.#evento?  this.#evento: null;
    }

    set evento(novoEvento){
        if(novoEvento instanceof Evento){
            this.#evento = novoEvento;
        }
    }

    get funcionario(){
        return this.#funcionario? this.#funcionario: null
    }

    set funcionario(novaFuncionario){
        if(novaFuncionario instanceof Funcionario){
            this.#funcionario = novaFuncionario;
        }
    }

    constructor(evento = {}, funcionario = {}) {
        this.#evento = evento;
        this.#funcionario = funcionario;
    }

    toJSON() {
        return {
            evento: this.#evento,
            funcionario: this.#funcionario
        };
    }

    async incluir(conexao) {
            const eventoFuncionarioDAO = new EventoFuncionarioDAO();
            return eventoFuncionarioDAO.incluir(this, conexao);
        }
    
    
        /*async alterar(conexao) {
            const alunoResponsavelDAO = new AlunoResponsavelDAO();
             return alunoResponsavelDAO.alterar(this, conexao);
        }*/
    
    
        async excluir(conexao) {
            const eventoFuncionarioDAO = new EventoFuncionarioDAO();
           return eventoFuncionarioDAO.excluir(this, conexao);
        }

        async excluirPorCPF(conexao) {
            const eventoFuncionarioDAO = new EventoFuncionarioDAO();
            return eventoFuncionarioDAO.excluirPorTurma(this, conexao);
        }
    
    
        async consultar(termo,tipo ,conexao) {
            const eventoFuncionarioDAO = new EventoFuncionarioDAO();
            return eventoFuncionarioDAO.consultar(termo, tipo ,conexao);
        }

}