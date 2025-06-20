import Aluno from '../Modelo/aluno.js';
import AlunoResponsavel from '../Modelo/alunoResponsavel.js';
import Matricula from '../Modelo/matricula.js';
import Turma from '../Modelo/turma.js';

export default class MatriculaDAO {

    constructor() {
    }

    calcularVencimentoSemestre(dataMatricula) {
        const data = new Date(dataMatricula);
        const ano = data.getFullYear();
        const mes = data.getMonth() + 1; // getMonth() retorna 0 a 11

        let vencimento;

        if (mes >= 1 && mes <= 6) {
            vencimento = new Date(`${ano}-06-30`);
        } else {
            vencimento = new Date(`${ano}-12-31`);
        }

        return vencimento.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }
    async incluir(matricula, conexao) {
        if (matricula instanceof Matricula) {
            try {




                let responsáveisAluno = await new AlunoResponsavel().consultar(matricula.aluno.id, 1, conexao);

                //essa gabiarra serve pq o diabo do aluno pede uma lista de string tendo os cpf dos seus responsáveis e o DJANHO da função consultar do aluno responsavel retorna um vetor de objetos Responsaveis e não o cpf deles
                let i = 0;
                let vetCPF = [];
                for (i = 0; i < responsáveisAluno.length; i++) {
                    vetCPF.push(responsáveisAluno[i].cpf);
                }



                if (!responsáveisAluno[0]) {
                    throw new Error("Aluno sem responsável cadastrado");
                }

                // console.log("Status aluno: " + matricula.aluno.status);


                if (matricula.aluno.status == 2) {
                    matricula.aluno.listaResponsaveis = vetCPF;
                    matricula.aluno.status = 1;
                    matricula.dataInclusaoProjeto = matricula.dataAtualMatricula;
                    matricula.dataVencimento = this.calcularVencimentoSemestre(matricula.dataAtualMatricula);

                }
                else {
                    if (matricula.aluno.status == 0) {
                        throw new Error("Aluno inativo");
                    }
                    else {
                        let matriculaAntiga = await this.consultar(matricula, conexao);
                        let maisAntiga;
                        for (let i = 0; i < matriculaAntiga.length; i++) {
                            if (i == 0) {
                                maisAntiga = matriculaAntiga[i];
                            }
                            else {
                                if (maisAntiga.dataVencimento < matriculaAntiga[i].dataVencimento) {
                                    maisAntiga = matriculaAntiga[i];
                                }
                            }
                        }

                        //seria melhor Rematricular ela com data vencimento maior mas não precisa no momento
                        if (matriculaAntiga.length > 0 && maisAntiga.dataVencimento >= matricula.dataAtualMatricula) {
                            throw new Error("Aluno com matricula ja cadastrada nesse período");
                        }
                        else {
                            matricula.dataInclusaoProjeto = maisAntiga.dataInclusaoProjeto;
                            matricula.dataVencimento = this.calcularVencimentoSemestre(matricula.dataAtualMatricula);
                        }
                    }
                }

                // console.log("RESPONSAVEL ALUNO: ");
                // responsáveisAluno.filter(x => console.log(x.cpf));

                const respostaAlunoConsultado = await matricula.aluno.alterar(conexao);


                // console.log("JA ALTEREI ALUNO DE BOA");

                if (!respostaAlunoConsultado) {
                    throw new Error("Erro ao alterar aluno: " + respostaAlunoConsultado);
                }


                const sql = `INSERT INTO matricula(mat_alu_id, mat_turma_id, mat_data_inclusao_projeto, mat_data_matricula, mat_data_vencimento, mat_status)
                VALUES ($1, $2, $3, $4, $5, $6)`;




                const parametros = [
                    matricula.aluno.id,
                    matricula.turma.id,
                    matricula.dataInclusaoProjeto,
                    matricula.dataAtualMatricula,
                    matricula.dataVencimento,
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
                termo = "";
                parametros = [termo];
            }
            else {
                sql = `SELECT * FROM matricula WHERE mat_id = $1`;
                parametros = [termo];
            }

            let resultado;
            if (termo)
                resultado = await conexao.query(sql, parametros);
            else
                resultado = await conexao.query(sql);
            const linhas = resultado.rows;
            for (const linha of linhas) {

                const alunoBuscado = await new Aluno().consultar(linha['mat_alu_id'], 3, conexao);
                const turmaBuscada = await new Turma().consultar(linha['mat_turm_id'], conexao);

                matriculas.push(new Matricula(
                    linha['mat_id'],
                    alunoBuscado[0],
                    turmaBuscada[0],
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

    async consultarMatAluno(termo, conexao) {
        let matriculas = [];
        try {
            let sql = "";
            let parametros = [];


            if (!termo) {
                // console.log("ENTROU");
                sql = `SELECT * FROM matricula`;
                termo = "";
                parametros = [termo];
            }
            else {
                sql = `SELECT * FROM matricula WHERE mat_alu_id = $1`;
                parametros = [termo];
            }

            let resultado;

            if (termo)
                resultado = await conexao.query(sql, parametros);
            else
                resultado = await conexao.query(sql);


            const linhas = resultado.rows;



            // console.log("LINHAS");
            // console.log(linhas);

            for (const linha of linhas) {

                const alunoBuscado = await new Aluno().consultar(linha['mat_alu_id'], 3, conexao);
                const turmaBuscada = await new Turma().consultar(linha['mat_turm_id'], conexao);

                matriculas.push(new Matricula(
                    linha['mat_id'],
                    alunoBuscado[0],
                    turmaBuscada[0],
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

    async alterar(matricula, conexao) {
        const sql = `UPDATE matricula SET  mat_turm_id=$2,  WHERE mat_id=$8`;
        const parametros = [
            matricula.turma.id,
            matricula.id
        ]
        const resp = await conexao.query(sql, parametros);
        return resp;
    }

    async excluir(matricula, conexao) {
        const sql = `UPDATE matricula SET mat_data_desligamento=$1, mat_motivo_desligamento=$2, mat_status=$3 WHERE mat_id=$4`;
        const parametros = [
            matricula.dataDesligamento,
            matricula.motivoDesligamento,
            0,
            matricula.id
        ]
        const resp = await conexao.query(sql, parametros);
        return resp;
    }

    async excluirFisicamente(matricula, conexao) {
        const sql = `DELETE FROM matricula WHERE mat_id=$1`;
        const parametros = [
            matricula.id
        ]
        const resp = await conexao.query(sql, parametros);
        return resp;
    }

}
