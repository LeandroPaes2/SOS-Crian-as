import Responsavel from "../Modelo/responsavel.js";

export default class ResponsavelDAO {

    /*async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS responsavel(
                resp_cpf VARCHAR(14) NOT NULL,
                resp_rg VARCHAR(12) NOT NULL UNIQUE,
                resp_nome VARCHAR(50) NOT NULL,
                resp_telefone VARCHAR(15) NOT NULL UNIQUE,
                resp_email VARCHAR(100) NOT NULL UNIQUE,
                resp_sexo VARCHAR(10) NOT NULL CHECK (resp_sexo IN ('Masculino', 'Feminino', 'Outro')),
                resp_dtNascimento DATE NOT NULL,
                resp_estCivil VARCHAR(20) NOT NULL,
                resp_conjuge VARCHAR(5) NOT NULL CHECK (resp_conjuge IN ('Sim', 'Nao')),
                resp_profissao VARCHAR(50) NULL,
                resp_situTrabalho VARCHAR(20) NOT NULL,
                resp_escolaridade VARCHAR(60) NOT NULL,
                resp_rendaFamiliar VARCHAR(30) NOT NULL,
                resp_valorRenda DECIMAL(10,2) NULL,
                resp_qtdeTrabalhadores INT NOT NULL,
                resp_pensaoAlimenticia VARCHAR(5) NOT NULL CHECK (resp_pensaoAlimenticia IN ('Sim', 'Nao')),
                resp_valorPensao DECIMAL(10,2) NULL,
                resp_pagadorPensao VARCHAR(100) NULL, 
                resp_beneficioSocial VARCHAR(5) NOT NULL CHECK (resp_beneficioSocial IN ('Sim', 'Nao')),
                resp_tipoBeneficio VARCHAR(40) NULL,
                resp_valorBeneficio DECIMAL(10,2) NULL,
                resp_beneficiario VARCHAR(100) NULL,
                CONSTRAINT pk_responsavel PRIMARY KEY(resp_cpf),
                CONSTRAINT cpf_format CHECK (resp_cpf ~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$'),
                CONSTRAINT rg_format CHECK (resp_rg ~ '^\d{2}\.\d{3}\.\d{3}-[\dXx]$'),
                CONSTRAINT telefone_format CHECK (resp_telefone ~ '^\(?\d{2}\)?[- ]?\d{4,5}-?\d{4}$'),
                CONSTRAINT email_format CHECK (resp_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')

            );
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }*/

    async incluir(responsavel, conexao) {
        if (responsavel instanceof Responsavel) {
            
            try {
                const sql = `INSERT INTO responsavel(resp_cpf, resp_rg, resp_nome, resp_telefone, resp_email, resp_sexo, resp_dtNascimento, resp_estCivil, resp_conjuge, resp_profissao, resp_situTrabalho, resp_escolaridade, resp_rendaFamiliar, resp_valorRenda, resp_qtdeTrabalhadores, resp_pensaoAlimenticia, resp_valorPensao, resp_pagadorPensao, resp_beneficioSocial, resp_tipoBeneficio, resp_valorBeneficio, resp_beneficiario)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
            `;
                let parametros = [
                    responsavel.cpf,
                    responsavel.rg,
                    responsavel.nome,
                    responsavel.telefone,
                    responsavel.email,
                    responsavel.sexo,
                    responsavel.dtNascimento,
                    responsavel.estCivil,
                    responsavel.conjuge,
                    responsavel.profissao,
                    responsavel.situTrabalho,
                    responsavel.escolaridade,
                    responsavel.rendaFamiliar,
                    responsavel.valorRenda,
                    responsavel.qtdeTrabalhadores,
                    responsavel.pensaoAlimenticia,
                    responsavel.valorPensao,
                    responsavel.pagadorPensao,
                    responsavel.beneficioSocial,
                    responsavel.tipoBeneficio,
                    responsavel.valorBeneficio,
                    responsavel.beneficiario
                ];
                
                await conexao.query(sql, parametros);
                console.log(parametros);
                return true; 
            } catch (e) {
                throw new Error("Erro ao incluir responsavel: " + e.message);
            }
        }
    }

