import AlunoResponsavel from "../Modelo/alunoResponsavel.js";
import Aluno from "../Modelo/aluno.js";
import Responsavel from "../Modelo/responsavel.js";

export default class AlunoResponsavelDAO {

    /*
    CREATE TABLE IF NOT EXISTS alunoResponsavel(
        alu_id INT NOT NULL,
        resp_cpf VARCHAR(14) NOT NULL,
        CONSTRAINT cpf_format CHECK (resp_cpf ~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$'),
        CONSTRAINT fk_responsavel FOREIGN KEY (resp_cpf) 
            REFERENCES responsavel(resp_cpf)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,
        CONSTRAINT fk_aluno FOREIGN KEY (alu_id) 
            REFERENCES aluno(alu_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT
    )
    */

    async incluir(alunoResponsavel, conexao) {
        if (alunoResponsavel instanceof AlunoResponsavel) {
            const sql = `
            INSERT INTO alunoresponsavel
            (alu_id, resp_cpf)
            VALUES ($1, $2);
        `;

            const parametros = [
                alunoResponsavel.aluno.id,
                alunoResponsavel.responsavel.cpf
            ];



            try {
                await conexao.query(sql, parametros);
                return true;
            } catch (e) {
                console.log("Erro ao inserir alunoResponsavel: ", e);
                throw e;
            }
        } else {
            throw new Error("Objeto passado não é uma instância de AlunoResponsavel.");
        }
    }

    async excluir(alunoResponsavel, conexao) {
        if (alunoResponsavel instanceof AlunoResponsavel) {
            const sql = `DELETE FROM alunoResponsavel WHERE alu_id = $1`;
            const parametros = [alunoResponsavel.aluno.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluirPorCpf(alunoResponsavel, conexao) {
        if (alunoResponsavel instanceof AlunoResponsavel) {
            const sql = `DELETE FROM alunoResponsavel WHERE resp_cpf = $1`;
            const parametros = [alunoResponsavel.responsavel.cpf];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(termo, tipo, conexao) {
        if (termo) {
            let sql;
            let parametros;

            if (tipo === 2) {

                sql = `SELECT alu_id FROM alunoresponsavel WHERE resp_cpf = $1`;
                
                parametros = [termo];

                //console.log("TERMO: ", termo);
                
                const resposta = await conexao.query(sql, parametros);
                const listaId = resposta.rows;
                
                
                //console.log( listaId);


                let respostaFinal = [];
                let i;
                for (i = 0; i < listaId.length; i++) {
                    const aluno = new Aluno(listaId[i].alu_id);
                    const listaAlunos = await aluno.consultar(listaId[i].alu_id, 3, conexao);
                    respostaFinal.push(listaAlunos[0]);
                }
                return respostaFinal;
            }
            else {
                if (tipo === 1) {
                    sql = `SELECT resp_cpf FROM alunoresponsavel WHERE alu_id = $1`;


                    parametros = [termo];                    
                    const resposta = await conexao.query(sql, parametros);
                    const listaCPF = resposta.rows;

                    //  console.log("TERMO: ", termo);
                    //  console.log( listaCPF);


                    //     console.log("aaaaaaaaaaaaaaaaa ");
                    //     console.log( listaCPF[0].resp_cpf);

                    let respostaFinal = [];
                    let i;
                    for (i = 0; i < listaCPF.length; i++) {
                        const responsavel = new Responsavel(listaCPF[i].resp_cpf);
                        const listaResponsaveis = await responsavel.consultar(listaCPF[i].resp_cpf, conexao);
                        respostaFinal.push(listaResponsaveis[0]);
                    }
                    return respostaFinal;
                }
            }
            return false;
        }
        return false;
    }
}







