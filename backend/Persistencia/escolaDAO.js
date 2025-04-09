import Escola from "../Modelo/escola.js";
import conectar from "./Conexao.js";

export default class EscolaDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); // retorna uma conexão
            const sql = `
                CREATE TABLE IF NOT EXISTS escola(
                    esc_nome VARCHAR(50) NOT NULL,
                    esc_endereco VARCHAR(100) NOT NULL,
                    esc_telefone VARCHAR(20) NOT NULL,
                    esc_tipo VARCHAR(30) NOT NULL,
                    CONSTRAINT pk_escola PRIMARY KEY(esc_nome)
                );
            `;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(escola) {
        if (escola instanceof Escola) {
            const conexao = await conectar();
            const sql = `
                INSERT INTO escola(esc_nome, esc_endereco, esc_telefone, esc_tipo)
                VALUES (?, ?, ?, ?)
            `;
            let parametros = [
                escola.nome,
                escola.endereco,
                escola.telefone,
                escola.tipo
            ];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async alterar(escola) {
        if (escola instanceof Escola) {
            const conexao = await conectar();
            const sql = `
                UPDATE escola 
                SET esc_endereco = ?, esc_telefone = ?, esc_tipo = ?
                WHERE esc_nome = ?
            `;
            let parametros = [
                escola.endereco,
                escola.telefone,
                escola.tipo,
                escola.nome
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
            sql = `SELECT * FROM escola WHERE esc_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        } else {
            sql = `SELECT * FROM escola WHERE esc_nome = ?`;
            parametros = [termo];
        }

        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaEscola = [];
        for (const linha of linhas) {
            const escola = new Escola(
                linha['esc_nome'],
                linha['esc_endereco'],
                linha['esc_telefone'],
                linha['esc_tipo']
            );
            listaEscola.push(escola);
        }
        await conexao.release();
        return listaEscola;
    }

    async excluir(escola) {
        if (escola instanceof Escola) {
            const conexao = await conectar();
            const sql = `DELETE FROM escola WHERE esc_nome = ?`;
            let parametros = [escola.nome];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }
}
