import conectar from "./Conexao.js";
import Aluno from "../Modelo/aluno.js";

export default class AlunoDAO {



    constructor() {
    }
    /*
    async init() {
        try {
            const sql2="DROP TABLE aluno";
            await conexao.execute(sql2);
           /* const sql = `CREATE TABLE IF NOT EXISTS aluno (
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
        } catch (e) {
            console.log("Erro ao iniciar banco de dados: " + e.message);
        }
    }
    */
    async incluir(aluno,conexao) {
        if (aluno instanceof Aluno) {
            const sql = `INSERT INTO aluno 
    (alu_id,alu_nome, alu_idade, alu_responsavel, alu_endereco, alu_telefone, alu_periodoProjeto, alu_periodoEscola)
    VALUES (?,?, ?, ?, ?, ?, ?, ?)`;

            const parametros = [
                aluno.id,
                aluno.nome, aluno.idade, aluno.responsavel,
                aluno.endereco, aluno.telefone,
                aluno.periodoProjeto, aluno.periodoEscola
            ];
            await conexao.execute(sql, parametros);
        }
    }

    async consultar(termo,conexao) {
        
        let sql = ``;
        let parametros= [];
        if(parseInt(termo)){
            sql = `SELECT * FROM aluno WHERE alu_numProtocolo = ?`;
            parametros = [termo];
        }
        else
        {
            termo="";
            sql = `SELECT * FROM aluno WHERE alu_nome LIKE ?`;
            parametros = ['%' + termo + '%'];

        }

        const [registros,campos] = await conexao.execute(sql, parametros);
        let listaAluno = [];
        for (const registro of registros) {
            const aluno = new Aluno(
                registro['alu_nome'],
                registro['alu_idade'],
                registro['alu_responsavel'],
                registro['alu_endereco'],
                registro['alu_telefone'],
                registro['alu_periodoProjeto'],
                registro['alu_periodoEscola'],
                registro['alu_id'],
            );
            listaAluno.push(aluno);
        }
        return listaAluno;
    }

    async excluir(aluno,conexao) {
        if (aluno instanceof Aluno) {
            const sql = `DELETE FROM aluno WHERE alu_id = ?`;
            let parametros =[
                aluno.id
            ];
            await conexao.execute(sql, parametros);
        }
    }

    async alterar(aluno,conexao) {
        if (aluno instanceof Aluno) {
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
        }
    }
}
