import FormularioSaude from "../Modelo/formularioSaude.js";
import Aluno from "../Modelo/aluno.js";
import conectar from "../Persistencia/Conexao.js";

export default class FormularioSaudeCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const aluno = req.body.aluno || {};
            const alergia_alimentar = req.body.alergia_alimentar;
            const crise_alergica_alimentar = req.body.crise_alergica_alimentar;
            const alergia_nao_alimentar = req.body.alergia_nao_alimentar;
            const crise_alergica_nao_alimentar = req.body.crise_alergica_nao_alimentar;
            const maior_atencao = req.body.maior_atencao;
            const crise_maior_atencao = req.body.crise_maior_atencao;
            const medicacao_continua = req.body.medicacao_continua;
            const quem_prescreveu = req.body.quem_prescreveu;
            const plano_saude = req.body.plano_saude;
            const tipo_sanguineo = req.body.tipo_sanguineo;
            const assitatura_responsavel = req.body.assitatura_responsavel;
            const status = req.body.status;
            const data_insercao = new Date().toISOString().split('T')[0];

            if (!aluno || !aluno.id) {
                return res.status(400).json({
                    "status": false,
                    "mensagem": "Aluno não informado ou inválido."
                });
            }

            if (!isNaN(alergia_alimentar) && !isNaN(status)) {
                let conexao;
                try {
                    const objAluno = new Aluno(
                        aluno.id,
                        aluno.nome,
                        aluno.dataNascimento,
                        aluno.responsavel,
                        aluno.cidade,
                        aluno.rua,
                        aluno.bairro,
                        aluno.numero,
                        aluno.escola,
                        aluno.telefone,
                        aluno.periodoEscola,
                        aluno.realizaAcompanhamento,
                        aluno.possuiSindrome,
                        aluno.descricao,
                        aluno.data_insercaoFormularioSaude,
                        aluno.rg,
                        aluno.objFormularioSaude,
                        aluno.ficha,
                        aluno.data_insercaoProjeto,
                        aluno.status,
                        aluno.periodoProjeto,
                        aluno.cep
                    );

                    const formularioSaude = new FormularioSaude(
                        0,
                        aluno.id,
                        objAluno,
                        alergia_alimentar,
                        crise_alergica_alimentar,
                        alergia_nao_alimentar,
                        crise_alergica_nao_alimentar,
                        maior_atencao,
                        crise_maior_atencao,
                        medicacao_continua,
                        quem_prescreveu,
                        plano_saude,
                        tipo_sanguineo,
                        data_insercao,
                        assitatura_responsavel,
                        status
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    await formularioSaude.incluir(conexao);
                    await conexao.query("COMMIT");

                    res.status(200).json({ status: true, mensagem: "Cadastrado com sucesso na Lista de Espera!" });

                } catch (e) {
                    if (conexao) await conexao.query('ROLLBACK');
                    res.status(500).json({ status: false, mensagem: "Erro ao cadastrar: " + e.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos. Verifique a requisição." });
            }

        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async alterar(req, res) {
        res.type("application/json");

        if ((req.method === "PUT" || req.method === "PATCH") && req.is("application/json")) {
            const num = req.body.num;
            const id = req.body.id;
            const aluno = req.body.aluno || {};
            const alergia_alimentar = req.body.alergia_alimentar;
            const crise_alergica_alimentar = req.body.crise_alergica_alimentar;
            const alergia_nao_alimentar = req.body.alergia_nao_alimentar;
            const crise_alergica_nao_alimentar = req.body.crise_alergica_nao_alimentar;
            const maior_atencao = req.body.maior_atencao;
            const crise_maior_atencao = req.body.crise_maior_atencao;
            const medicacao_continua = req.body.medicacao_continua;
            const quem_prescreveu = req.body.quem_prescreveu;
            const plano_saude = req.body.plano_saude;
            const tipo_sanguineo = req.body.tipo_sanguineo;
            const assitatura_responsavel = req.body.assitatura_responsavel;
            const data_insercao = req.body.data_insercao;
            const status = req.body.status;

            const objAluno = new Aluno(
                aluno.id,
                aluno.nome,
                aluno.dataNascimento,
                aluno.responsavel,
                aluno.cidade,
                aluno.rua,
                aluno.bairro,
                aluno.numero,
                aluno.escola,
                aluno.telefone,
                aluno.periodoEscola,
                aluno.realizaAcompanhamento,
                aluno.possuiSindrome,
                aluno.descricao,
                aluno.data_insercaoFormularioSaude,
                aluno.rg,
                aluno.objFormularioSaude,
                aluno.ficha,
                aluno.data_insercaoProjeto,
                aluno.status,
                aluno.periodoProjeto,
                aluno.cep
            );

            if (num >= 0 && id > 0 && data_insercao && alergia_alimentar >= 0 && status > -1 && status < 2) {
                let conexao;
                try {
                    const formularioSaude = new FormularioSaude(
                        num,
                        id,
                        objAluno,
                        alergia_alimentar,
                        crise_alergica_alimentar,
                        alergia_nao_alimentar,
                        crise_alergica_nao_alimentar,
                        maior_atencao,
                        crise_maior_atencao,
                        medicacao_continua,
                        quem_prescreveu,
                        plano_saude,
                        tipo_sanguineo,
                        data_insercao,
                        assitatura_responsavel,
                        status
                    );

                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    await formularioSaude.alterar(conexao);
                    await conexao.query("COMMIT");

                    res.status(200).json({ status: true, mensagem: "Alterado com sucesso na Lista de Espera!" });

                } catch (e) {
                    if (conexao) await conexao.query('ROLLBACK');
                    res.status(500).json({ status: false, mensagem: "Erro ao alterar: " + e.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({ status: false, mensagem: "Dados incompletos ou inválidos." });
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida!" });
        }
    }

    async excluir(req, res) {
        res.type("application/json");

        if (req.method === "DELETE") {
            const num = parseInt(req.params.num);

            if (!isNaN(num)) {
                const formularioSaude = new FormularioSaude(num);
                let conexao;

                try {
                    conexao = await conectar();
                    await conexao.query("BEGIN");

                    await formularioSaude.excluir(conexao);
                    await conexao.query("COMMIT");

                    res.status(200).json({ status: true, mensagem: "Excluído com sucesso da Lista de Espera!" });

                } catch (e) {
                    if (conexao) await conexao.query("ROLLBACK");
                    res.status(500).json({ status: false, mensagem: "Erro ao excluir: " + e.message });
                } finally {
                    if (conexao) conexao.release();
                }
            } else {
                res.status(400).json({ status: false, mensagem: "ID inválido!" });
            }

        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método DELETE." });
        }
    }

    async consultar(req, res) {
        res.type("application/json");

        if (req.method === "GET") {
            let id = req.params.id || "";
            const formularioSaude = new FormularioSaude();
            const conexao = await conectar();

            try {
                await conexao.query('BEGIN');
                const listasEsp = await formularioSaude.consultar({ id }, conexao);
                await conexao.query('COMMIT');
                res.status(200).json(listasEsp);
            } catch (e) {
                await conexao.query('ROLLBACK');
                res.status(500).json({ status: false, mensagem: e.message });
            } finally {
                conexao.release();
            }
        } else {
            res.status(400).json({ status: false, mensagem: "Requisição inválida! Use o método GET." });
        }
    }


}
