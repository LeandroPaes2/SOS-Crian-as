import Familia from "../Modelo/familia.js";

export default class FamiliaDAO {

    async incluir(familia, supabase) {
        if (familia instanceof Familia) {
            const sql = `INSERT INTO familia(
            fam_nome, fam_sexo, fam_data_nascimento, fam_rg, fam_cpf,
            fam_companheiro, fam_estado_civil, fam_profissao, fam_situacao_trabalho, fam_escolaridade,
            fam_renda_familiar, fam_renda_valor, fam_qtde_trabalho, fam_pensao_alimentar,
            fam_valor_pensao, fam_quem_paga_pensao, fam_beneficio_social,
            fam_qual_beneficio, fam_valor_beneficio, fam_nome_beneficio
        ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20
        )`;

            const parametros = [
                familia.nome,
                familia.sexo,
                familia.dataNascimento,
                familia.rg,
                familia.cpf,
                familia.companheiro,
                familia.estadoCivil,
                familia.profissao,
                familia.situacaoTrabalho,
                familia.escolaridade,
                familia.rendaFamiliar,
                familia.rendaValor,
                familia.qtdeTrabalho,
                familia.pensaoAlimentar,
                familia.valorPensao,
                familia.quemPagaPensao,
                familia.beneficioSocial,
                familia.qualBeneficio,
                familia.valorBeneficio,
                familia.nomeBeneficio
            ];

            await supabase.query(sql, parametros);
        }
    }


    async alterar(familia, supabase) {
        if (familia instanceof Familia) {
            const sql = `
            UPDATE familia
            SET fam_nome = $1, fam_sexo = $2, fam_dataNascimento = $3, fam_rg = $4, fam_cpf = $5, fam_companheiro = $6, fam_estado_civil = $7, fam_profissao = $8, fam_situacao_trabalho = $9, fam_escolaridade = $10, fam_renda_familiar = $11, fam_renda_valor = $12, fam_qtde_trabalho = $13, fam_pensao_alimentar = $14, fam_valor_pensao = $15, fam_quem_paga_pensao = $16, fam_beneficio_social = $17, fam_qual_beneficio = $18,fam_valor_beneficio = $19, fam_nome_beneficio = $20
            WHERE fam_id = $21;
            `;
            let parametros = [
                familia.nome,
                familia.sexo,
                familia.dataNascimento,
                familia.rg,
                familia.cpf,
                familia.companheiro,
                familia.estadoCivil,
                familia.profissao,
                familia.situacaoTrabalho,
                familia.escolaridade,
                familia.rendaFamiliar,
                familia.rendaValor,
                familia.qtdeTrabalho,
                familia.pensaoAlimentar,
                familia.valorPensao,
                familia.quemPagaPensao,
                familia.beneficioSocial,
                familia.qualBeneficio,
                familia.valorBeneficio,
                familia.nomeBeneficio,
                familia.id
            ];
            const resultado = await supabase.query(sql, parametros);
            return resultado;
        }
        return null;
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
            const familia = new Familia(
                linha['fam_id'],
                linha['fam_nome'],
                linha['fam_sexo'],
                linha['fam_data_nascimento'],
                linha['fam_rg'],
                linha['fam_cpf'],
                linha['fam_companheiro'],
                linha['fam_estado_civil'],
                linha['fam_profissao'],
                linha['fam_situacao_trabalho'],
                linha['fam_escolaridade'],
                linha['fam_renda_familiar'],
                linha['fam_renda_valor'],
                linha['fam_qtde_trabalho'],
                linha['fam_pensao_alimentar'],
                linha['fam_valor_pensao'],
                linha['fam_quem_paga_pensao'],
                linha['fam_beneficio_social'],
                linha['fam_qual_beneficio'],
                linha['fam_valor_beneficio'],
                linha['fam_nome_beneficio']
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
        }
    }
}