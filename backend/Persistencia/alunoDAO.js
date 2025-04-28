import conectar from "./Conexao.js";
import Aluno from "../Modelo/aluno.js";
import Responsavel from "../Modelo/responsavel.js";
import Escola from "../Modelo/escola.js";

export default class AlunoDAO {



    constructor() {
    }

    async init() {
        try {
            /*
            const sql2="DROP TABLE aluno";
            await conexao.execute(sql2);
            const sql = `CREATE TABLE IF NOT EXISTS aluno (
                alu_id INT AUTO_INCREMENT PRIMARY KEY,
                alu_nome VARCHAR(100) NOT NULL,
                alu_idade INT NOT NULL,
                alu_responsavel VARCHAR(100) NOT NULL,
                alu_endereco VARCHAR(255) NOT NULL,
                alu_telefone VARCHAR(20) NOT NULL,
                alu_periodoProjeto VARCHAR(50) NOT NULL,
                alu_periodoEscola VARCHAR(50) NOT NULL
            );`;
            */
            let sql3 = `DROP TABLE aluno`;
            let conexao = await conectar();
            await conexao.execute(sql3);
            sql3 = `CREATE TABLE IF NOT EXISTS aluno (
            alu_id INT AUTO_INCREMENT,
            alu_nome VARCHAR(100) NOT NULL,
            alu_data_nascimento DATE NOT NULL,
            alu_responsavel_cpf VARCHAR(14) NOT NULL,
            alu_rua VARCHAR(255) NOT NULL,
            alu_numero VARCHAR(10) NOT NULL,
            alu_escola_id INT NOT NULL,
            alu_telefone VARCHAR(20) NOT NULL,
            alu_periodo_escola ENUM('Manhã', 'Tarde') NOT NULL,
            alu_realiza_acompanhamento VARCHAR(200),
            alu_possui_sindrome VARCHAR(200),
            alu_descricao VARCHAR(300) NOT NULL,
            alu_dataInsercao DATE NOT NULL,
            







        
        alu_bairro VARCHAR(100) NOT NULL,
        alu_cep VARCHAR(20) NOT NULL,

        
        alu_numero VARCHAR(10) NOT NULL,
        alu_escola_id INT NOT NULL,
        alu_telefone VARCHAR(20) NOT NULL,
        alu_periodo_projeto ENUM('Manhã', 'Tarde' ) NOT NULL,
        alu_periodo_escola ENUM('Manhã', 'Tarde') NOT NULL,
        alu_realiza_acompanhamento VARCHAR(200),
        alu_possui_sindrome VARCHAR(200),
        alu_status INT NOT NULL,

    CONSTRAINT pk_aluno PRIMARY KEY (alu_num_protocolo),

    -- assumindo que a tabela responsavel tem cpf como chave primária
    CONSTRAINT fk_aluno_responsavel FOREIGN KEY (alu_responsavel_cpf) 
        REFERENCES responsavel(res_cpf)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_aluno_escola FOREIGN KEY (alu_escola_id) 
        REFERENCES escola(esc_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_aluno_status CHECK (alu_status IN (0,1))
);
`;
            await conexao.execute(sql3);
            await conexao.release();
        } catch (e) {
            console.log("Erro ao iniciar banco de dados: " + e.message);
        }
    }

    async incluir(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `INSERT INTO aluno 
            (
                alu_nome, alu_data_nascimento, alu_responsavel_cpf, alu_rua, alu_bairro,
                alu_cidade, alu_cep, alu_numero, alu_escola_id, alu_telefone, 
                alu_periodo_projeto, alu_periodo_escola, alu_realiza_acompanhamento, 
                alu_possui_sindrome, alu_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.responsavel.cpf,
                aluno.rua,
                aluno.bairro,
                aluno.cidade,
                aluno.cep,
                aluno.numero,
                aluno.escola.id,
                aluno.telefone,
                aluno.periodoProjeto,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.status
            ];
            await conexao.execute(sql, parametros);
        }
    }
    
    async consultar(termo, tipo,conexao) {

        let sql = ``;
        let parametros = [];
        if(tipo==0){
            sql = `SELECT * FROM aluno WHERE alu_nome = ?`;
            parametros = [termo];
        }
        else
        if(tipo==1){
            sql = `SELECT * FROM aluno WHERE alu_nome = ?`;
            parametros = [termo];
        }
        else
        if(tipo==2){
            sql = `SELECT * FROM aluno WHERE alu_rg = ?`;
            parametros = [termo];
        }
        else{
            if(tipo==3)
            sql = `SELECT * FROM aluno WHERE alu_id = ?`;
            parametros = [termo];
        }
    
        const [registros] = await conexao.execute(sql, parametros);
        const listaAluno = [];
    
        for (const registro of registros) {
            // Buscar Responsável pelo CPF
            const respon = await responsavel.consultar(registro['alu_responsavel_cpf'], conexao);
            const responsavel = new Responsavel(respon.cpf,respon.nome,respon.telefone);
            
            // Buscar FormularioSaude pelo aluno_id
            const formularioSaude = null;



            // Buscar Ficha pelo aluno_id
            const ficha = null;
            





            // Buscar Escola pelo ID
            
            const esco = await escola.consultar(registro['alu_escola_id'], conexao);
              
            const escola = new Escola(esco.nome,esco.endereco,esco.telefone,esco.tipo);
            // Agora sim criar o Aluno com os objetos completos
           const aluno = new Aluno(
            registro['alu_id'],
            registro['alu_nome'],
            registro['alu_data_nascimento'],
            responsavel,
            registro['alu_rua'],
            registro['alu_numero'],
            escola,
            registro['alu_telefone'],
            registro['alu_periodo_escola'],
            registro['alu_realiza_acompanhamento'],
            registro['alu_possui_sindrome'],
            registro['alu_descricao'],
            registro['alu_data_insercao'],
            registro['rg'],
            formularioSaude,
            ficha,
            registro['alu_data_inclusao_projeto'],
            registro['alu_status'],
            registro['alu_periodo_projeto']           
           )
            listaAluno.push(aluno);
        }
        return listaAluno;
    }

    async excluir(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `DELETE FROM aluno WHERE alu_num_protocolo = ?`;
            const parametros = [aluno.numProtocolo];
            await conexao.execute(sql, parametros);
        }
    }
    
    async alterar(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `
                UPDATE aluno SET 
                    alu_nome = ?, 
                    alu_data_nascimento = ?, 
                    alu_responsavel_cpf = ?, 
                    alu_rua = ?, 
                    alu_bairro = ?, 
                    alu_cidade = ?, 
                    alu_cep = ?, 
                    alu_numero = ?, 
                    alu_escola_id = ?, 
                    alu_telefone = ?, 
                    alu_periodo_projeto = ?, 
                    alu_periodo_escola = ?, 
                    alu_realiza_acompanhamento = ?, 
                    alu_possui_sindrome = ?, 
                    alu_status = ?
                WHERE alu_num_protocolo = ?
            `;
            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.responsavel.cpf,
                aluno.rua,
                aluno.bairro,
                aluno.cidade,
                aluno.cep,
                aluno.numero,
                aluno.escola.id,
                aluno.telefone,
                aluno.periodoProjeto,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.status,
                aluno.numProtocolo
            ];
            await conexao.execute(sql, parametros);
        }
    }
    
}