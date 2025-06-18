import Aluno from '../Modelo/aluno.js';
import Matricula from '../Modelo/Matricula.js';


export default class MatriculaDAO {

    constructor() {
    }

    async incluir(matricula, conexao) {
        if (matricula instanceof Matricula) {
            try {
                let alunoConsultado = matricula.aluno
                // alunoConsultado = await alunoConsultado.consultar(matricula.aluno.id, 3, conexao);
                // alunoConsultado = alunoConsultado[0];


                alunoConsultado.status = 1; 
                await alunoConsultado.alterar(conexao);


                const sql = `INSERT INTO matricula(mat_alu_id, mat_turma_id, mat_data_inclusao_projeto, mat_data_matricula, mat_data_vencimento, mat_motivo_desligamento, mat_status)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`;

                const parametros = [
                    matricula.aluno.id,
                    matricula.turma.id,
                    matricula.dataInclusaoProjeto,
                    matricula.dataMatricula,
                    matricula.dataVencimento,
                    matricula.motivoDesligamento,
                    matricula.status
                ];

                await conexao.query(sql, parametros);
            }
            catch (e) {
                throw new Error("Erro ao incluir matricula: " + e.message);
            }

            return true;

        }
        else {
            throw new Error("Objeto não é instância de MAtricula.");
        }
    }

    async consultar(termo, conexao) {
        let matriculas = [];
        try {
            let sql = "";
            let parametros = [];

            if (!termo) {
                sql = `SELECT * FROM matricula`;
            }
            else{
                termo.matricula.id ? sql = `SELECT * FROM matricula WHERE mat_id = $1` : sql = `SELECT * FROM matricula WHERE mat_alu_id = $1`;
            }
            const resultado = await conexao.query(sql, parametros);
            const linhas = resultado.rows;
            for (const linha of linhas) {
                matriculas.push(new Matricula(
                    linha['mat_id'],
                    new Aluno(linha['mat_alu_id']),
                    new Turma(linha['mat_turm_id']),
                    linha['mat_data_inclusao_projeto'],
                    linha['mat_data_matricula'],
                    linha['mat_data_vencimento'],
                    linha['mat_motivo_desligamento'],
                    linha['mat_status']
                ));
            }
        } catch (e) {
            throw new Error("Erro ao consultar matricula: " + e.message);
        }
        return matriculas;
    }

    async alterar(matricula,conexao)
    {
        const sql=`UPDATE matricula SET mat_alu_id=$1, mat_turm_id=$2, mat_data_inclusao_projeto=$3, mat_data_matricula=$4, mat_data_vencimento=$5, mat_motivo_desligamento=$6, mat_status=$7 WHERE mat_id=$8`;
        const parametros=[
            matricula.aluno.id,
            matricula.turma.id,
            matricula.dataInclusaoProjeto,
            matricula.dataMatricula,
            matricula.dataVencimento,
            matricula.motivoDesligamento,
            matricula.status,
            matricula.id
        ]
        const resp = await conexao.query(sql, parametros);
        return resp;
    }

    async excluir(matricula,conexao)
    {
        const sql=`UPDATE matricula SET mat_alu_id=$1, mat_turm_id=$2, mat_data_inclusao_projeto=$3, mat_data_matricula=$4, mat_data_vencimento=$5, mat_motivo_desligamento=$6, mat_status=$7 WHERE mat_id=$8`;
        const parametros=[
            matricula.dataDesligamento,
            matricula.motivoDesligamento,
            0,
            matricula.id
        ]
        const resp = await conexao.query(sql, parametros);
        return resp;
    }

    async excluirFisicamente(matricula,conexao)
    {
        const sql=`DELETE FROM matricula WHERE mat_id=$1`;
        const parametros=[
            matricula.id
        ]
        const resp = await conexao.query(sql, parametros);
        return resp;
    }

}
