/*//DAO - Data Access Object
import LisaEspera from "../Modelo/listaEspera.js";
//import conectar from "../Controle/Conexao.js";

export default class LisaEsperaDAO {

    constructor() {
        this.init();
    }

        async init() {
            try {
                const conexao = await conectar();

                await conexao.execute(`
                    CREATE TABLE IF NOT EXISTS listaEspera (
                        listEsp_id INTEGER NOT NULL AUTOINCREMENT,
                        alu_id INTEGER NOT NULL,
                        alu_nome VARCHAR(50) NOT NULL,
                        listEsp_dataInsercao DATE NOT NULL,
                        CONSTRAINT pk_listaEspera PRIMARY KEY(listEsp_id),
                        CONSTRAINT fk_listaEspera_protocolo FOREIGN KEY (alu_id) REFERENCES listaEspera(alu_id),
                        CONSTRAINT fk_listaEspera_nome FOREIGN KEY (alu_nome) REFERENCES listaEspera(alu_nome)
                    )
                `);                

                await conexao.release();
                console.log("Tabela 'listaEspera' foi recriada com sucesso.");
            } catch (e) {
                console.log("Não foi possível iniciar o banco de dados: " + e.message);
            }
        }
        
    async incluir(id, conexao) {
        // Buscar o id do listaEspera correspondente ao protocolo
        const [listaEspera] = await conexao.execute(`
            SELECT alu_nome FROM listaEspera WHERE alu_id = ?
        `, [id]);
    
        if (!listaEspera || listaEspera.length === 0) {
            console.error('Nenhum listaEspera encontrado com esse protocolo.');
            return;
        }
    
        const nome = registros[0].alu_nome;
    
        // Inserir na lista de espera
        await conexao.execute(`
            INSERT INTO listaEspera (alu_id, alu_nome, listaEsp_dataInsercao)
            VALUES (?, ?, DATE('now'))
        `, [id, nome]);
    
        console.log('Registro inserido com sucesso!');
    }
    
    async excluir(listaEspera, conexao) {
        if (listaEspera instanceof LisaEspera) {
            try {
                const sql = `DELETE FROM listaEspera WHERE listaEsp_id = ?`;
                await conexao.execute(sql, [listaEspera.id]);
            } catch (e) {
                throw new Error("Erro ao excluir funcionário: " + e.message);
            }
        }
    }
        async consultar(termo, conexao) {
            try {
                let sql = "";
                let parametros = [];
        
                if (!termo) {
                    sql = `SELECT * FROM listaEspera ORDER BY dataInsercao`;
                } else {
                    sql = `SELECT * FROM listaEspera WHERE nome LIKE ? ORDER BY func_nome`;
                    parametros = ['%' + termo + '%'];
                }
        
                const [linhas] = await conexao.execute(sql, parametros);
                const listaLisaEspera = linhas.map(linha => new LisaEspera(
                    linha['id'],
                    linha['id'],
                    linha['nome'],
                    linha['dataInsercao']
                ));
                return listaLisaEspera;
            } catch (e) {
                throw new Error("Erro ao consultar funcionários: " + e.message);
            }
        }
        
}*/

import ListaEspera from "../Modelo/listaEspera.js";
import Responsavel from "../Modelo/responsavel.js";
import Escola from "../Modelo/escola.js";
import conectar from "./Conexao.js";

export default class ListaEsperaDAO {

    constructor() {
        this.init();
    }

   
    async init() {
        try {
           
                let sql3 = 'DROP TABLE listaEspera';
            let conexao = await conectar();
            await conexao.execute(sql3);
             sql3 = `CREATE TABLE IF NOT EXISTS listaEspera (
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

            CONSTRAINT pk_listaEspera PRIMARY KEY (alu_id),

            -- assumindo que a tabela responsavel tem cpf como chave primária
            CONSTRAINT fk_listaEspera_responsavel FOREIGN KEY (alu_responsavel_cpf) 
                REFERENCES responsavel(resp_cpf)
                ON UPDATE CASCADE
                ON DELETE RESTRICT,

            CONSTRAINT fk_listaEspera_escola FOREIGN KEY (alu_escola_id) 
                REFERENCES escola(esc_id)
                ON UPDATE CASCADE
                ON DELETE RESTRICT
        );
        `;
            await conexao.execute(sql3);
            await conexao.release();
        } catch (e) {
            console.log("Erro ao iniciar banco de dados: " + e.message);
        }
    }



