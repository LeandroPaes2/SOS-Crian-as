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
            alu_bairro VARCHAR(50) NOT NULL,
            alu_numero VARCHAR(10) NOT NULL,
            alu_escola_id INT NOT NULL,
            alu_telefone VARCHAR(20) NOT NULL,
            alu_periodo_escola ENUM('Manhã', 'Tarde') NOT NULL,
            alu_realiza_acompanhamento VARCHAR(200),
            alu_possui_sindrome VARCHAR(200),
            alu_descricao VARCHAR(300) NOT NULL,
            alu_dataInsercao_lista_espera DATE NOT NULL,
            alu_rg VARCHAR(20) NOT NULL,
            alu_formulario_saude INT NOT NULL,
            alu_ficha INT NOT NULL,
            alu_dataInsercao_projeto DATE NOT NULL,
            alu_status INT NOT NULL,
            alu_periodo_projeto ENUM('Manhã', 'Tarde' ) NOT NULL,
            alu_cep VARCHAR(20) NOT NULL,




            

        CONSTRAINT pk_aluno PRIMARY KEY (alu_id),

        CONSTRAINT FK_aluno_escola FOREIGN KEY (alu_escola_id) 
            REFERENCES escola(esc_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,

            CONSTRAINT FK_FORM_SAUDE FOREIGN KEY (alu_formulario_saude) 
            REFERENCES formulario_saude(form_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,

            CONTRAINT FK_FICHA FOREIGN KEY (alu_ficha) 
            REFERENCES ficha(ficha_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,


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

    /// SO ARRUMEI ATÉ ALI EM CIMA ************************************************










    /////////// ARRUMAR ALI EM BAIXO *************************************************


    async incluir(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `INSERT INTO aluno 
            (
            alu_nome,
            alu_data_nascimento,
            alu_responsavel_cpf,
            alu_rua ,
            alu_bairro ,
            alu_numero,
            alu_escola_id ,
            alu_telefone,
            alu_periodo_escola,
            alu_realiza_acompanhamento,
            alu_possui_sindrome,
            alu_descricao,
            alu_dataInsercao_lista_espera ,
            alu_rg,
            alu_formulario_saude ,
            alu_ficha ,
            alu_dataInsercao_projeto ,
            alu_status,
            alu_periodo_projeto ENUM('Manhã', 'Tarde' ),
            alu_cep
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)`;

            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.responsavel.cpf,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.escola.id,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.dataInsercaoListaEspera,
                aluno.rg,
                aluno.formularioSaude,
                aluno.ficha,
                aluno.dataInsercaoProjeto,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep
            ];
            await conexao.execute(sql, parametros);
        }
    }

    async consultar(termo, tipo, conexao) {

        let sql = ``;
        let parametros = [];
        if (tipo == 0) {
            sql = `SELECT * FROM aluno WHERE alu_nome = ?`;
            parametros = [termo];
        }
        else
            if (tipo == 1) {
                sql = `SELECT * FROM aluno WHERE alu_nome = ?`;
                parametros = [termo];
            }
            else
                if (tipo == 2) {
                    sql = `SELECT * FROM aluno WHERE alu_rg = ?`;
                    parametros = [termo];
                }
                else {
                    if (tipo == 3)
                        sql = `SELECT * FROM aluno WHERE alu_id = ?`;
                    parametros = [termo];
                }

        const [registros] = await conexao.execute(sql, parametros);
        const listaAluno = [];

        for (const registro of registros) {
            // Buscar Responsável pelo CPF
            const respon = await responsavel.consultar(registro['alu_responsavel_cpf'], conexao);
            const responsavel = new Responsavel(respon.cpf, respon.nome, respon.telefone);

            // Buscar FormularioSaude pelo aluno_id
            const formularioSaude = null;



            // Buscar Ficha pelo aluno_id
            const ficha = null;


            // Buscar Escola pelo ID

            const esco = await escola.consultar(registro['alu_escola_id'], conexao);

            const escola = new Escola(esco.nome, esco.endereco, esco.telefone, esco.tipo);
            // Agora sim criar o Aluno com os objetos completos
            const aluno = new Aluno(
                registro['alu_id'],
                registro['alu_nome'],
                registro['alu_data_nascimento'],
                responsavel,
                registro['alu_rua'],
                registro['alu_bairro'],
                registro['alu_numero'],
                escola,
                registro['alu_telefone'],
                registro['alu_periodo_escola'],
                registro['alu_realiza_acompanhamento'],
                registro['alu_possui_sindrome'],
                registro['alu_descricao'],
                registro['alu_dataInsercao_lista_espera'],
                registro['rg'],
                formularioSaude,
                ficha,
                registro['alu_dataInsercao_projeto'],
                registro['alu_status'],
                registro['alu_periodo_projeto'],
                registro['alu_cep']
            )
            listaAluno.push(aluno);
        }
        return listaAluno;
    }

    async excluir(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `DELETE FROM aluno WHERE alu_id = ?`;
            const parametros = [aluno.id];
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
                    alu_numero = ?,
                    alu_escola_id = ?,
                    alu_telefone = ?,
                    alu_periodo_escola = ?,
                    alu_realiza_acompanhamento = ?,
                    alu_possui_sindrome = ?,
                    alu_descricao = ?
                    alu_dataInsercao_lista_espera = ?,
                    alu_rg = ?,
                    alu_formulario_saude = ?,
                    alu_ficha = ?,
                    alu_dataInsercao_projeto = ?,
                    alu_status = ?
                    alu_periodo_projeto = ?
                    alu_cep = ?
                WHERE alu_num_protocolo = ?
            `;
            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.responsavel.cpf,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.escola.id,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.dataInsercaoListaEspera,
                aluno.rg,
                aluno.formularioSaude,
                aluno.ficha,
                aluno.dataInsercaoProjeto,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep
            ];
            await conexao.execute(sql, parametros);
        }
    }

}