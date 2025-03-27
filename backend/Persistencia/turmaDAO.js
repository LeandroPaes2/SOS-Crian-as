//DAO - Data Access Object
import Turma from "../Modelo/turma.js";
//import Aluno from "../Modelo/aluno.js";

import conectar from "./Conexao.js";
export default class TurmaDAO {
    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS turma(
                turm_cor VARCHAR(40) NOT NULL,
                turm_per VARCHAR(30) NOT NULL,
                CONSTRAINT pk_turma PRIMARY KEY(turm_cor)
            );
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(turma) {
        if (turma instanceof Turma) {
            const conexao = await conectar();
            const sql = `INSERT INTO turma(turm_cor, turm_per)
                VALUES (?, ?)
            `;
            let parametros = [
                turma.cor,
                turma.periodo
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }

    async alterar(turma) {
        if (turma instanceof Turma) {
            const conexao = await conectar();
            const sql = `UPDATE turma SET turm_per =?
                WHERE  turm_cor = ?
            `;
            let parametros = [
                turma.periodo,
                turma.cor
            ]; 
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
    
    async consultar(termo) {
        //resuperar as linhas da tabela produto e transformá-las de volta em produtos
        const conexao = await conectar();
        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM turma t
                   WHERE turm_cor LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
        else {
            sql = `SELECT * FROM turma t
                   WHERE turm_cor = ?`
            parametros = [termo];
        }
        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaTurma = [];
        for (const linha of linhas) {
            const turma = new Turma(
                linha['turm_cor'],
                linha['turm_per']
            );
            listaTurma.push(turma);
        }
        await conexao.release();
        return listaTurma;
    }

    async excluir(turma) {
        if (turma instanceof Turma) {
            const conexao = await conectar();
            const sql = `DELETE FROM turma WHERE turm_cor = ?`;
            let parametros = [
                turma.cor
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
}