import conectar from "./Conexao.js";
import Aluno from "../Modelo/aluno.js";
export default class AlunoDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
            CREATE TABLE IF NOT EXISTS aluno (
                alu_nome VARCHAR(100) NOT NULL,
                alu_idade INT NOT NULL,
                alu_responsavel VARCHAR(100) NOT NULL,
                alu_endereco VARCHAR(255) NOT NULL,
                alu_telefone VARCHAR(20) NOT NULL,
                alu_periodoProjeto VARCHAR(50) NOT NULL,
                alu_periodoEscola VARCHAR(50) NOT NULL,
                CONSTRAINT pk_aluno PRIMARY KEY(alu_nome)
            );
            `;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(aluno) {
        if (aluno instanceof Aluno) {
            const conexao = await conectar();
            const sql = `INSERT INTO aluno (alu_nome, alu_idade, alu_responsavel, alu_endereco, alu_telefone, alu_periodoProjeto, alu_periodoEscola)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            let parametros = [
                aluno.nome,
                aluno.idade,
                aluno.responsavel,
                aluno.endereco,
                aluno.telefone,
                aluno.periodoProjeto,
                aluno.periodoEscola
            ];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let sql = `SELECT * FROM aluno WHERE alu_nome LIKE ?`;
        let parametros = ['%' + termo + '%'];
        const [linhas] = await conexao.execute(sql, parametros);
        let listaAlunos = linhas.map(linha => new Aluno(
            linha['alu_nome'],
            linha['alu_idade'],
            linha['alu_responsavel'],
            linha['alu_endereco'],
            linha['alu_telefone'],
            linha['alu_periodoProjeto'],
            linha['alu_periodoEscola']
        ));
        await conexao.release();
        return listaAlunos;
    }

    async excluir(aluno) {
        if (aluno instanceof Aluno) {
            const conexao = await conectar();
            const sql = `DELETE FROM aluno WHERE alu_nome = ?`;
            let parametros = [aluno.nome];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async alterar(aluno) {
        if (aluno instanceof Aluno) {
            const conexao = await conectar();
            const sql = `UPDATE aluno SET alu_idade=?, alu_responsavel=?, alu_endereco=?, alu_telefone=?, alu_periodoProjeto=?, alu_periodoEscola=? WHERE alu_nome=?`;
            let parametros = [
                aluno.idade,
                aluno.responsavel,
                aluno.endereco,
                aluno.telefone,
                aluno.periodoProjeto,
                aluno.periodoEscola,
                aluno.nome
            ];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }
}