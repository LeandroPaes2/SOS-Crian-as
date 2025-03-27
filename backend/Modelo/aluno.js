import AlunoDAO from "../Persistencia/alunoDAO.js";
export default class Aluno {
    #nome;
    #idade;
    #responsavel;
    #endereco;
    #telefone;
    #periodoPorjeto
    #periodoEscola;


    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }   

    get idade() {
        return this.#idade;
    }   

    set idade(novaIdade) {
        this.#idade = novaIdade;
    }   

   get responsavel() {
        return this.#responsavel;
    }

    set responsavel(novoResponsavel) {
        this.#responsavel = novoResponsavel;
    }

    get endereco() {
        return this.#endereco;
    }

    set endereco(novoEndereco) {
        this.#endereco = novoEndereco;
    }

    get telefone() {
        return this.#telefone;    
    }   

    set telefone(novoTelefone) {
        this.#telefone = novoTelefone;
    }

    get periodoPorjeto() {
        return this.#periodoPorjeto;
    }

    set periodoPorjeto(novoPeriodoPorjeto) {
        this.#periodoPorjeto = novoPeriodoPorjeto;
    }

    get periodoEscola() {
        return this.#periodoEscola;
    }

    set periodoEscola(novoPeriodoEscola) {    
        this.#periodoEscola = novoPeriodoEscola;
    }

    constructor(nome="", idade="", responsavel="", endereco="", telefone="", periodoPorjeto="", periodoEscola="") {
        this.#nome=nome;
        this.#idade=idade;
        this.#responsavel=responsavel;
        this.#endereco=endereco;
        this.#telefone=telefone;
        this.#periodoPorjeto=periodoPorjeto;
        this.#periodoEscola=periodoEscola;
    }

     toJSON(){
           return {
               "nome":this.#nome,
               "idade":this.#idade,
               "responsavel":this.#responsavel,
               "endereco":this.#endereco,
               "telefone":this.#telefone,
               "periodoPorjeto":this.#periodoPorjeto,
               "periodoEscola":this.#periodoEscola
           }
        }
    
        async incluir(){
            //instanciar a camada de persistencia do produto
            const alunoDAO = new AlunoDAO();
            await alunoDAO.incluir(this);
        }
    
        async consultar(termo){
            const alunoDAO = new AlunoDAO();
            return await alunoDAO.consultar(termo);
        }
    
        async excluir(){
           const alunoDAO = new AlunoDAO();
           await alunoDAO.excluir(this.id);
        }
    
        async alterar(){
           const alunoDAO = new AlunoDAO();
           await alunoDAO.alterar(this);
        }
}