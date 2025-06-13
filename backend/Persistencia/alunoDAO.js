import Aluno from "../Modelo/aluno.js";
import Escola from "../Modelo/escola.js";
import Responsavel from "../Modelo/responsavel.js";

export default class AlunoDAO {


    constructor() {
    }

    //preciso corrijir o status no front mais as gambiarras no geral funciona

    async incluir(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `
                INSERT INTO aluno (
                    alu_nome,
                    alu_data_nascimento,
                    alu_cidade,
                    alu_rua,
                    alu_bairro,
                    alu_numero,
                    alu_telefone,
                    alu_periodo_escola,
                    alu_realiza_acompanhamento,
                    alu_possui_sindrome,
                    alu_descricao,
                    alu_rg,
                    alu_status,
                    alu_periodo_projeto,
                    alu_cep
                )
                VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15
            );
            `;

            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.cidade,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.rg,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep
            ];
            const resp = await conexao.query(sql, parametros);
            return resp.rows[0].id;
        }
    }

    async consultar(termo, tipo, conexao) {
        
            let sql = '';
            let parametros = [];

            if (tipo === 0 || tipo === 1) {
                sql = `SELECT * FROM aluno WHERE alu_nome ILIKE $1`;  // ILIKE para busca sem diferenciar maiúsculas/minúsculas
                parametros = ['%' + termo + '%'];  // Use o % para buscar partes do nome, se necessário
            } else if (tipo === 2) {
                sql = `SELECT * FROM aluno WHERE alu_rg LIKE $1`;  // ILIKE para busca sem diferenciar maiúsculas/minúsculas
                parametros = ['%' + termo + '%'];  // % para busca parcial
            } else if (tipo === 3) {
                sql = `SELECT * FROM aluno WHERE alu_id = $1`;
                parametros = [termo];
            }

            const reg = await conexao.query(sql, parametros);
            const registros = reg.rows;
            const listaAluno = [];

            for (const registro of registros) {
                if (registro) {
                    
                    const aluno = new Aluno(
                        registro['alu_id'],
                        registro['alu_nome'],
                        registro['alu_data_nascimento'],
                        registro['alu_cidade'],
                        registro['alu_rua'],
                        registro['alu_bairro'],
                        registro['alu_numero'],
                        registro['alu_telefone'],
                        registro['alu_periodo_escola'],
                        registro['alu_realiza_acompanhamento'],
                        registro['alu_possui_sindrome'],
                        registro['alu_descricao'],
                        registro['alu_rg'],
                        registro['alu_status'],
                        registro['alu_periodo_projeto'],
                        registro['alu_cep']
                    );
                    listaAluno.push(aluno);
                }
            }
            return listaAluno;
    }

    // Excluir Não pode excluir fisicamente !!!!! ARRUMAR !!!!!
    async excluir(aluno, conexao) {
        if (aluno instanceof Aluno) {
            const sql = `DELETE FROM aluno WHERE alu_id = $1`;
            const parametros = [aluno.id];
            await conexao.query(sql, parametros);
            return true;
        }
        return false;
    }

    async alterar(aluno, conexao) {
        if (aluno instanceof Aluno) {

            const sql = `
                    UPDATE aluno SET 
                        alu_nome = $1,
                        alu_data_nascimento = $2,
                        alu_cidade = $3,
                        alu_rua = $4,
                        alu_bairro = $5,
                        alu_numero = $6,
                        alu_telefone = $7,
                        alu_periodo_escola = $8,
                        alu_realiza_acompanhamento = $9,
                        alu_possui_sindrome = $10,
                        alu_descricao = $11,
                        alu_rg = $12,
                        alu_status = $13,
                        alu_periodo_projeto = $14,
                        alu_cep = $15
                    WHERE alu_id = $16
                `;

            const parametros = [
                aluno.nome,
                aluno.dataNascimento,
                aluno.cidade,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.rg,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep,
                aluno.id // este é o identificador usado no WHERE
            ];

            const resp = await conexao.query(sql, parametros);
            return resp;

        }
        return false;
    }

}