import Familia from "../Modelo/familia.js";

export default class FamiliaDAO {

    /*CREATE TABLE IF NOT EXISTS familia(
                fam_id INT NOT NULL AUTO_INCREMENT,
                fam_nome VARCHAR(50) NOT NULL,
                fam_sexo VARCHAR(10) NOT NULL CHECK (fam_sexo IN ('Masculino', 'Feminino', 'Outro')),
                fam_dataNascimento DATE NOT NULL,
                fam_profissao VARCHAR(50),
                fam_escolaridade VARCHAR(60) NOT NULL,
                fam_grauParentesco VARCHAR (50) NOT NULL,
                fam_irmaos VARCHAR (50),
                fam_temContato VARCHAR (5) NOT NULL CHECK (fam_temContato IN ('Sim', 'Nao'))
                CONSTRAINT pk_familia PRIMARY KEY(fam_id),
            );*/

    async incluir(familia, supabase) {
        if (familia instanceof Familia) {
            const sql = `
                INSERT INTO familia (
                    alu_id, fam_nome, fam_sexo, fam_dataNascimento, fam_profissao, 
                    fam_escolaridade, fam_grauParentesco, fam_irmaos, fam_temContato
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9
                )`;

            const parametros = [
                familia.aluno.id,     // ID do aluno (UUID)
                familia.nome,
                familia.sexo,
                familia.dataNascimento,
                familia.profissao,
                familia.escolaridade,
                familia.grauParentesco,
                familia.irmaos,
                familia.temContato
            ];

            await supabase.query(sql, parametros);
            return true;
        }
        return false;
    }

    async alterar(familia, supabase) {
        if (familia instanceof Familia) {
            const sql = `
                UPDATE familia
                SET 
                    alu_id = $1,
                    fam_nome = $2, 
                    fam_sexo = $3, 
                    fam_dataNascimento = $4, 
                    fam_profissao = $5, 
                    fam_escolaridade = $6,
                    fam_grauParentesco = $7,
                    fam_irmaos = $8, 
                    fam_temContato = $9
                WHERE fam_id = $10
            `;
            const parametros = [
                familia.aluno.id,
                familia.nome,
                familia.sexo,
                familia.dataNascimento,
                familia.profissao,
                familia.escolaridade,
                familia.grauParentesco,
                familia.irmaos,
                familia.temContato,
                familia.id
            ];

            const resultado = await supabase.query(sql, parametros);
            return resultado;
        }
        return false;
    }

    async consultar(termo, supabase) {
        let sql = "";
        let parametros = [];

        if (!termo) {
            sql = `SELECT * FROM familia`;
        } else if (!isNaN(parseInt(termo))) {
            sql = `SELECT * FROM familia WHERE fam_id = $1`;
            parametros = [parseInt(termo)];
        } else {
            sql = `SELECT * FROM familia WHERE fam_nome ILIKE $1`;
            parametros = ['%' + termo + '%'];
        }

        const resultado = await supabase.query(sql, parametros);
        const linhas = resultado.rows;
        let listaFamilia = [];
        for (const linha of linhas) {
            const aluno = { id: linha['alu_id'] }; // apenas ID do aluno
            const familia = new Familia(
                linha['fam_id'],
                aluno,
                linha['fam_nome'],
                linha['fam_sexo'],
                linha['fam_datanascimento'], 
                linha['fam_profissao'],
                linha['fam_escolaridade'],
                linha['fam_grauparentesco'], 
                linha['fam_irmaos'],         
                linha['fam_temcontato']      
            );
            listaFamilia.push(familia);
        }
        return listaFamilia;
    }

    async excluir(familia, supabase) {
        if (familia instanceof Familia) {
            const sql = `DELETE FROM familia WHERE fam_id = $1`;
            const parametros = [familia.id];
            await supabase.query(sql, parametros);
            return true;
        }
        return null;
    }
}