//import conectar from "./Conexao.js";

import Aluno from "../Modelo/aluno.js";

export default class FormularioSaudeDAO {

    /* constructor() {
         this.init();
     }
 
     async init() {
         try {
             const conexao = await conectar();
             const sql = `
                 CREATE TABLE IF NOT EXISTS formulariosaude (
                    formulario_saude_num SERIAL PRIMARY KEY NOT NULL,
                    alu_id INT NOT NULL,
                    formulario_saude_alergia_alimentar VARCHAR(100) NOT NULL,
                    formulario_saude_crise_alergica_alimentar VARCHAR(100) NOT NULL,
                    formulario_saude_alergia_nao_alimentar VARCHAR(100) NOT NULL,
                    formulario_saude_crise_alergica_nao_alimentar VARCHAR(100) NOT NULL,
                    formulario_saude_maior_atencao VARCHAR(100) NOT NULL,
                    formulario_saude_crise_maior_atencao VARCHAR(100) NOT NULL,
                    formulario_saude_medicacao_continua VARCHAR(100) NOT NULL,
                    formulario_saude_quem_prescreveu VARCHAR(45) NOT NULL,
                    formulario_saude_plano_saude VARCHAR(45) NOT NULL,
                    formulario_saude_tipo_sanguineo VARCHAR(5) NOT NULL,
                    formulario_saude_data_insercao DATE NOT NULL,
                    formulario_saude_assitatura_responsavel BYTEA NOT NULL,
                    formulario_saude_status INT NOT NULL,
                     CONSTRAINT fk_formularioSaude_aluno FOREIGN KEY (alu_id) 
                         REFERENCES aluno(alu_id)
                         ON UPDATE CASCADE
                         ON DELETE RESTRICT
                 )
             `;
             await conexao.query(sql);
             await conexao.release();
         } catch (e) {
             console.log("Erro ao iniciar banco de dados: " + e.message);
         }
     }*/

    async incluir(formularioSaude, conexao) {

        // Verifica se já existe um registro ATIVO (status = 1) para esse aluno
        const sqlBusca = `
    SELECT 1 FROM formulariosaude 
    WHERE alu_id = $1 AND formulario_saude_status = 1
    LIMIT 1
`;
        const parametrosBusca = [formularioSaude.id];
        const resultado = await conexao.query(sqlBusca, parametrosBusca);

        // Se já existe um com status ativo, não permite novo cadastro
        if (resultado.rows.length > 0) {
            throw new Error("Formulario já está ativo na lista de formularios de saude");
        }

        // Caso contrário, permite a inserção
        const sqlInsercao = `
    INSERT INTO formulariosaude (
        alu_id, formulario_saude_alergia_alimentar, formulario_saude_crise_alergica_alimentar, formulario_saude_alergia_nao_alimentar,
        formulario_saude_crise_alergica_nao_alimentar, formulario_saude_maior_atencao, formulario_saude_crise_maior_atencao,
        formulario_saude_medicacao_continua, formulario_saude_quem_prescreveu, formulario_saude_plano_saude, formulario_saude_tipo_sanguineo,
        formulario_saude_data_insercao, formulario_saude_assitatura_responsavel, formulario_saude_status

    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
`;
        const parametrosInsercao = [
            formularioSaude.id,
            formularioSaude.alergia_alimentar,
            formularioSaude.crise_alergica_alimentar,
            formularioSaude.alergia_nao_alimentar,
            formularioSaude.crise_alergica_nao_alimentar,
            formularioSaude.maior_atencao,
            formularioSaude.crise_maior_atencao,
            formularioSaude.medicacao_continua,
            formularioSaude.quem_prescreveu,
            formularioSaude.plano_saude,
            formularioSaude.tipo_sanguineo,
            formularioSaude.data_insercao,
            formularioSaude.assitatura_responsavel,
            formularioSaude.status
        ];
        await conexao.query(sqlInsercao, parametrosInsercao);

    }

