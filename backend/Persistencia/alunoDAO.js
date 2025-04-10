import conectar from "./Conexao.js";
import Aluno from "../Modelo/aluno.js";

export default class AlunoDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `CREATE TABLE IF NOT EXISTS aluno (
                alu_id INT AUTO_INCREMENT PRIMARY KEY,
                alu_nome VARCHAR(100) NOT NULL,
                alu_idade INT NOT NULL,
                alu_responsavel VARCHAR(100) NOT NULL,
                alu_endereco VARCHAR(255) NOT NULL,
                alu_telefone VARCHAR(20) NOT NULL,
                alu_periodoProjeto VARCHAR(50) NOT NULL,
                alu_periodoEscola VARCHAR(50) NOT NULL
            );`;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Erro ao iniciar banco de dados: " + e.message);
        }
    }

    async incluir(aluno) {
        if (aluno instanceof Aluno) {
            const conexao = await conectar();
            const sql = `INSERT INTO aluno 
    (alu_nome, alu_idade, alu_responsavel, alu_endereco, alu_telefone, alu_periodoProjeto, alu_periodoEscola)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const parametros = [
                aluno.nome, aluno.idade, aluno.responsavel,
                aluno.endereco, aluno.telefone,
                aluno.periodoProjeto, aluno.periodoEscola
            ];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let sql = ``;
        let parametros= [];
        if(parseInt(termo)){
            sql = `SELECT * FROM aluno WHERE alu_id = ?`;
            parametros = [termo];
        }


        if(termo){
            sql = `SELECT * FROM aluno WHERE alu_nome LIKE ?`;
            parametros = ['%' + termo + '%'];
        }
        else
        {
            termo="";
            sql = `SELECT * FROM aluno WHERE alu_nome LIKE ?`;
            parametros = ['%' + termo + '%'];

        }

        const [registros,campos] = await conexao.execute(sql, parametros);
        await conexao.release();
        let listaAluno = [];
        for (const registro of registros) {
            const aluno = new Aluno(
                registro['alu_id'],
                registro['alu_nome'],
                registro['alu_idade'],
                registro['alu_responsavel'],
                registro['alu_endereco'],
                registro['alu_telefone'],
                registro['alu_periodoProjeto'],
                registro['alu_periodoEscola']
            );
            listaAluno.push(aluno);
        }
        return listaAluno;
    }

    async excluir(aluno) {
        if (aluno instanceof Aluno) {
            const conexao = await conectar();
            const sql = `DELETE FROM aluno WHERE alu_id = ?`;
            let parametros =[
                aluno.id
            ];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async alterar(aluno) {
        if (aluno instanceof Aluno) {
            const conexao = await conectar();
            const sql = `
                UPDATE aluno SET 
                    alu_nome = ?, 
                    alu_idade = ?, 
                    alu_responsavel = ?, 
                    alu_endereco = ?, 
                    alu_telefone = ?, 
                    alu_periodoProjeto = ?, 
                    alu_periodoEscola = ?
                WHERE alu_id = ?
            `;
            const parametros = [
                aluno.nome, aluno.idade, aluno.responsavel,
                aluno.endereco, aluno.telefone,
                aluno.periodoProjeto, aluno.periodoEscola,
                aluno.id
            ];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }
}
