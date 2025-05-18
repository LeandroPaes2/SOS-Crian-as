import conectar from "./Conexao.js";
import Aluno from "../Modelo/aluno.js";
import Responsavel from "../Modelo/responsavel.js";
import Escola from "../Modelo/escola.js";

export default class AlunoDAO {


    constructor() {
    }

    /*async init() {
        try {

            /*const sql2 = "DROP TABLE aluno";
            await conexao.query(sql2);


            let sql3 = `CREATE TABLE IF NOT EXISTS aluno (
            alu_id INT AUTO_INCREMENT,
            alu_nome VARCHAR(100) NOT NULL,
            alu_data_nascimento DATE NOT NULL,
            alu_responsavel_cpf VARCHAR(14) NOT NULL,
            alu_cidade VARCHAR(50) NOT NULL,
            alu_rua VARCHAR(255) NOT NULL,
            alu_bairro VARCHAR(50) NOT NULL,
            alu_numero VARCHAR(10) NOT NULL,
            alu_escola_id INT NOT NULL,
            alu_telefone VARCHAR(20) NOT NULL,
            alu_periodo_escola ENUM('Manhã', 'Tarde') NOT NULL,
            alu_realiza_acompanhamento VARCHAR(200),
            alu_possui_sindrome VARCHAR(200),
            alu_descricao VARCHAR(300) NOT NULL,
            alu_rg VARCHAR(20) NOT NULL,
            alu_formulario_saude INT,
            alu_ficha INT ,
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
`;*/

    /* const sql3 = `CREATE TABLE IF NOT EXISTS aluno (
alu_id INT GENERATED ALWAYS AS IDENTITY,
alu_nome VARCHAR(100) NOT NULL,
alu_data_nascimento DATE NOT NULL,
alu_responsavel_cpf VARCHAR(14) NOT NULL,
alu_cidade VARCHAR(50) NOT NULL,
alu_rua VARCHAR(255) NOT NULL,
alu_bairro VARCHAR(50) NOT NULL,
alu_numero VARCHAR(10) NOT NULL,
alu_escola_id INT NOT NULL,
alu_telefone VARCHAR(20) NOT NULL,
alu_periodo_escola VARCHAR(10) NOT NULL,
alu_realiza_acompanhamento VARCHAR(200),
alu_possui_sindrome VARCHAR(200),
alu_descricao VARCHAR(300) NOT NULL,
alu_rg VARCHAR(20) NOT NULL,
alu_formulario_saude INT,
alu_ficha INT,
-- alu_dataInsercao_projeto DATE NOT NULL,
alu_status INT NOT NULL,
alu_periodo_projeto VARCHAR(10) NOT NULL,
alu_cep VARCHAR(20) NOT NULL,

-- PRIMARY KEY
CONSTRAINT pk_aluno PRIMARY KEY (alu_id),

-- FOREIGN KEYS

-- CHECK CONSTRAINTS (Substituindo ENUMs)
CONSTRAINT chk_aluno_periodo_escola CHECK (alu_periodo_escola IN ('Manhã', 'Tarde')),
CONSTRAINT chk_aluno_periodo_projeto CHECK (alu_periodo_projeto IN ('Manhã', 'Tarde')),
CONSTRAINT chk_aluno_status CHECK (alu_status IN (0, 1))
);`;
     await conexao.query(sql3);
     await conexao.release();
 } catch (e) {
     console.log("Erro ao iniciar banco de dados: " + e.message);
 }
}
*/


    //preciso corrijir o status no front mais as gambiarras no geral funciona

