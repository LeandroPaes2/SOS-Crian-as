import Aluno from "../Modelo/aluno.js";
import Escola from "../Modelo/escola.js";
import AlunoResponsavel from "../Modelo/alunoResponsavel.js";
import Responsavel from "../Modelo/responsavel.js";


export default class AlunoDAO {


    constructor() {
    }


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
                alu_escola_id,
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
                $11, $12, $13, $14, $15, $16
            )
            RETURNING alu_id;
        `;

            aluno = aluno.toJSON();

            try {
                // Inserir aluno primeiro e pegar alu_id
                const parametros = [
                    aluno.nome,
                    aluno.dataNascimento,
                    aluno.cidade,
                    aluno.rua,
                    aluno.bairro,
                    aluno.numero,
                    aluno.telefone,
                    aluno.escola.id,
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
                const alu_id = resp.rows[0].alu_id;
                aluno.id = alu_id;  // salva o id no objeto para uso posterior

                





                // Inserindo os responsáveis vinculados
                const listaResponsaveisAluno = aluno.listaResponsaveis;

               

                if (Array.isArray(listaResponsaveisAluno)) {
                    for (let i = 0; i < listaResponsaveisAluno.length; i++) {
                        const objRespAux = new Responsavel(listaResponsaveisAluno[i]);
                        const alunoResponsavel = new AlunoResponsavel(aluno, objRespAux);
                        await alunoResponsavel.incluir( conexao);
                    }
                }
                return alu_id;
            } catch (e) {
                console.log("Erro ao cadastrar aluno ou alunoResponsavel: ", e);
                throw e;
            }
        } else {
            throw new Error("Objeto não é instância de Aluno.");
        }
    }



    //preciso corrijir o status no front mais as gambiarras no geral funciona

    /* async incluir(aluno, conexao) {
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
                     alu_escola_id,
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
                 $11, $12, $13, $14, $15 ,$16
             ) RETURNING alu_id;
             `;
 
             const parametros = [
                 aluno.nome,
                 aluno.dataNascimento,
                 aluno.cidade,
                 aluno.rua,
                 aluno.bairro,
                 aluno.numero,
                 aluno.telefone,
                 aluno.escola.id,
                 aluno.periodoEscola,
                 aluno.realizaAcompanhamento,
                 aluno.possuiSindrome,
                 aluno.descricao,
                 aluno.rg,
                 aluno.status,
                 aluno.periodoProjeto,
                 aluno.cep
             ];
             const alu_id = await conexao.query(sql, parametros);
 
           
             aluno=aluno.toJSON();
             console.log("aaaaaaaaaaaaaaaaaa");
             const alunoResponsavel = new AlunoResponsavel();
             let listaResponsaveisAluno = aluno.listaResponsaveis;
 
 
             // let listaRespSql = await alunoResponsavel.consultar(aluno, conexao);
 
             // console.log("b");
             // let i = 0;
             // for (i = 0; i < listaRespSql.length; i++) {
             //     let flag = false;
             //     for (let j = 0; j < listaResponsaveisAluno.length; j++) {
             //         if (listaResponsaveisAluno[j] === listaRespSql[i].resp_cpf) {
             //             listaResponsaveisAluno.splice(j, 1);
             //             j--;
             //             flag = true
             //         }
             //     }
             //     if (flag === false) {
             //         await alunoResponsavel.excluir(aluno, conexao);
             //         listaRespSql.splice(i, 1);
             //         i--;
             //     }
             // }
 
 
             console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
             console.log(listaResponsaveisAluno);
 
             try {
                 let i = 0;
                 for (i = 0; i < listaResponsaveisAluno.length; i++) {
                     const objRespAux = new Responsavel(listaResponsaveisAluno[i]);
                     const objAux = new AlunoResponsavel(aluno, objRespAux);
                     const resposta =await alunoResponsavel.incluir(objAux, conexao);
                 }
             }
             catch (e) {
                 console.log("Erro ao cadastrar alunoResponsavel: " + e);
             }
 
 
             // console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
 
             //console.log(aluno.escola[0].id);
             // console.log(aluno);
             // console.log("teste escola id : "+ aluno.escola.id );
             // console.log("alu escola id : "+ aluno.escola[0].id );
 
             return resp;
         }
     }*/

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

                let escola = new Escola();
                escola = await escola.consultar(registro['alu_escola_id'], conexao);
                //console.log(escola);


                const aluno = new Aluno(
                    registro['alu_id'],
                    registro['alu_nome'],
                    registro['alu_data_nascimento'],
                    registro['alu_cidade'],
                    registro['alu_rua'],
                    registro['alu_bairro'],
                    registro['alu_numero'],
                    registro['alu_telefone'],
                    escola[0],
                    registro['alu_periodo_escola'],
                    registro['alu_realiza_acompanhamento'],
                    registro['alu_possui_sindrome'],
                    null,
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