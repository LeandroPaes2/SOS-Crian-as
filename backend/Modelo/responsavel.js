import ResponsavelDAO from "../Persistencia/responsavelDAO.js";

export default class Responsavel{
    //atributos privados
    #cpf;
    #rg;
    #nome;
    #telefone
    #email;
    #sexo;
    #dtNascimento;
    #estCivil;
    #conjuge;
    #profissao;
    #situTrabalho;
    #escolaridade;
    #rendaFamiliar;
    #valorRenda;
    #qtdeTrabalhadores;
    #pensaoAlimenticia;
    #valorPensao;
    #pagadorPensao;
    #beneficioSocial;
    #tipoBeneficio;
    #valorBeneficio;
    #beneficiario;

    get cpf(){
        return this.#cpf;
    }

    set cpf(novoCpf){
        this.#cpf = novoCpf;
    }

    get rg(){
        return this.#rg;
    }

    set rg(novoRg){
        this.#rg=novoRg;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome=novoNome;
    }

    get telefone(){
        return this.#telefone
    }

    set telefone(novoTelefone){
        this.#telefone = novoTelefone;
    }

    get email(){
        return this.#email;
    }

    set email(novoEmail){
        this.#email=novoEmail;
    }

    get sexo(){
        return this.#sexo;
    }

    set sexo(novoSexo){
        this.#sexo=novoSexo;
    }

    get dtNascimento(){
        return this.#dtNascimento;
    }

    set dtNascimento(novaDt){
        this.#dtNascimento=novaDt;
    }

    get estCivil(){
        return this.#estCivil;
    }

    set estCivil(novoEstCivil){
        this.#estCivil=novoEstCivil;
    }

    get conjuge(){
        return this.#conjuge;
    }

    set conjuge(novoConjuge){
        this.#conjuge=novoConjuge;
    }

    get profissao(){
        this.#profissao;
    }

    set profissao(novaProfissao){
        this.#profissao=novaProfissao;
    }

    get situTrabalho(){
        this.#situTrabalho;
    }

    set situTrabalho(novoTrabalho){
        this.#situTrabalho=novoTrabalho;
    }

    get escolaridade(){
        this.#escolaridade;
    }

    set escolaridade(novaEscolaridade){
        this.#escolaridade=novaEscolaridade;
    }

    get rendaFamiliar(){
        this.#rendaFamiliar;
    }

    set rendaFamiliar(novaRendaFamiliar){
        this.#rendaFamiliar=novaRendaFamiliar;
    }

    get valorRenda(){
        this.#valorRenda;
    }

    set valorRenda(novoValorRenda){
        this.#valorRenda=novoValorRenda;
    }

    get qtdeTrabalhadores(){
        this.#qtdeTrabalhadores;
    }

    set qtdeTrabalhadores(novaQtde){
        this.#qtdeTrabalhadores=novaQtde;
    }

    get pensaoAlimenticia(){
        this.#pensaoAlimenticia;
    }

    set pensaoAlimenticia(novaPensaoAlimenticia){
        this.#pensaoAlimenticia=novaPensaoAlimenticia;
    }

    get valorPensao(){
        this.#valorPensao;
    }

    set valorPensao(novoValorPensao){
        this.#valorPensao=novoValorPensao;
    }

    get pagadorPensao(){
        this.#pagadorPensao;
    }

    set pagadorPensao(novoPagador){
        this.#pagadorPensao=novoPagador;
    }

    get beneficioSocial(){
        this.#beneficioSocial;
    }

    set beneficioSocial(novoBeneficio){
        this.#beneficioSocial=novoBeneficio;
    }

    get tipoBeneficio(){
        this.#tipoBeneficio;
    }

    set tipoBeneficio(novoTipo){
        this.#tipoBeneficio=novoTipo;
    }

    get valorBeneficio(){
        this.#valorBeneficio;
    }

    set valorBeneficio(novoValorBeneficio){
        this.#valorBeneficio=novoValorBeneficio;
    }

    get beneficiario(){
        this.#beneficiario;
    }

    set beneficiario(novoBeneficiario){
        this.#beneficiario=novoBeneficiario;
    }

    constructor(cpf="", rg="", nome="", telefone="", email="", sexo="", dtNascimento="", estCivil="", conjuge="", profissao="", situTrabalho="", escolaridade="", rendaFamiliar=0.00, valorRenda=0.00, qtdeTrabalhadores=0, pensaoAlimenticia="", valorPensao=0.00, pagadorPensao="", beneficioSocial="", tipoBeneficio="", valorBeneficio=0.00, beneficiario=""){
        this.#cpf=cpf;
        this.#rg=rg;
        this.#nome=nome;
        this.#telefone=telefone;
        this.#email=email;
        this.#sexo=sexo;
        this.#dtNascimento=dtNascimento;
        this.#estCivil=estCivil;
        this.#conjuge=conjuge;
        this.#profissao=profissao;
        this.#situTrabalho=situTrabalho;
        this.#escolaridade=escolaridade;
        this.#rendaFamiliar=rendaFamiliar;
        this.#valorRenda=valorRenda;
        this.#qtdeTrabalhadores=qtdeTrabalhadores;
        this.#pensaoAlimenticia=pensaoAlimenticia;
        this.#valorPensao=valorPensao;
        this.#pagadorPensao=pagadorPensao;
        this.#beneficioSocial=beneficioSocial;
        this.#tipoBeneficio=tipoBeneficio;
        this.#valorBeneficio=valorBeneficio;
        this.#beneficiario=beneficiario;
    }

    toJSON(){
        return {
            "cpf":this.#cpf,
            "rg":this.#rg,
            "nome":this.#nome,
            "telefone":this.#telefone,
            "email":this.#email,
            "sexo":this.#sexo,
            "dtNascimento":this.#dtNascimento,
            "estCivil":this.#estCivil,
            "conjuge":this.#conjuge,
            "profissao":this.#profissao,
            "situTrabalho":this.#situTrabalho,
            "escolaridade":this.#escolaridade,
            "rendaFamiliar":this.#rendaFamiliar,
            "valorRenda":this.#valorRenda,
            "qtdeTrabalhadores":this.#qtdeTrabalhadores,
            "pensaoAlimenticia":this.#pensaoAlimenticia,
            "valorPensao":this.#valorPensao,
            "pagadorPensao":this.#pagadorPensao,
            "beneficioSocial":this.#beneficioSocial,
            "tipoBeneficio":this.#tipoBeneficio,
            "valorBeneficio":this.#valorBeneficio,
            "beneficiario":this.#beneficiario
        }
    }

    async incluir(conexao){
        const respDAO = new ResponsavelDAO();
        await respDAO.incluir(this, conexao);
    }

    async consultar(termo, conexao){
        const respDAO = new ResponsavelDAO();
        return await respDAO.consultar(termo, conexao);
    }

    async excluir(conexao){
        const respDAO = new ResponsavelDAO();
        await respDAO.excluir(this, conexao);
    }

    async alterar(conexao){
        const respDAO = new ResponsavelDAO();
        await respDAO.alterar(this, conexao);
    }
}