    async consultar(termo, conexao) {
        let sql = `SELECT * FROM formulariosaude`;
        let parametros = [];


        if (termo?.id) {
            sql = `SELECT * FROM formulariosaude WHERE alu_id = $1`;
            parametros = [termo.id];
        }
        else if (termo?.num) {
            sql = `SELECT * FROM formulariosaude WHERE formulario_saude_num = $1`;
            parametros = [termo.num];
        }
        else if (termo?.aluno && termo.aluno.nome) {
            sql = `
                SELECT * FROM formulariosaude 
                WHERE alu_id = (
                    SELECT alu_id FROM aluno WHERE alu_nome ILIKE $1 LIMIT 1
                )
            `;
            parametros = [`%${termo.aluno.nome}%`];
        } else if (termo?.status) {
            sql = `SELECT * FROM formulariosaude WHERE formulario_saude_status = $1`;
            parametros = [termo.status];
        }

        const resultado = await conexao.query(sql, parametros);
        const listaFormularioSaude = [];

        for (const registro of resultado.rows) {
            //const aluno = await this.consultarAluno(registro.alu_id, conexao);
            var aluno = new Aluno;
            aluno = await aluno.consultar(registro.alu_id, 3, conexao);

            listaFormularioSaude.push({
                num: registro.formulario_saude_num,
                id: registro.alu_id,
                aluno: aluno[0],
                data_insercao: registro.formulario_saude_datainsercao,
                cor: registro.formulario_saude_cor,
                status: registro.formulario_saude_status
            });
        }

        return listaFormularioSaude;
    }
    /*
        async consultarAluno(alu_id, conexao) {
            const sql = `SELECT * FROM aluno WHERE alu_id = $1`;
            const parametros = [alu_id];
            const resultado = await conexao.query(sql, parametros);
    
            const alunos = [];
    
            for (const registro of resultado.rows) {
                const responsavel = await this.consultarResponsavel(registro.alu_responsavel_cpf, conexao);
    
                // o lele precisa consertar isso
                // const escola = await this.consultarEscola(registro.alu_escola_id, conexao);
                const escola = {};
    
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
                    rg: registro.rg,
                    formularioSaude: null,
                    ficha: null,
                    data_insercaoProjeto: registro.alu_data_insercao_projeto,
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
        }*/

    async excluir(formularioSaude, conexao) {
        const sql = `DELETE FROM formulariosaude WHERE formulario_saude_num = $1`;
        await conexao.query(sql, [formularioSaude.num]);
    }

    async alterar(formularioSaude, conexao) {
        const sql = `
            UPDATE formulariosaude SET  
                formulario_saude_alergia_alimentar = $1,
                    formulario_saude_crise_alergica_alimentar = $2,
                    formulario_saude_alergia_nao_alimentar = $3,
                    formulario_saude_crise_alergica_nao_alimentar = $4,
                    formulario_saude_maior_atencao = $5,
                    formulario_saude_crise_maior_atencao = $6,
                    formulario_saude_medicacao_continua = $7,
                    formulario_saude_quem_prescreveu = $8,
                    formulario_saude_plano_saude = $9,
                    formulario_saude_tipo_sanguineo = $10,
                    formulario_saude_data_insercao = $11,
                    formulario_saude_assitatura_responsavel = $12,
                    formulario_saude_status = $13,
            WHERE formulario_saude_num = $14
        `;
        const parametros = [
            formularioSaude.alergia_alimentar,
            formularioSaude.crise_alergica_alimentar,
            formularioSaude.alergia_nao_alimentar,
            formularioSaude.crise_alergica_nao_alimentar,
            formularioSaude.maior_atencao,
            formularioSaude.crise_maior_atencao,
            formularioSaude.medicacao_continua,
            formularioSaude.quem_prescreveu,
            formularioSaude.plano_saude,
            formularioSaude.tipo_sanguineo,
            formularioSaude.data_insercao,
            formularioSaude.assitatura_responsavel,
            formularioSaude.status,
            formularioSaude.num
        ];
        await conexao.query(sql, parametros);
    }
}

