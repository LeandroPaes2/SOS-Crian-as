/*import ListaEspera from "../Modelo/listaEspera.js";
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
    
}*/



import ListaEspera from "../Modelo/listaEspera.js";
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
            const aluno = new Aluno();
            const listaAlu = await aluno.consultar(registro.alu_id, conexao);
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
}
