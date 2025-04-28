

import ListaEspera from "../Modelo/listaEspera.js";
import Responsavel from "../Modelo/responsavel.js";
import Escola from "../Modelo/escola.js";
//import conectar from "./Conexao.js";

export default class ListaEsperaDAO {

 /*   constructor() {
        this.init();
    }

   
    async init() {
        try {
           
             //   let sql3 = 'DROP TABLE listaEspera';
            let conexao = await conectar();
           // await conexao.execute(sql3);
            let sql3 = `CREATE TABLE IF NOT EXISTS listaEspera (
            alu_id INT AUTO_INCREMENT NOT NULL,
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
    }*/



    async incluir(listaEspera, conexao) {

       // this.init();
        if (listaEspera instanceof ListaEspera) {
            try {
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
                //   await conexao.release();
            } catch (e) {
                throw new Error("Erro ao incluir na lista de espera: " + e.message);
            }
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