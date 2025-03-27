import Materia from "../Modelo/materia.js";

import conectar from "./Conexao.js";
export default class MateriaDAO {
    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); 
            const sql = `
            CREATE TABLE IF NOT EXISTS materia(
                mat_nome VARCHAR(40) NOT NULL,
                mat_desc VARCHAR(30) NOT NULL,
                CONSTRAINT pk_materia PRIMARY KEY(mat_nome)
            );
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(materia) {
        if (materia instanceof Materia) {
            const conexao = await conectar();
            const sql = `INSERT INTO materia(mat_nome, mat_desc)
                VALUES (?, ?)
            `;
            let parametros = [
                materia.nome,
                materia.descricao
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async alterar(materia) {
        if (materia instanceof Materia) {
            const conexao = await conectar();
            const sql = `UPDATE materia SET mat_desc =?
                WHERE  mat_nome = ?
            `;
            let parametros = [
                materia.descricao,
                materia.nome
            ]; 
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }
    
    async consultar(termo) {
        const conexao = await conectar();
        let sql = "";
        let parametros = [];
        if (!termo) {
            sql = `SELECT * FROM materia m
                   WHERE mat_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
        else {
            sql = `SELECT * FROM materia m
                   WHERE mat_nome = ?`
            parametros = [termo];
        }
        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listamateria = [];
        for (const linha of linhas) {
            const materia = new materia(
                linha['mat_nome'],
                linha['mat_desc']
            );
            listamateria.push(materia);
        }
        await conexao.release();
        return listamateria;
    }

    async excluir(materia) {
        if (materia instanceof Materia) {
            const conexao = await conectar();
            const sql = `DELETE FROM materia WHERE mat_nome = ?`;
            let parametros = [
                materia.nome
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }
}