    async alterar(responsavel, conexao) {
        if (responsavel instanceof Responsavel) {
            try {
                const sql = `UPDATE responsavel SET resp_rg=$1, resp_nome=$2, resp_telefone=$3, resp_email=$4, resp_sexo=$5, resp_dtNascimento=$6, resp_estCivil=$7, resp_conjuge=$8, resp_profissao=$9, resp_situTrabalho=$10, resp_escolaridade=$11, resp_rendaFamiliar=$12, resp_valorRenda=$13, resp_qtdeTrabalhadores=$14, resp_pensaoAlimenticia=$15, resp_valorPensao=$16, resp_pagadorPensao=$17, resp_beneficioSocial=$18, resp_tipoBeneficio=$19, resp_valorBeneficio=$20, resp_beneficiario=$21
                WHERE  resp_cpf = $22
            `;
                let parametros = [
                    responsavel.rg,
                    responsavel.nome,
                    responsavel.telefone,
                    responsavel.email,
                    responsavel.sexo,
                    responsavel.dtNascimento,
                    responsavel.estCivil,
                    responsavel.conjuge,
                    responsavel.profissao,
                    responsavel.situTrabalho,
                    responsavel.escolaridade,
                    responsavel.rendaFamiliar,
                    responsavel.valorRenda,
                    responsavel.qtdeTrabalhadores,
                    responsavel.pensaoAlimenticia,
                    responsavel.valorPensao,
                    responsavel.pagadorPensao,
                    responsavel.beneficioSocial,
                    responsavel.tipoBeneficio,
                    responsavel.valorBeneficio,
                    responsavel.beneficiario,
                    responsavel.cpf
                ];
                await conexao.query(sql, parametros);
                return true;
            } catch (e) {
                throw new Error("Erro ao alterar funcionário: " + e.message);
            }
        }
    }

    async consultar(termo, conexao) {
        try {
            let sql = "";
            let parametros = [];
            if (!termo) {
                sql = `SELECT * FROM responsavel`;
                parametros = [];
            }
            else {
                sql = `SELECT * FROM responsavel r
                   WHERE resp_cpf = $1`
                parametros = [termo];
            }
            const resultado = await conexao.query(sql, parametros);
            const linhas = resultado.rows;
            let listaResponsavel = [];
            for (const linha of linhas) {
                const responsavel = new Responsavel(
                    linha['resp_cpf'],
                    linha['resp_rg'],
                    linha['resp_nome'],
                    linha['resp_telefone'],
                    linha['resp_email'],
                    linha['resp_sexo'],
                    linha['resp_dtnascimento'] ? linha['resp_dtnascimento'].toISOString().split('T')[0] : "",
                    linha['resp_estcivil'],
                    linha['resp_conjuge'],
                    linha['resp_profissao'],
                    linha['resp_situtrabalho'],
                    linha['resp_escolaridade'],
                    linha['resp_rendafamiliar'],
                    linha['resp_valorrenda'],
                    linha['resp_qtdetrabalhadores'],
                    linha['resp_pensaoalimenticia'],
                    linha['resp_valorpensao'],
                    linha['resp_pagadorpensao'],
                    linha['resp_beneficiosocial'],
                    linha['resp_tipobeneficio'],
                    linha['resp_valorbeneficio'],
                    linha['resp_beneficiario']
                );
                listaResponsavel.push(responsavel);
            }
            return listaResponsavel;
        } catch (e) {
            throw new Error("Erro ao consultar responsaveis: " + e.message);
        }
    }

    async excluir(responsavel, conexao) {
        if (responsavel instanceof Responsavel) {
            try {
                let sql = "";
                sql = `DELETE FROM responsavel WHERE resp_cpf = $1`;
                let parametros = [
                    responsavel.cpf
                ];
                return await conexao.query(sql, parametros);
            } catch (e) {
                throw new Error("Erro ao excluir responsavel: " + e.message);
            }
        }
    }
}