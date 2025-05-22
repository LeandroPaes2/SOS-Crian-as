import Aluno from "../Modelo/aluno.js";
import Escola from "../Modelo/escola.js";
import Responsavel from "../Modelo/responsavel.js";

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
                    alu_status,
                    alu_periodo_projeto,
                    alu_cep
                )
                VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17
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
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep
            ];
            const resp = await conexao.query(sql, parametros);
        }
        else {
            throw new Error("Objeto passado não é uma instância de Aluno");
        }
        return false;
    }

    async consultar(termo, tipo, conexao) {
        let sql = '';
        let parametros = [];

        if (tipo === 0 || tipo === 1) {
            sql = `SELECT * FROM aluno WHERE alu_nome ILIKE $1`;  // ILIKE para busca sem diferenciar maiúsculas/minúsculas
            parametros = ['%' + termo + '%'];  // Use o % para buscar partes do nome, se necessário
        } else if (tipo === 2) {
            sql = `SELECT * FROM aluno WHERE alu_rg ILIKE $1`;  // ILIKE para busca sem diferenciar maiúsculas/minúsculas
            parametros = ['%' + termo + '%'];  // % para busca parcial
        } else if (tipo === 3) {
            sql = `SELECT * FROM aluno WHERE alu_id = $1`;
            parametros = [termo];
        }

        const reg = await conexao.query(sql, parametros);

        const registros = reg.rows;
        const listaAluno = [];

        for (const registro of registros) {

            if (registro) {

                let responsavel = await this.consultarResponsavel(registro['alu_responsavel_cpf'], conexao)
                let escola = await this.consultarEscola(registro['alu_escola_id'], conexao)
                if (!escola) {
                    throw new Error("Erro ao consultar escola desse aluno: " + e.message);
                }
                if (!responsavel) {
                    throw new Error("Erro ao consultar Responsavel desse aluno: " + e.message);
                }

                // Buscar FormularioSaude e Ficha (placeholder)
                const formularioSaude = null;
                const ficha = null;

                // Criar o objeto Aluno
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
                    registro['alu_rg'],
                    registro['alu_status'],
                    registro['alu_periodo_projeto'],
                    registro['alu_cep']
                );
                listaAluno.push(aluno);
            }
        }

        return listaAluno;
    }


    async consultarResponsavel(cpf, conexao) {
        try {
            const sql = `SELECT * FROM responsavel r
                           WHERE resp_cpf = $1`
            const parametros = [cpf];
            const resultado = await conexao.query(sql, parametros);
            if (resultado.rows.length !== 1) {
                throw new Error(`Responsavel com CPF ${cpf} nao encontrado.`);
            }
            const linhas = resultado.rows[0];

            const responsavel = new Responsavel(
                linhas['resp_cpf'],
                linhas['resp_nome'],
                linhas['resp_telefone']
            );
            return responsavel;
        } catch (e) {
            throw new Error("Erro ao consultar Responsavel desse aluno: " + e.message);
        }
    }


    async consultarEscola(id, conexao) {
        try {
            const sql = `SELECT * FROM escola WHERE esc_id = $1`;
            const parametros = [id];
            const resultado = await conexao.query(sql, parametros);

            if (resultado.rows.length !== 1) {
                throw new Error(`Escola com ID ${id} não encontrada.`);
            }

            const linha = resultado.rows[0];

            const escola = new Escola(
                linha.esc_id,
                linha.esc_nome,
                linha.esc_telefone
            );

            return escola;
        } catch (e) {
            throw new Error("Erro ao consultar escola desse aluno: " + e.message);
        }
    }


    // Excluir Não pode excluir fisicamente !!!!! ARRUMAR !!!!!
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
                        alu_cidade = $3,
                        alu_rua = $4,
                        alu_bairro = $5,
                        alu_numero = $6,
                        alu_telefone = $7,
                        alu_periodo_escola = $8,
                        alu_realiza_acompanhamento = $9,
                        alu_possui_sindrome = $10,
                        alu_descricao = $11,
                        alu_rg = $12,
                        alu_status = $13,
                        alu_periodo_projeto = $14,
                        alu_cep = $15
                    WHERE alu_id = $16
                `;

            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.cidade,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.rg,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep,
                aluno.id // este é o identificador usado no WHERE
            ];

            const resp = await conexao.query(sql, parametros);
            return resp;

        }
        return false;
    }


}