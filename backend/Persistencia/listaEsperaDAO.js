import ListaEspera from "../Modelo/listaEspera.js";
import Aluno from "../Modelo/aluno.js";
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
            alu_id INT NOT NULL,
            lista_espera_dataInsercao DATE NOT NULL,
            lista_espera_prioridade INT NOT NULL,
            lista_espera_status INT NOT NULL,

            CONSTRAINT pk_listaEspera PRIMARY KEY (alu_id),

            -- assumindo que a tabela aluno tem cpf como chave primária
            CONSTRAINT fk_listaEspera_aluno FOREIGN KEY (alu_id) 
                REFERENCES aluno(alu_id)
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
        if (listaEspera instanceof ListaEspera) {
            try {
                const sql = `INSERT INTO listaEspera 
                (
                    alu_id, lista_espera_dataInsercao, lista_espera_prioridade, lista_espera_status
                )
                VALUES (?, ?, ?, ?)`;
        
                const parametros = [
                    listaEspera.id,
                    listaEspera.dataInsercao,
                    listaEspera.prioridade,
                    listaEspera.status
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

        if (!termo || (typeof termo !== 'object')) {
            sql = `SELECT * FROM listaEspera`;
        } else if (termo.nome) {
            sql = `SELECT * FROM listaEspera WHERE alu_id = ( 
                SELECT alu_id FROM aluno WHERE alu_nome LIKE ?
            )
            `;
            parametros = ['%' + termo.nome + '%'];
        } else if (termo.prioridade) {
            sql = `SELECT * FROM listaEspera WHERE lista_espera_prioridade = ? `;
            parametros = [termo.prioridade];
        }
        else if (termo.status) {
            sql = `SELECT * FROM listaEspera WHERE lista_espera_status = ? `;
            parametros = [termo.status];
        }
    
        const [registros] = await conexao.execute(sql, parametros);
        const listaListaEspera = [];
    
        for (const registro of registros) {
            // Buscar Aluno pelo id
            const aluno = new Aluno();
            const listaAlu = await aluno.consultar(registro['alu_id'], conexao);
            const alunoCompleto = listaAlu[0];  // supondo que venha um array
    
            // Agora sim criar o ListaEspera com os objetos completos
            const listaEspera = new ListaEspera(
                registro['alu_id'],
                alunoCompleto,
                registro['lista_espera_dataInsercao'],
                registro['lista_espera_prioridade'],
                registro['lista_espera_status']
            );
            listaListaEspera.push(listaEspera);
        }
        return listaListaEspera;
    }

    async excluir(listaEspera, conexao) {
        if (listaEspera instanceof ListaEspera) {
            const sql = `DELETE FROM listaEspera WHERE alu_id = ?`;
            const parametros = [listaEspera.id];
            await conexao.execute(sql, parametros);
        }
    }
    
    async alterar(listaEspera, conexao) {
        if (listaEspera instanceof ListaEspera) {
            const sql = `
                UPDATE listaEspera SET  
                    lista_espera_dataInsercao = ?,
                    lista_espera_prioridade = ?,
                    lista_espera_status = ?
                WHERE alu_id = ?
            `;
            const parametros = [
                listaEspera.aluno.id,
                listaEspera.dataInsercao,
                listaEspera.prioridade,
                listaEspera.status,
                listaEspera.id
            ];
            await conexao.execute(sql, parametros);
        }
    }
    
}