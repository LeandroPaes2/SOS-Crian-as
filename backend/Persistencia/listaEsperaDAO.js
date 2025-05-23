//import conectar from "./Conexao.js";

export default class ListaEsperaDAO {

    /* constructor() {
         this.init();
     }
 
     async init() {
         try {
             const conexao = await conectar();
             const sql = `
                 CREATE TABLE IF NOT EXISTS listaespera (
                     lista_espera_num SERIAL PRIMARY KEY NOT NULL,
                     alu_id INT NOT NULL,
                     lista_espera_dataInsercao DATE NOT NULL,
                     lista_espera_cor VARCHAR(15) NOT NULL,
                     lista_espera_status INT NOT NULL,
                     CONSTRAINT fk_listaEspera_aluno FOREIGN KEY (alu_id) 
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

    async incluir(listaEspera, conexao) {

        // Verifica se já existe um registro ATIVO (status = 1) para esse aluno
        const sqlBusca = `
    SELECT 1 FROM listaespera 
    WHERE alu_id = $1 AND lista_espera_status = 1
    LIMIT 1
`;
        const parametrosBusca = [listaEspera.id];
        const resultado = await conexao.query(sqlBusca, parametrosBusca);

        // Se já existe um com status ativo, não permite novo cadastro
        if (resultado.rows.length > 0) {
            throw new Error("Criança já está ativa na lista de espera");
        }

        // Caso contrário, permite a inserção
        const sqlInsercao = `
    INSERT INTO listaespera (
        alu_id, lista_espera_dataInsercao, lista_espera_cor, lista_espera_status
    ) VALUES ($1, $2, $3, $4)
`;
        const parametrosInsercao = [
            listaEspera.id,
            listaEspera.dataInsercao,
            listaEspera.cor,
            listaEspera.status
        ];
        await conexao.query(sqlInsercao, parametrosInsercao);

    }

    async consultar(termo, conexao) {
        let sql = `SELECT * FROM listaespera`;
        let parametros = [];


        if (termo?.id) {
            sql = `SELECT * FROM listaespera WHERE alu_id = $1`;
            parametros = [termo.id];
        }
        else if (termo?.num) {
            sql = `SELECT * FROM listaespera WHERE lista_espera_num = $1`;
            parametros = [termo.num];
        }
        else if (termo?.aluno && termo.aluno.nome) {
            sql = `
                SELECT * FROM listaespera 
                WHERE alu_id = (
                    SELECT alu_id FROM aluno WHERE alu_nome ILIKE $1 LIMIT 1
                )
            `;
            parametros = [`%${termo.aluno.nome}%`];
        } else if (termo?.cor) {
            sql = `SELECT * FROM listaespera WHERE lista_espera_cor = $1`;
            parametros = [termo.cor];
        } else if (termo?.status) {
            sql = `SELECT * FROM listaespera WHERE lista_espera_status = $1`;
            parametros = [termo.status];
        }

        const resultado = await conexao.query(sql, parametros);
        const listaListaEspera = [];

        for (const registro of resultado.rows) {
            const aluno = await this.consultarAluno(registro.alu_id, conexao);

            listaListaEspera.push({
                num: registro.lista_espera_num,
                id: registro.alu_id,
                aluno: aluno[0],
                dataInsercao: registro.lista_espera_datainsercao,
                cor: registro.lista_espera_cor,
                status: registro.lista_espera_status
            });
        }

        return listaListaEspera;
    }

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

    async excluir(listaEspera, conexao) {
        const sql = `DELETE FROM listaespera WHERE lista_espera_num = $1`;
        await conexao.query(sql, [listaEspera.num]);
    }

    async alterar(listaEspera, conexao) {
        const sql = `
            UPDATE listaespera SET  
                lista_espera_dataInsercao = $1,
                lista_espera_cor = $2,
                lista_espera_status = $3
            WHERE lista_espera_num = $4
        `;
        const parametros = [
            listaEspera.dataInsercao,
            listaEspera.cor,
            listaEspera.status,
            listaEspera.num
        ];
        await conexao.query(sql, parametros);
    }
}