    async incluir(listaEspera, conexao) {

       // this.init();
        if (listaEspera instanceof ListaEspera) {
            const sql = `INSERT INTO listaEspera 
            (
                alu_nome, alu_data_nascimento, alu_responsavel_cpf, alu_rua, alu_numero, alu_escola_id, alu_telefone, 
                alu_periodo_escola, alu_realiza_acompanhamento, alu_possui_sindrome, alu_descricao, alu_dataInsercao
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            const parametros = [
                listaEspera.nome,
                listaEspera.dataNascimento,
                listaEspera.responsavel.cpf,
                listaEspera.rua,
                listaEspera.numero,
                listaEspera.escola.id,
                listaEspera.telefone,
                listaEspera.periodoEscola,
                listaEspera.realizaAcompanhamento,
                listaEspera.possuiSindrome,
                listaEspera.descricao, 
                listaEspera.dataInsercao
            ];
            await conexao.execute(sql, parametros);
        }
    }
    
    async consultar(termo, conexao) {
        let sql = ``;
        let parametros = [];
        if (parseInt(termo)) {
            sql = `SELECT * FROM listaEspera WHERE alu_id = ?`;
            parametros = [termo];
        } else {
            sql = `SELECT * FROM listaEspera WHERE alu_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
    
        const [registros] = await conexao.execute(sql, parametros);
        const listaListaEspera = [];
    
        for (const registro of registros) {
            // Buscar Responsável pelo CPF
            const responsavel = new Responsavel();
            const listaResp = await responsavel.consultar(registro['alu_responsavel_cpf'], conexao);
            const responsavelCompleto = listaResp[0];  // supondo que venha um array
    
            // Buscar Escola pelo ID
            const escola = new Escola();
            const listaEscola = await escola.consultar(registro['alu_escola_id'], conexao);
            const escolaCompleta = listaEscola[0];  // supondo que venha um array
    
            // Agora sim criar o ListaEspera com os objetos completos
            const listaEspera = new ListaEspera(
                registro['alu_id'],
                registro['alu_nome'],
                registro['alu_data_nascimento'],
                responsavelCompleto,
                registro['alu_rua'],
                registro['alu_numero'],
                escolaCompleta,
                registro['alu_telefone'],
                registro['alu_periodo_escola'],
                registro['alu_realiza_acompanhamento'],
                registro['alu_possui_sindrome'],
                registro['alu_descricao'],
                registro['alu_dataInsercao']
            );
            listaListaEspera.push(listaEspera);
        }
        return listaListaEspera;
    }

    async excluir(listaEspera, conexao) {
        if (listaEspera instanceof ListaEspera) {
            const sql = `DELETE FROM listaEspera WHERE alu_id = ?`;
            const parametros = [listaEspera.numProtocolo];
            await conexao.execute(sql, parametros);
        }
    }
    
    async alterar(listaEspera, conexao) {
        if (listaEspera instanceof ListaEspera) {
            const sql = `
                UPDATE listaEspera SET 
                    alu_nome = ?, 
                    alu_data_nascimento = ?, 
                    alu_responsavel_cpf = ?, 
                    alu_rua = ?, 
                    alu_numero = ?, 
                    alu_escola_id = ?, 
                    alu_telefone = ?, 
                    alu_periodo_escola = ?, 
                    alu_realiza_acompanhamento = ?, 
                    alu_possui_sindrome = ?, 
                    alu_descricao = ?, 
                    alu_dataInsercao = ?
                WHERE alu_id = ?
            `;
            const parametros = [
                listaEspera.nome,
                listaEspera.dataNascimento,
                listaEspera.responsavel.cpf,
                listaEspera.rua,
                listaEspera.numero,
                listaEspera.escola.id,
                listaEspera.telefone,
                listaEspera.periodoEscola,
                listaEspera.realizaAcompanhamento,
                listaEspera.possuiSindrome,
                listaEspera.descricao, 
                listaEspera.dataInsercao,
                listaEspera.numProtocolo
            ];
            await conexao.execute(sql, parametros);
        }
    }
    
}