    async incluir(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `
    INSERT INTO aluno (
        alu_nome,
        alu_data_nascimento,
        alu_responsavel_cpf,
        alu_cidade,
        alu_rua,
        alu_bairro,
        alu_numero,
        alu_escola_id,
        alu_telefone,
        alu_periodo_escola,
        alu_realiza_acompanhamento,
        alu_possui_sindrome,
        alu_descricao,
        alu_rg,
        alu_formulario_saude,
        alu_ficha,
        alu_status,
        alu_periodo_projeto,
        alu_cep
    )
    VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17, $18, $19
);
`;

            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.responsavel.cpf,
                aluno.cidade,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.escola.id,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.rg,
                aluno.formularioSaude,
                aluno.ficha,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep
            ];
            await conexao.query(sql, parametros);
        }
    }
    /*
        async consultar(termo, tipo, conexao) {
    
            let sql = ``;
            let parametros = [];
            if (tipo === 0) {
                sql = `SELECT * FROM aluno WHERE alu_nome = ?`;
                parametros = [termo];
            } else if (tipo === 1) {
                sql = `SELECT * FROM aluno WHERE alu_nome = ?`;
                parametros = [termo];
            } else if (tipo === 2) {
                sql = `SELECT * FROM aluno WHERE alu_rg = ?`;
                parametros = [termo];
            } else if (tipo === 3) {
                sql = `SELECT * FROM aluno WHERE alu_id = ?`;
                parametros = [termo];
            }
    
    
            const [registros] = await conexao.query(sql, parametros);
            const listaAluno = [];
    
            for (const registro of registros) {
                // Buscar Responsável pelo CPF
                /*
                const respon = await responsavel.consultar(registro['alu_responsavel_cpf'], conexao);
                const responsavel = new Responsavel(respon.cpf, respon.nome, respon.telefone);
                
    
                const responsavel = {};
                // Buscar FormularioSaude pelo aluno_id
                const formularioSaude = null;
    
    
    
                // Buscar Ficha pelo aluno_id
                const ficha = null;
    
    
                // Buscar Escola pelo ID
                /*
                const esco = await escola.consultar(registro['alu_escola_id'], conexao);
                const escola = new Escola(esco.nome, esco.endereco, esco.telefone, esco.tipo);
    
                const escola = {};
    
                // Agora sim criar o Aluno com os objetos completos
                const aluno = new Aluno(
                    registro['alu_id'],
                    registro['alu_nome'],
                    registro['alu_data_nascimento'],
                    responsavel,
                    registro['alu_cidade'],
                    registro['alu_rua'],
                    registro['alu_bairro'],
                    registro['alu_numero'],
                    escola,
                    registro['alu_telefone'],
                    registro['alu_periodo_escola'],
                    registro['alu_realiza_acompanhamento'],
                    registro['alu_possui_sindrome'],
                    registro['alu_descricao'],
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
        }*/

    async consultar(termo, conexao) {
       let sql;
        let parametros = [];

        if (termo) {
            sql = `SELECT * FROM aluno WHERE alu_id = $1`;
            parametros = [termo];
        } else {
            sql = `SELECT * FROM aluno`;  // << pegar todos
        }

        const resultado = await conexao.query(sql, parametros);
        const alunos = [];

        for (const registro of resultado.rows) {
            const responsavel = await this.consultarResponsavel(registro.alu_responsavel_cpf, conexao);
            const escola = {}; // ou await this.consultarEscola(registro.alu_escola_id, conexao);

            alunos.push({
                id: registro.alu_id,
                nome: registro.alu_nome,
                dataNascimento: registro.alu_data_nascimento,
                responsavel: responsavel[0],
                cidade: registro.alu_cidade,
                rua: registro.alu_rua,
                bairro: registro.alu_bairro,
                numero: registro.alu_numero,
                escola: escola[0],
                telefone: registro.alu_telefone,
                periodoEscola: registro.alu_periodo_escola,
                realizaAcompanhamento: registro.alu_realiza_acompanhamento,
                possuiSindrome: registro.alu_possui_sindrome,
                descricao: registro.alu_descricao,
                rg: registro.alu_rg,
                formularioSaude: null,
                ficha: null,
                dataInsercaoProjeto: registro.alu_dataInsercao_projeto,
                status: registro.alu_status,
                periodoProjeto: registro.alu_periodo_projeto,
                cep: registro.alu_cep
            });
        }

        return alunos;
    }

    async consultarEscola(esc_id, conexao) {
        const sql = `SELECT * FROM escola WHERE esc_id = $1`;
        const parametros = [esc_id];
        const resultado = await conexao.query(sql, parametros);

        return resultado.rows.map(linha => ({
            id: linha.esc_id,
            nome: linha.esc_nome,
            endereco: linha.esc_endereco,
            telefone: linha.esc_telefone,
            tipo: linha.esc_tipo
        }));
    }

    async consultarResponsavel(cpf, conexao) {
        const sql = `SELECT * FROM responsavel WHERE resp_cpf = $1`;
        const parametros = [cpf];
        const resultado = await conexao.query(sql, parametros);

        return resultado.rows.map(linha => ({
            cpf: linha.resp_cpf,
            nome: linha.resp_nome,
            telefone: linha.resp_telefone
        }));
    }


    async excluir(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `DELETE FROM aluno WHERE alu_id = $1`;
            const parametros = [aluno.id];
            await conexao.query(sql, parametros);
        }
    }

    async alterar(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `
            UPDATE aluno SET 
                alu_nome = $1,
                alu_data_nascimento = $2,
                alu_responsavel_cpf = $3,
                alu_cidade = $4,
                alu_rua = $5,
                alu_bairro = $6,
                alu_numero = $7,
                alu_escola_id = $8,
                alu_telefone = $9,
                alu_periodo_escola = $10,
                alu_realiza_acompanhamento = $11,
                alu_possui_sindrome = $12,
                alu_descricao = $13,
                alu_rg = $14,
                alu_formulario_saude = $15,
                alu_ficha = $16,
                alu_status = $17,
                alu_periodo_projeto = $18,
                alu_cep = $19
            WHERE alu_id = $20
        `;

            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.responsavel.cpf,
                aluno.cidade,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.escola.id,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.rg,
                aluno.formularioSaude,
                aluno.ficha,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep,
                aluno.id
            ];

            await conexao.query(sql, parametros);
            return true;
        }
        return false;
    }



}