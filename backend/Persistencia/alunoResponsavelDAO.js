import AlunoResponsavel from "../Modelo/alunoResponsavel";


export default class AlunoResponsavelDAO{

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

    async incluir(alunoResponsavel, conexao){
        if(alunoResponsavel instanceof AlunoResponsavel){
            const sql = `INSERT INTO alunoResponsavel
                (alu_id, resp_cpf) VALUES ($1, $2);`;
            const parametros = [
                alunoResponsavel.aluno.id,
                alunoResponsavel.responsavel.cpf
            ];
            const resposta = await conexao.query(sql, parametros);
        }
        else{
            throw new Error("Objeto passado não é uma instância de AlunoResposavel");
        }
        return false;
    }

    async excluir(alunoResponsavel, conexao){
        if(alunoResponsavel instanceof AlunoResponsavel){
            const sql = `DELETE FROM alunoResponsavel WHERE alu_id = $1`;
            const parametros = [alunoResponsavel.aluno.id];
            await conexao.query(sql, parametros);
        }
    }
}