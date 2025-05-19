import { Alert, Form, Button, Col, Row, OverlayTrigger, Popover } from "react-bootstrap";
import { useState, useEffect, use } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useLocation } from "react-router-dom";
import "../../css/alunoForm.css";
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from "react-icons/fa"; // Ícone de interrogação


export default function FormCadAluno(props) {
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);
    const [respNaoEncontrado, setRespNaoEncontrado] = useState(false);
    const [listaResponsaveis, setListaResponsaveis] = useState([]);
    const [cpfInvalido, setCpfInvalido] = useState(false);
    const [erros, setErros] = useState({ qtdErros: 0 });


    const [dados, setDados] = useState({
        id: 0,
        nome: "",
        dataNascimento: "",
        responsavel: {
            nomeResp: "",
            cpf: "",
            email: ""
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
        rg: "",
        formularioSaude: {},
        ficha: {},
        status: 1,
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

            // Verifica se a resposta foi bem-sucedida (status 200–299)
            if (!response.ok) {
                throw new Error("Erro ao buscar CEP na API.");
            }

            const data = await response.json();

            if (data.erro) {
                // API retornou resposta válida mas com erro de CEP não encontrado
                setCepNaoEncontrado(true);
            } else {
                setCepNaoEncontrado(false);
                setDados((prev) => ({
                    ...prev,
                    cidade: data.localidade,
                    rua: data.logradouro,
                    bairro: data.bairro,
                    cep: data.cep,
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setCepNaoEncontrado(true);
        }
    }



    async function buscarResp() {
        validarCPF(dados.responsavel.cpf);
        const cpf = dados.responsavel.cpf?.replace(/\D/g, ""); // Remove pontos e traços se houver
        const url = `http://localhost:3000/responsaveis/${cpf}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Responsável não encontrado.");
            } else
                setRespNaoEncontrado(false);

            const data = await response.json();

            // Atualiza os dados 
            setDados((prev) => ({
                ...prev,
                responsavel: {
                    ...prev.responsavel,
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                },
            }));
        } catch (error) {
            console.error("Erro ao buscar responsável:", error);
            setRespNaoEncontrado(true);
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        console.log("entrei nessa poha");

        const novosErros = {};
        novosErros.qtdErros = 0;

        const {
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
        } = dados;


        if (!nome) {
            novosErros.nome = true;
            novosErros.qtdErros++;
        }

        if (!dataNascimento) {
            novosErros.dataNascimento = true;
            novosErros.qtdErros++;
        }

        if (!responsavel) {
            novosErros.responsavel = true;
            novosErros.qtdErros++;
        }

        if (!telefone) {
            novosErros.telefone = true;
            novosErros.qtdErros++;
        }

        if (!rua) {
            novosErros.rua = true;
            novosErros.qtdErros++;
        }

        if (!numero) {
            novosErros.numero = true;
            novosErros.qtdErros++;
        }

        if (!bairro) {
            novosErros.bairro = true;
            novosErros.qtdErros++;
        }
        if (!cidade) {
            novosErros.cidade = true;
            novosErros.qtdErros++;
        }
        if (!escola) {
            novosErros.escola = true;
            novosErros.qtdErros++;
        }
        if (!periodoEscola) {
            novosErros.periodoEscola = true;
            novosErros.qtdErros++;
        }
        if (!descricao) {
            novosErros.descricao = true;
            novosErros.qtdErros++;
        }
        if (!possuiSindrome) {
            novosErros.possuiSindrome = true;
            novosErros.qtdErros++;
        }
        if (!realizaAcompanhamento) {
            novosErros.realizaAcompanhamento = true;
            novosErros.qtdErros++;
        }


        console.log("Quantidade de erros:" + novosErros.qtdErros);
        if (novosErros.qtdErros === 0) {
            setErros({});
            console.log("Editando: " + editando);
            const aluno = { ...dados };
            const url = editando
                ? `http://localhost:3000/alunos/${dados.id}`
                : "http://localhost:3000/alunos";
            const method = editando ? "PUT" : "POST";
            try {
                if (editando && window.confirm("Deseja realmente alterar o aluno: " + aluno.nome)) {
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
                                rg: "",
                                formularioSaude: {},
                                ficha: {},
                                status: "",
                                periodoProjeto: "",
                                cep: ""
                            });
                            navigate("/relatorioAluno");
                        }, 3000);
                    } else {
                        setMensagem(editando ? "Erro ao atualizar aluno!" : "Erro ao cadastrar o aluno.");
                    }
                }
                else {
                    if (!editando && window.confirm("Deseja realmente cadastrar o aluno: " + aluno.nome)) {
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
                                    rg: "",
                                    formularioSaude: {},
                                    ficha: {},
                                    status: "",
                                    periodoProjeto: "",
                                    cep: ""
                                });
                                navigate("/relatorioAluno");
                            }, 3000);
                        } else {
                            setMensagem(editando ? "Erro ao atualizar aluno!" : "Erro ao cadastrar o aluno.");
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        else {
            setErros(novosErros);
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
        if (!cpf) {
            setCpfInvalido(true);
        } else {
            // Remove pontos e traço
            const cpfLimpo = cpf.replace(/\D/g, '');

            if (!/^\d{11}$/.test(cpfLimpo)) {
                setCpfInvalido(true);
            }
            else {
                // Verifica se todos os dígitos são iguais (inválido)
                if (/^(\d)\1+$/.test(cpfLimpo)) {
                    setCpfInvalido(true);
                }
                else {
                    const numeros = cpfLimpo.split('').map(Number);

                    // Valida DV1
                    let soma = 0;
                    for (let i = 0; i < 9; i++) {
                        soma += numeros[i] * (10 - i);
                    }
                    let resto = (soma * 10) % 11;
                    let dv1 = resto === 10 ? 0 : resto;
                    if (numeros[9] !== dv1) {
                        setCpfInvalido(true);
                    }
                    else {
                        // Valida DV2
                        soma = 0;
                        for (let i = 0; i < 10; i++) {
                            soma += numeros[i] * (11 - i);
                        }
                        resto = (soma * 10) % 11;
                        let dv2 = resto === 10 ? 0 : resto;
                        if (numeros[10] !== dv2) {
                            setCpfInvalido(true);
                        }
                        else
                            setCpfInvalido(false);
                    }
                }
            }
        }
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
            let numeros = value.replace(/\D/g, ""); // Remove tudo que não é número
            numeros = numeros.slice(0, 11); // Limita a 11 dígitos

            let telefoneFormatado = "";

            if (numeros.length >= 1 && numeros.length <= 2) {
                telefoneFormatado = `(${numeros}`;
            } else if (numeros.length > 2 && numeros.length <= 6) {
                telefoneFormatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
            } else if (numeros.length > 6 && numeros.length <= 10) {
                telefoneFormatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
            } else if (numeros.length === 11) {
                telefoneFormatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
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
        if (name === "periodoEscola") {
            if (value === "Tarde") {
                setDados((prev) => ({
                    ...prev,
                    [name]: value,
                    ["periodoProjeto"]: "Manhã"
                }));
            }
            else
                if (value === "Manhã") {
                    setDados((prev) => ({
                        ...prev,
                        [name]: value,
                        ["periodoProjeto"]: "Tarde"
                    }));
                }
                else {
                    setDados((prev) => ({
                        ...prev,
                        [name]: value,
                        ["periodoProjeto"]: ""
                    }));
                }
        }



        //mascara de cpf

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


                    <div className="divResp">
                        <div className="divTitulo">
                            <strong> <h4>Responsavel</h4></strong>
                        </div>
                        <div className="divResp2">
                            <Form.Group className="mb-3" id="responsavel.cpf">
                                <Form.Label>CPF:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o CPF do(da) Responsavel"
                                    name="responsavel.cpf"
                                    value={dados.responsavel.cpf || ""}
                                    className={erros.responsavel ? "input-error" : ""}
                                    onChange={handleChange}
                                />
                                {cpfInvalido && (
                                    <Form.Text className="texto-aviso-cep">
                                        CPF invalio
                                    </Form.Text>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" id="responsavel.nome">
                                <Form.Label>Nome:</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled
                                    placeholder="Digite o CPF do(da) Responsavel"
                                    name="responsavel.nome"
                                    value={dados.responsavel.nome || ""}

                                />
                            </Form.Group>
                            <Form.Group className="mb-3" id="responsavel.email">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled
                                    placeholder="Digite o CPF do(da) Responsavel"
                                    name="responsavel.email"
                                    value={dados.responsavel.email || ""}

                                />
                            </Form.Group>
                            <Form.Group className="mb-3" id="responsavel.telefone">
                                <Form.Label>Telefone:</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled
                                    placeholder="Digite o CPF do(da) Responsavel"
                                    name="responsavel.nome"
                                    value={dados.responsavel.telefone || ""}

                                />
                            </Form.Group>
                            <Row className="mb-2 align-items-center">
                                <Col xs="auto">
                                    <Button variant="info" onClick={buscarResp}>
                                        Buscar Responsável
                                    </Button>
                                </Col>
                                <Col xs="auto">
                                    <OverlayTrigger
                                        trigger="click"
                                        placement="auto"
                                        rootClose
                                        overlay={
                                            <Popover id="popover-info" className="popover-custom">
                                                <Popover.Header as="h3">O que este botão faz?</Popover.Header>
                                                <Popover.Body>
                                                    Ao clicar, o sistema busca os dados do responsável pelo CPF informado e preenche automaticamente os campos Nome, Email e Telefone.
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <Button variant="link" className="help-button">
                                            <FaQuestionCircle size={20} />
                                        </Button>
                                    </OverlayTrigger>
                                </Col>
                            </Row>

                        </div>
                    </div>




                    <div className="divTitulo">
                        <strong> <h4>Aluno</h4>  </strong>
                    </div>
                    <Form.Group className="mb-3" id="nome">
                        <Form.Label>Nome:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            name="nome"
                            value={dados.nome}
                            onChange={handleChange}
                            className={erros.nome ? 'input-error' : ''}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="dataNascimento">
                        <Form.Label>Data de Nascimento:</Form.Label>
                        <Form.Control
                            type="date"
                            name="dataNascimento"
                            value={dados.dataNascimento}
                            onChange={handleChange}
                            className={erros.dataNascimento ? 'input-error' : ''}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="rg">
                        <Form.Label>RG:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o RG"
                            name="rg"
                            value={dados.rg}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="telefone">
                        <Form.Label>Telefone:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o telefone"
                            name="telefone"
                            value={dados.telefone}
                            onChange={handleChange}
                            className={erros.telefone ? 'input-error' : ''}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Período Escolar:</Form.Label>
                        <Form.Select name="periodoEscola" value={dados.periodoEscola} onChange={handleChange} className={erros.periodoEscola ? 'input-error' : ''}>
                            <option value="">Selecione o período escolar</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Row className="mb-2 align-items-center">
                            <Col xs="auto" className="d-flex align-items-center">
                                <Form.Label className="mb-0 me-2">Período do Projeto</Form.Label>
                                <OverlayTrigger
                                    trigger="click"
                                    placement="auto"
                                    rootClose
                                    overlay={
                                        <Popover id="popover-info" className="popover-custom">
                                            <Popover.Header as="h3">O que este campo faz?</Popover.Header>
                                            <Popover.Body>
                                                O Período do Projeto sempre será no contraturno do Período Escolar, logo o sistema muda ele altomaticamente para o contraturno escolar.
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <Button variant="link" className="help-button p-0 ms-2">
                                        <FaQuestionCircle size={20} />
                                    </Button>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                        <Form.Select name="periodoProjeto" value={dados.periodoProjeto} onChange={handleChange} disabled>
                            <option value="">Selecione o período</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" id="realizaAcompanhamento">
                        <Form.Label>Realiza Acompanhamento em outra Instituição:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Descreva a instituição se ouver"
                            name="realizaAcompanhamento"
                            value={dados.realizaAcompanhamento || ""}
                            onChange={handleChange}
                            className={erros.realizaAcompanhamento ? 'input-error' : ''}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="possuiSindrome">
                        <Form.Label>Possui sindrome ou deficiência: </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Descreva se houver"
                            name="possuiSindrome"
                            value={dados.possuiSindrome || ""}
                            onChange={handleChange}
                            className={erros.possuiSindrome ? 'input-error' : ''}

                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="descricao">
                        <Form.Label>Descrição:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a descrição"
                            name="descricao"
                            value={dados.descricao}
                            onChange={handleChange}
                        />
                    </Form.Group>



                    <div className="divTitulo">
                        <strong> <h4>Escola</h4>  </strong>
                    </div>
                    <Form.Group className="mb-3" id="escola.nome">
                        <Form.Label>Nome:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a escola"
                            name="escola.nome"
                            value={dados.escola.nome || ""}
                            onChange={handleChange}
                            className={erros.escola ? 'input-error' : ''}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="escola.endereco">
                        <Form.Label>Endereco:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a escola"
                            name="escola.endereco"
                            disabled
                            value={dados.escola.endereco || ""}
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
                        <Form.Label>Ficha:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite a ficha"
                            name="ficha"
                            value={dados.ficha.id || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="cep">
                        <Form.Label>CEP:</Form.Label>
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
                        <Col xs="auto">
                            <OverlayTrigger
                                trigger="click"
                                placement="auto"
                                rootClose
                                overlay={
                                    <Popover id="popover-info" className="popover-custom">
                                        <Popover.Header as="h3">O que este botão faz?</Popover.Header>
                                        <Popover.Body>
                                            Ao clicar, o sistema busca os dados do CEP informado e preenche automaticamente os campos Cidade, Bairro e Rua.
                                        </Popover.Body>
                                    </Popover>
                                }
                            >
                                <Button variant="link" className="help-button">
                                    <FaQuestionCircle size={20} />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" id="cidade">
                        <Form.Label>Cidade:</Form.Label>
                        <Form.Control
                            type="text"
                            name="cidade"
                            placeholder="Digite o CEP e clique em buscar "
                            value={dados.cidade || ""}
                            onChange={handleChange}
                            className={erros.cidade ? 'input-error' : ''}
                        />
                        {cepNaoEncontrado && (
                            <Form.Text className="texto-aviso-cep">
                                Cep não encontrado, preencha manualmente.
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" id="bairro">
                        <Form.Label>Bairro:</Form.Label>
                        <Form.Control
                            type="text"
                            name="bairro"
                            placeholder="Digite o CEP e clique em buscar "
                            value={dados.bairro || ""}
                            onChange={handleChange}
                            className={erros.bairro ? 'input-error' : ''}
                        />
                        {cepNaoEncontrado && (
                            <Form.Text className="texto-aviso-cep">
                                Cep não encontrado, preencha manualmente.
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" id="rua">
                        <Form.Label>Rua:</Form.Label>
                        <Form.Control
                            type="text"
                            name="rua"
                            placeholder="Digite o CEP e clique em buscar "
                            value={dados.rua || ""}
                            onChange={handleChange}
                            className={erros.rua ? 'input-error' : ''}
                        />
                        {cepNaoEncontrado && (
                            <Form.Text className="texto-aviso-cep">
                                Cep não encontrado, preencha manualmente.
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" id="numero">
                        <Form.Label>Numero:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o numero"
                            name="numero"
                            value={dados.numero}
                            onChange={handleChange}
                            className={erros.numero ? 'input-error' : ''}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                        <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
                            Voltar
                        </Button>
                        <Button className="botaoPesquisa" variant="primary" type="submit" onClick={handleSubmit}>
                            {editando ? "AtualizaR" : "Cadastrar"}
                        </Button>
                    </div>
                </Form>
            </PaginaGeral>
        </div >

    );
}
