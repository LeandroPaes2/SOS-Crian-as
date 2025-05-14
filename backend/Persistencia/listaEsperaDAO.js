/*import ListaEspera from "../Modelo/listaEspera.js";
import Aluno from "../Modelo/aluno.js";
import conectar from "./Conexao.js";

export default class ListaEsperaDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS listaespera (
                    alu_id INT PRIMARY KEY,
                    lista_espera_dataInsercao DATE NOT NULL,
                    lista_espera_prioridade INT NOT NULL,
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
    }

    async incluir(listaEspera, conexao) {
        if (listaEspera instanceof ListaEspera) {
            const sql = `
                INSERT INTO listaEspera (
                    alu_id, lista_espera_dataInsercao, lista_espera_prioridade, lista_espera_status
                ) VALUES ($1, $2, $3, $4)
            `;
            const parametros = [
                listaEspera.id,
                listaEspera.dataInsercao,
                listaEspera.prioridade,
                listaEspera.status
            ];
            await conexao.query(sql, parametros);
        }
    }

    async consultarEscola(termo, conexao) {

        let parametros = [];
        let sql = `SELECT * FROM escola WHERE esc_id = ?`;
        parametros = [termo];

        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaEscola = [];
        for (const linha of linhas) {
            const escola = new Escola(
                linha['esc_id'],
                linha['esc_nome'],
                linha['esc_endereco'],
                linha['esc_telefone'],
                linha['esc_tipo']

            );
            listaEscola.push(escola);
        }

        return listaEscola;
    }

    async consultarResponsavel(termo) {
        //resuperar as linhas da tabela produto e transformá-las de volta em produtos
        const conexao = await conectar();
        let parametros = [];
        let sql = `SELECT * FROM responsavel r
                   WHERE resp_cpf = ?`
        parametros = [termo];

        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaResponsavel = [];
        for (const linha of linhas) {
            const responsavel = new Responsavel(
                linha['resp_cpf'],
                linha['resp_nome'],
                linha['resp_telefone']
            );
            listaResponsavel.push(responsavel);
        }
        await conexao.release();
        return listaResponsavel;
    }

    async consultarAluno(termo, conexao) {

        let parametros = [];
        let sql = `SELECT * FROM aluno WHERE alu_id = ?`;
        parametros = [termo];


        const [registros] = await conexao.query(sql, parametros);
        const listaAluno = [];

        for (const registro of registros) {
            // Buscar Responsável pelo CPF

            const respon = await consultarResponsavel(registro['alu_responsavel_cpf'], conexao);
            const responsavel = new Responsavel(respon.cpf, respon.nome, respon.telefone);

            // Buscar FormularioSaude pelo aluno_id
            const formularioSaude = null;

            // Buscar Ficha pelo aluno_id
            const ficha = null;


            // Buscar Escola pelo ID
            const esco = await consultarEscola(registro['alu_escola_id'], conexao);
            const escola = new Escola(esco.nome, esco.endereco, esco.telefone, esco.tipo);


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
    }

    async consultar(termo, conexao) {
        let sql = `SELECT * FROM listaespera`;
        let parametros = [];

        if (termo?.id) {
            sql = `SELECT * FROM listaespera WHERE alu_id = $1`;
            parametros = [termo.id];
        } else if (termo?.aluno && termo.aluno.nome) {
            sql = `
            SELECT * FROM listaespera 
            WHERE alu_id = (
                SELECT alu_id FROM aluno WHERE alu_nome ILIKE $1 LIMIT 1
            )
            `;
            parametros = [`%${termo.aluno.nome}%`];
        } else if (termo?.prioridade) {
            sql = `SELECT * FROM listaespera WHERE lista_espera_prioridade = $1`;
            parametros = [termo.prioridade];
        } else if (termo?.status) {
            sql = `SELECT * FROM listaespera WHERE lista_espera_status = $1`;
            parametros = [termo.status];
        }

        const resultado = await conexao.query(sql, parametros);
        const listaListaEspera = [];

        for (const registro of resultado.rows) {
            const listaAlu = await this.consultarAluno(registro.alu_id, conexao);
            const alunoCompleto = listaAlu[0];

            const listaEspera = new ListaEspera(
                registro.alu_id,
                alunoCompleto,
                registro.lista_espera_datainsercao,
                registro.lista_espera_prioridade,
                registro.lista_espera_status
            );
            listaListaEspera.push(listaEspera);
        }

        return listaListaEspera;
    }


    async excluir(listaEspera, conexao) {
        if (listaEspera instanceof ListaEspera) {
            const sql = `DELETE FROM listaEspera WHERE alu_id = $1`;
            await conexao.query(sql, [listaEspera.id]);
        }
    }

    async alterar(listaEspera, conexao) {
        if (listaEspera instanceof ListaEspera) {
            const sql = `
                UPDATE listaEspera SET  
                    lista_espera_dataInsercao = $1,
                    lista_espera_prioridade = $2,
                    lista_espera_status = $3
                WHERE alu_id = $4
            `;
            const parametros = [
                listaEspera.dataInsercao,
                listaEspera.prioridade,
                listaEspera.status,
                listaEspera.id
            ];
            await conexao.query(sql, parametros);
        }
    }
}*/




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
                    alu_id INT PRIMARY KEY NOT NULL,
                    lista_espera_dataInsercao DATE NOT NULL,
                    lista_espera_prioridade INT NOT NULL,
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
        const sql = `
            INSERT INTO listaespera (
                alu_id, lista_espera_dataInsercao, lista_espera_prioridade, lista_espera_status
            ) VALUES ($1, $2, $3, $4)
        `;
        const parametros = [
            listaEspera.id,
            listaEspera.dataInsercao,
            listaEspera.prioridade,
            listaEspera.status
        ];
        await conexao.query(sql, parametros);
    }

    async consultar(termo, conexao) {
        let sql = `SELECT * FROM listaespera`;
        let parametros = [];

        if (termo?.id) {
            sql = `SELECT * FROM listaespera WHERE alu_id = $1`;
            parametros = [termo.id];
        } else if (termo?.aluno && termo.aluno.nome) {
            sql = `
                SELECT * FROM listaespera 
                WHERE alu_id = (
                    SELECT alu_id FROM aluno WHERE alu_nome ILIKE $1 LIMIT 1
                )
            `;
            parametros = [`%${termo.aluno.nome}%`];
        } else if (termo?.prioridade) {
            sql = `SELECT * FROM listaespera WHERE lista_espera_prioridade = $1`;
            parametros = [termo.prioridade];
        } else if (termo?.status) {
            sql = `SELECT * FROM listaespera WHERE lista_espera_status = $1`;
            parametros = [termo.status];
        }

        const resultado = await conexao.query(sql, parametros);
        const listaListaEspera = [];

        for (const registro of resultado.rows) {
            const aluno = await this.consultarAluno(registro.alu_id, conexao);

            listaListaEspera.push({
                id: registro.alu_id,
                aluno: aluno[0],
                dataInsercao: registro.lista_espera_datainsercao,
                prioridade: registro.lista_espera_prioridade,
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
        const sql = `DELETE FROM listaespera WHERE alu_id = $1`;
        await conexao.query(sql, [listaEspera.id]);
    }

    async alterar(listaEspera, conexao) {
        const sql = `
            UPDATE listaespera SET  
                lista_espera_dataInsercao = $1,
                lista_espera_prioridade = $2,
                lista_espera_status = $3
            WHERE alu_id = $4
        `;
        const parametros = [
            listaEspera.dataInsercao,
            listaEspera.prioridade,
            listaEspera.status,
            listaEspera.id
        ];
        await conexao.query(sql, parametros);
    }
}

