import { Alert, Form, Button, Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useLocation } from "react-router-dom";
import "../../css/alunoForm.css";
import { useNavigate } from 'react-router-dom';

export default function FormCadAluno(props) {
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);
    const [cepValido, setCepValido] = useState(false);

    const [dados, setDados] = useState({
        id: 0,
        nome: "",
        dataNascimento: "",
        responsavel: {
            nomeResp: "",
            cpf: ""
        },
        cidade: "",
        rua: "",
        bairro: "",
        numero: "",
        escola: {},
        telefone: "",
        periodoEscola: "",
        realizaAcompanhamento: "",
        possuiSindrome: "",
        descricao: "",
        dataInsercaoListaEspera: "",
        rg: "",
        formularioSaude: {},
        ficha: {},
        dataInsercaoProjeto: "",
        status: "",
        periodoProjeto: "",
        cep: ""
    });

    const navigate = useNavigate();
    const rotaVoltar = editando ? "/relatorioAluno" : "/telaAluno";

    useEffect(() => {
        if (location.state && location.state.id) {
            setDados((prev) => ({
                ...prev,
                ...location.state
            }));
            setEditando(true);
        }
    }, [location.state]);

    async function buscarCep() {
        const cep = dados.cep.replace(/\D/g, "");
        const url = `https://viacep.com.br/ws/${cep}/json/`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.erro) {
                setCepNaoEncontrado(true);
                setCepValido(false);
            } else {
                setCepNaoEncontrado(false);
                setCepValido(true);

                setDados((prev) => ({
                    ...prev,
                    cidade: prev.cidade || data.localidade,
                    rua: prev.rua || data.logradouro,
                    bairro: prev.bairro || data.bairro,
                    cep: data.cep
                }));
            }
        } catch (error) {
            setCepNaoEncontrado(true);
            setCepValido(false);
            console.error("Erro ao buscar CEP:", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            id,
            nome,
            dataNascimento,
            responsavel,
            cidade,
            rua,
            bairro,
            numero,
            escola,
            telefone,
            periodoEscola,
            realizaAcompanhamento,
            possuiSindrome,
            descricao,
            dataInsercaoListaEspera,
            rg,
            formularioSaude,
            ficha,
            dataInsercaoProjeto,
            status,
            periodoProjeto,
            cep
        } = dados;

        if (
            !id ||
            !nome ||
            !dataNascimento ||
            !responsavel ||
            !cidade ||
            !rua ||
            !bairro ||
            !numero ||
            !escola ||
            !telefone ||
            !periodoEscola ||
            !realizaAcompanhamento ||
            !possuiSindrome ||
            !descricao ||
            !dataInsercaoListaEspera ||
            !rg ||
            !formularioSaude ||
            !ficha ||
            !dataInsercaoProjeto ||
            !status ||
            !periodoProjeto ||
            !cep) {
            setMensagem("Preencha todos os campos obrigatórios!");
            return;
        }
        if (!validarRGComDV(dados.rg)) {
            return;
        }


        const aluno = { ...dados };

        const url = editando
            ? `http://localhost:3000/alunos/${dados.id}`
            : "http://localhost:3000/alunos";
        const method = editando ? "PUT" : "POST";

        try {
            if (editando && !window.confirm("Deseja realmente alterar o aluno: " + aluno.nome)) {
                return;
            }

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aluno)
            });

            if (res.ok) {
                setMensagem(editando ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
                setTimeout(() => {
                    setDados({
                        id: 0,
                        nome: "",
                        dataNascimento: "",
                        responsavel: {},
                        cidade: "",
                        rua: "",
                        bairro: "",
                        numero: "",
                        escola: {},
                        telefone: "",
                        periodoEscola: "",
                        realizaAcompanhamento: "",
                        possuiSindrome: "",
                        descricao: "",
                        dataInsercaoListaEspera: "",
                        rg: "",
                        formularioSaude: {},
                        ficha: {},
                        dataInsercaoProjeto: "",
                        status: "",
                        periodoProjeto: "",
                        cep: ""
                    });
                    navigate("/relatorioAluno");
                }, 3000);
            } else {
                setMensagem(editando ? "Erro ao atualizar aluno!" : "Erro ao cadastrar o aluno.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    function validarRGComDV(rg) {
        if (!rg) return false;

        // Remove tudo que não for número ou 'X'
        const rgLimpo = rg.toUpperCase().replace(/[^0-9X]/g, "");

        if (!/^\d{8}[0-9X]$/.test(rgLimpo)) {
            return false; // formato inválido
        }

        const numeros = rgLimpo.slice(0, 8).split("").map(Number);
        const dvInformado = rgLimpo[8];

        // Calcula o DV
        let soma = 0;
        let peso = 2;

        for (let i = 7; i >= 0; i--) {
            soma += numeros[i] * peso;
            peso++;
        }

        let resto = soma % 11;
        let dvCalculado = 11 - resto;

        if (dvCalculado === 10) {
            dvCalculado = 'X';
        } else if (dvCalculado === 11) {
            dvCalculado = '0';
        } else {
            dvCalculado = dvCalculado.toString();
        }

        return dvInformado === dvCalculado;
    }

    function validarCPF(cpf) {
        if (!cpf) return false;

        // Remove pontos e traço
        const cpfLimpo = cpf.replace(/\D/g, '');

        if (!/^\d{11}$/.test(cpfLimpo)) return false;

        // Verifica se todos os dígitos são iguais (inválido)
        if (/^(\d)\1+$/.test(cpfLimpo)) return false;

        const numeros = cpfLimpo.split('').map(Number);

        // Valida DV1
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += numeros[i] * (10 - i);
        }
        let resto = (soma * 10) % 11;
        let dv1 = resto === 10 ? 0 : resto;
        if (numeros[9] !== dv1) return false;

        // Valida DV2
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += numeros[i] * (11 - i);
        }
        resto = (soma * 10) % 11;
        let dv2 = resto === 10 ? 0 : resto;
        if (numeros[10] !== dv2) return false;

        return true;
    }



    const handleChange = (e) => {
        const { name, value } = e.target;
        let value2 = value;

        // Máscara para o CEP
        if (name === "cep") {
            let cepNumeros = value.replace(/\D/g, "");
            cepNumeros = cepNumeros.slice(0, 8);
            let cepFormatado = cepNumeros;
            if (cepNumeros.length > 5) {
                cepFormatado = cepNumeros.slice(0, 5) + "-" + cepNumeros.slice(5);
            }
            setDados((prev) => ({ ...prev, cep: cepFormatado }));
            setCepNaoEncontrado(false);
            return;
        }

        // Máscara para telefone
        if (name === "telefone") {
            let telefoneNumeros = value.replace(/\D/g, "");
            if (telefoneNumeros.length > 10) {
                telefoneNumeros = telefoneNumeros.slice(0, 11); // Limita a 11 caracteres
            }
            let telefoneFormatado = telefoneNumeros;
            if (telefoneNumeros.length > 6) {
                telefoneFormatado = `(${telefoneNumeros.slice(0, 2)}) ${telefoneNumeros.slice(2, 7)}-${telefoneNumeros.slice(7)}`;
            } else if (telefoneNumeros.length > 2) {
                telefoneFormatado = `(${telefoneNumeros.slice(0, 2)}) ${telefoneNumeros.slice(2)}`;
            }
            setDados((prev) => ({ ...prev, telefone: telefoneFormatado }));
            return;
        }






        if (name === "rg") {
            // Remove tudo que não for número ou 'X' (maiúsculo)
            let rgLimpo = value.toUpperCase().replace(/[^0-9X]/g, "");

            // Limita o tamanho: 9 dígitos (sem formatação) ou 8 dígitos + 'X'
            rgLimpo = rgLimpo.slice(0, 9);

            // Aplica a formatação: 11.111.111-X
            let rgFormatado = rgLimpo;

            if (rgLimpo.length > 2) {
                rgFormatado = rgFormatado.replace(/^(\d{2})(\d)/, "$1.$2");
            }
            if (rgLimpo.length > 5) {
                rgFormatado = rgFormatado.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            }
            if (rgLimpo.length === 9) {
                rgFormatado = rgFormatado.replace(/^(\d{2})\.(\d{3})\.(\d{3})([0-9X])$/, "$1.$2.$3-$4");
            }
            if (rgFormatado.length > 12) {
                rgFormatado = rgFormatado.slice(0, 11); // Limita a 9 dígitos
            }
            setDados((prev) => ({
                ...prev,
                [name]: rgFormatado
            }));

            return;
        }

        if (name === "responsavel.cpf") {
            // Remove tudo que não for número
            let cpfLimpo = value.replace(/\D/g, "");

            // Limita o tamanho: 11 dígitos
            cpfLimpo = cpfLimpo.slice(0, 11);

            // Aplica a formatação: 000.000.000-00
            let cpfFormatado = cpfLimpo;

            if (cpfLimpo.length > 3) {
                cpfFormatado = cpfFormatado.replace(/^(\d{3})(\d)/, "$1.$2");
            }
            if (cpfLimpo.length > 6) {
                cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
            }
            if (cpfLimpo.length > 9) {
                cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
            }

            value2 = cpfFormatado;
        }




        /* Verifica se é um campo de objeto dentro de outro objeto tipo:
         obj1{
            obj2{
            nome:"teste"
            } 
         }

        dai fica name = obj1.obj2

            e ai fica parent == obj1
            child == obj2 

        */
        if (name.includes(".")) {

            const [parent, child] = name.split(".");
            setDados((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value2
                }
            }));
        } else {
            setDados((prev) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="cadastroAluno">
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>{editando ? "Editar Aluno" : "Cadastro de Aluno"}</h2>
                </Alert>

                {mensagem && <Alert variant="info">{mensagem}</Alert>}

                <Form onSubmit={handleSubmit}>


                    <Form.Group className="mb-3" id="responsavel.cpf">
                        <Form.Label>Responsavel</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a responsavel"
                            name="responsavel.cpf"
                            value={dados.responsavel.cpf || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>


                    <Form.Group className="mb-3" id="responsavel.nome">
                        <Form.Label>Responsavel</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a responsavel"
                            name="responsavel.nome"
                            value={dados.responsavel.nome || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="nome">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            name="nome"
                            value={dados.nome}
                            onChange={handleChange}
                        />
                    </Form.Group>




                    <Form.Group className="mb-3" id="cep">
                        <Form.Label>CEP</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o CEP"
                            name="cep"
                            value={dados.cep}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Row className="mb-2 align-items-center">
                        <Col xs="auto">
                            <Button variant="info" onClick={buscarCep}>
                                Buscar CEP
                            </Button>
                        </Col>
                        <Col>
                            <Form.Text className="text-muted">
                                Preenche automaticamente os campos de rua, cidade e bairro <strong>se estiverem vazios</strong>.
                            </Form.Text>
                        </Col>
                    </Row>



                    <Form.Group className="mb-3" id="cidade">
                        <Form.Label>Cidade</Form.Label>
                        <Form.Control
                            type="text"
                            name="cidade"
                            placeholder="Digite o CEP e clique em buscar "
                            value={dados.cidade || ""}
                            onChange={handleChange}
                            className={
                                cepNaoEncontrado && !dados.cidade ? "input-warning-amarelo" : ""
                            }
                        />
                        {cepNaoEncontrado && (
                            <Form.Text className="texto-aviso-cep">
                                Cep não encontrado, preencha manualmente.
                            </Form.Text>
                        )}
                    </Form.Group>


                    <Form.Group className="mb-3" id="bairro">
                        <Form.Label>Bairro</Form.Label>
                        <Form.Control
                            type="text"
                            name="bairro"
                            placeholder="Digite o CEP e clique em buscar "
                            value={dados.bairro || ""}
                            onChange={handleChange}
                            className={
                                cepNaoEncontrado && dados.bairro
                                    ? "input-warning-grossa"
                                    : ""
                            }
                        />
                        {cepNaoEncontrado && (
                            <Form.Text className="texto-aviso-cep">
                                Cep não encontrado, preencha manualmente.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" id="rua">
                        <Form.Label>Rua</Form.Label>
                        <Form.Control
                            type="text"
                            name="rua"
                            placeholder="Digite o CEP e clique em buscar "
                            value={dados.rua || ""}
                            onChange={handleChange}
                            className={
                                cepNaoEncontrado && dados.rua
                                    ? "input-warning-grossa"
                                    : ""
                            }
                        />
                        {cepNaoEncontrado && (
                            <Form.Text className="texto-aviso-cep">
                                Cep não encontrado, preencha manualmente.
                            </Form.Text>
                        )}
                    </Form.Group>



                    <Form.Group className="mb-3" id="numero">
                        <Form.Label>Numero</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o numero"
                            name="numero"
                            value={dados.numero}
                            onChange={handleChange}
                        />
                    </Form.Group>



                    <Form.Group className="mb-3" id="telefone">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o telefone"
                            name="telefone"
                            value={dados.telefone}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Período do Projeto</Form.Label>
                        <Form.Select name="periodoProjeto" value={dados.periodoProjeto} onChange={handleChange}>
                            <option value="">Selecione o período</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Período Escolar</Form.Label>
                        <Form.Select name="periodoEscola" value={dados.periodoEscola} onChange={handleChange}>
                            <option value="">Selecione o período escolar</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" id="escola">
                        <Form.Label>Escola</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a escola"
                            name="escola"
                            value={dados.escola.nome || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="descricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a descrição"
                            name="descricao"
                            value={dados.descricao}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="dataInsercaoListaEspera">
                        <Form.Label>Data de Inserção na Lista de Espera</Form.Label>
                        <Form.Control
                            type="date"
                            name="dataInsercaoListaEspera"
                            value={dados.dataInsercaoListaEspera}
                            onChange={handleChange}
                        />
                    </Form.Group>


                    <Form.Group className="mb-3" id="rg">
                        <Form.Label>RG</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o RG"
                            name="rg"
                            value={dados.rg}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="formularioSaude">
                        <Form.Label>Formulário de Saúde</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o formulário de saúde"
                            name="formularioSaude"
                            value={dados.formularioSaude.id || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="ficha">
                        <Form.Label>Ficha</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a ficha"
                            name="ficha"
                            value={dados.ficha.id || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="dataInsercaoProjeto">
                        <Form.Label>Data de Inserção no Projeto</Form.Label>
                        <Form.Control
                            type="date"
                            name="dataInsercaoProjeto"
                            value={dados.dataInsercaoProjeto}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o status"
                            name="status"
                            value={dados.status}
                            onChange={handleChange}
                        />
                    </Form.Group>



                    <div className="d-flex justify-content-between">
                        <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
                            Voltar
                        </Button>
                        <Button className="botaoPesquisa" variant="primary" type="submit">
                            {editando ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>

                </Form>
            </PaginaGeral>
        </div>

    );
}
