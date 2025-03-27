import EscolaDAO from "../Persistencia/escolaDAO.js";

export default class Escola{
   
    #nome;
    #endereco;


    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome = novoNome;
    }

    get endereco(){
        return this.#endereco;
    }

    set endereco(novoEndereco){
        this.#endereco=novoEndereco;
    }


    constructor(nome="", endereco=""){
        this.#nome=nome;
        this.#endereco=endereco;
    }

    toJSON(){
        return {
            "nome":this.#nome,
            "endereco":this.#endereco
        }
    }

    async incluir(){
        const escolaDAO = new EscolaDAO();
        await escolaDAO.incluir(this); 
    }

    async consultar(termo){
        const escolaDAO = new EscolaDAO();
        return await escolaDAO.consultar(termo);
    }

    async excluir(){
        const escolaDAO = new EscolaDAO();
        await escolaDAO.excluir(this);
    }

    async alterar(){
        const escolaDAO = new EscolaDAO();
        await escolaDAO.alterar(this);
    }
}

