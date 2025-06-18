import Swal from 'sweetalert2';
import { Alert, Form, Button, Col, Row, OverlayTrigger, Popover } from "react-bootstrap";
import { useState, useEffect, use } from "react";
import PaginaGeral from "../../../layouts/PaginaGeral";
import { Link, useLocation } from "react-router-dom";
import "./css/alunoForm.css";
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from "react-icons/fa"; // Ícone de interrogação
import TabelaResponsavel from "./TabelaResponsavel";
import AutoCompleteNome from "./AutoCompleteNome";

export default function FormCadAluno(props) {
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);


    const [dados, setDados] = useState({
        id: 0,
        nome: "",
        dataNascimento: "",
        listaResponsaveis: [{}],
        cidade: "",
        rua: "",
        bairro: "",
        numero: "",
        escola: {
            id: 0,
            nome: "",
            endereco: "",
            telefone: "",
            tipo: ""
        },
        telefone: "",
        periodoEscola: "",
        realizaAcompanhamento: "",
        possuiSindrome: "",
        descricao: "",
        rg: "",
        formularioSaude: {},
        ficha: {},
        status: 2,
        periodoProjeto: "",
        cep: ""
    });


    const [erros, setErros] = useState({
        qtdErros: 0,
        nome: -1,
        dataNascimento: -1,
        listaResponsaveis: -1,
        cidade: -1,
        rua: -1,
        bairro: -1,
        numero: -1,
        escola: -1,
        telefone: -1,
        periodoEscola: -1,
        realizaAcompanhamento: -1,
        possuiSindrome: -1,
        descricao: -1,
        rg: -1,
        formularioSaude: -1,
        ficha: -1,
        periodoProjeto: -1,
        cep: -1
    });
    const navigate = useNavigate();
    const rotaVoltar = editando ? "/relatorioAluno" : "/telaMenu";

    useEffect(() => {
        console.log(location.state);
        if (location.state && location.state.id) {
            setDados((prev) => ({
                ...prev,
                ...location.state
            }));
            let i;
            let novosObjResp = [];
            for (i = 0; i < location.state.listaResponsaveis.length; i++) {
                const aux = {
                    status: 1,
                    disabled: true,
                    Responsavel: location.state.listaResponsaveis[i]
                }
                novosObjResp.push(aux);
            }
            setObjsResp(novosObjResp);
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

    function formatarDataParaInput(data) {
        if (!data) return '';
        return new Date(data).toISOString().split('T')[0];
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("entrei nessa poha");
        let novosErros = {};
        novosErros.qtdErros = 0;
        const {
            nome,
            dataNascimento,
            cidade,
            rua,
            bairro,
            numero,
            escola,
            telefone,
            periodoEscola,
            realizaAcompanhamento,
            possuiSindrome,
        } = dados;


        if (!nome) {
            novosErros.nome = 1;
            novosErros.qtdErros++;
        }

        if (!dataNascimento) {
            novosErros.dataNascimento = 1;
            novosErros.qtdErros++;
        }


        dados.listaResponsaveis = [];
        let i = 0;
        for (i = 0; i < objResp.length; i++) {
            if (objResp[i].status === 1) {
                dados.listaResponsaveis.push(objResp[i].Responsavel.cpf);
            }
        }



        if (dados.listaResponsaveis.length === 0) {
            novosErros.responsavel = 1;
            novosErros.qtdErros++;
        }

        if (!telefone) {
            novosErros.telefone = 1;
            novosErros.qtdErros++;
        }

        if (!rua) {
            novosErros.rua = 1;
            novosErros.qtdErros++;
        }

        if (!numero) {
            novosErros.numero = 0;
            novosErros.qtdErros++;
        }

        if (!bairro) {
            novosErros.bairro = 0;
            novosErros.qtdErros++;
        }

        if (!cidade) {
            novosErros.cidade = 0;
            novosErros.qtdErros++;
        }

        if (!escola) {
            novosErros.escola = 0;
            novosErros.qtdErros++;
        }

        if (!periodoEscola) {
            novosErros.periodoEscola = 0;
            novosErros.qtdErros++;
        }


        if (!possuiSindrome) {
            novosErros.possuiSindrome = 0;
            novosErros.qtdErros++;
        }

        if (!realizaAcompanhamento) {
            novosErros.realizaAcompanhamento = 0;
            novosErros.qtdErros++;
        }


        console.log("Quantidade de erros:" + novosErros.qtdErros);
        if (novosErros.qtdErros === 0) {
            setErros({ qtdErros: 0 });
            //console.log("Editando: " + editando);





            const aluno = { ...dados };
            const url = editando
                ? `http://localhost:3000/alunos/${dados.id}`
                : "http://localhost:3000/alunos";
            const method = editando ? "PUT" : "POST";
            try {
                // console.log("ALUNO: ");
                // console.log(aluno);
                // console.log("Token: " + token);

                if (editando && window.confirm("Deseja realmente alterar o aluno: " + aluno.nome)) {
                    const res = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": ` Bearer ${token}`
                        },
                        body: JSON.stringify(aluno)
                    });
                    console.log("EDITANDO ALUNO: ");
                    console.log(aluno);
                    console.log("alunoJson" + JSON.stringify(aluno));




                    



                    if (res.ok) {
                        setMensagem(editando ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
                        setTimeout(() => {
                            setDados({
                                id: 0,
                                nome: "",
                                dataNascimento: "",
                                listaResponsaveis: [{}],
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
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify(aluno),
                        });
                        console.log("ALUNO: ");
                        console.log(aluno);
                        console.log("alunoJson" + JSON.stringify(aluno));

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

    const handleChange = (e) => {
        const { name, value } = e.target;

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
        }
        else {
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
            }
            else {
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
                }
                else {
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
                    else
                        setDados((prev) => ({ ...prev, [name]: value }));
                }
            }
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

        // if (name.includes(".")) {


        //     const [parent, child] = name.split(".");
        //     setDados((prev) => ({
        //         ...prev,
        //         [parent]: {
        //             ...prev[parent],
        //             [child]: value2
        //         }
        //     }));
        // } else {
        //     setDados((prev) => ({ ...prev, [name]: value }));
        // }
    };

    // TABELA DINAMICA

    const [dadosResp, setDadosResp] = useState([]);
    const [objResp, setObjsResp] = useState([]);
    const [dadosEscolas, setDadosEscolas] = useState([]);
    const [objEscola, setObjsEscola] = useState({});




    useEffect(() => {
        async function carregarDadosResp() {
            let token = sessionStorage.getItem("token");
            if (!token) {
                token = localStorage.getItem("token");
            }

            try {
                const res = await fetch("http://localhost:3000/responsaveis", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const vetorResponsaveis = await res.json();
                    let lista2 = [];
                    let i;
                    for (i = 0; i < vetorResponsaveis.length; i++) {
                        lista2.push(vetorResponsaveis[i]);

                    }
                    setDadosResp(lista2);
                } else {
                    throw new Error("Erro ao buscar responsáveis");
                }
            } catch (error) {
                console.error("Erro ao carregar os Responsáveis:", error);
                // Se tiver um setMensagem ou algo parecido, pode usar aqui:
                // setMensagem("Erro ao carregar os Responsáveis.");
            }
        }

        carregarDadosResp();
    }, []);

    useEffect(() => {
        async function carregarDadosEscola() {
            let token = sessionStorage.getItem("token");
            if (!token) {
                token = localStorage.getItem("token");
            }

            try {
                const res = await fetch("http://localhost:3000/escolas", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const vetorEscolas = await res.json();

                    let lista2 = [];
                    let i;
                    for (i = 0; i < vetorEscolas.length; i++) {
                        lista2.push(vetorEscolas[i]);

                    }
                    setDadosEscolas(lista2);
                } else {
                    throw new Error("Erro ao buscar escolas");
                }
            } catch (error) {
                console.error("Erro ao carregar os escolas:", error);
                // Se tiver um setMensagem ou algo parecido, pode usar aqui:
                // setMensagem("Erro ao carregar os Responsáveis.");
            }
        }
        carregarDadosEscola();
    }, []);





    /*
     objResp[
     
     {
        disable:false,
        status: -1,  // -1 não informado 0 erro 1 sucesso
        Responsavel: {
            cpf: "",
            nome: "",
            telefone: ""
        }
    },
    ...
        
    
    ]
    */





    const preencherEscola = (r) => {
        setDados((prev) => ({
            ...prev,
            escola: r
        }));

    };
    /*
        objEscola{
            status: -1,  // -1 não informado 0 erro 1 sucesso
            escola: {
                id: "",
                nome: "",
                endereco: "",
                telefone: "",
                tipo: ""
            }
        }
    */

    return (
        <PaginaGeral>
            <Form onSubmit={handleSubmit} className="formularioD">
                {mensagem && <Alert variant="info">{mensagem}</Alert>}
                <div className="divResp">
                    <TabelaResponsavel dadosResp={dadosResp} objResp={objResp} setObjsResp={setObjsResp} />
                </div>
                <div className="divTitulo">
                    <strong> <h4>Atendido</h4>  </strong>
                </div>

                <Form.Group className="mb-3" id="nome">
                    <Form.Label style={{ fontWeight: '500' }}>Nome:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o nome"
                        name="nome"
                        value={dados.nome}
                        onChange={handleChange}
                        className={`inputAluno ${erros.nome === 1 ? 'input-error' : ''}`}
                    />
                </Form.Group>
                <Form.Group className="mb-3" id="dataNascimento">
                    <Form.Label style={{ fontWeight: '500' }}>Data de Nascimento:</Form.Label>
                    <Form.Control
                        type="date"
                        name="dataNascimento"
                        value={formatarDataParaInput(dados.dataNascimento)}
                        onChange={handleChange}
                        className={`inputAluno ${erros.dataNascimento === 1 ? 'input-error' : ''}`}
                    />
                </Form.Group>
                <Form.Group className="mb-3" id="rg">
                    <Form.Label style={{ fontWeight: '500' }}>RG:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o RG"
                        name="rg"
                        value={dados.rg}
                        className={`inputAluno ${erros.rg === 1 ? 'input-error' : ''}`}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" id="telefone">
                    <Form.Label style={{ fontWeight: '500' }}>Telefone:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o telefone"
                        name="telefone"
                        value={dados.telefone}
                        onChange={handleChange}
                        className={`inputAluno ${erros.telefone === 1 ? 'input-error' : ''}`}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '500' }}>Período Escolar:</Form.Label>
                    <Form.Select
                        name="periodoEscola"
                        value={dados.periodoEscola}
                        onChange={handleChange}
                        className={`inputAluno ${erros.periodoEscola === 1 ? 'input-error' : ''}`}
                    >
                        <option value="">Selecione o período escolar</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                    </Form.Select>
                </Form.Group>

                {/* Período do Projeto com Ajuda */}
                <Form.Group className="mb-3">
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Label className="mb-0" style={{ fontWeight: '500' }}>Período do Projeto</Form.Label>
                        </Col>
                        <Col xs="auto">
                            <OverlayTrigger
                                trigger="click"
                                placement="auto"
                                rootClose
                                overlay={
                                    <Popover id="popover-info" className="popover-custom">
                                        <Popover.Header as="h3">O que este campo faz?</Popover.Header>
                                        <Popover.Body>
                                            O Período do Projeto sempre será no contraturno do Período Escolar.
                                        </Popover.Body>
                                    </Popover>
                                }
                            >
                                <Button variant="link" className="help-button p-0">
                                    <FaQuestionCircle size={20} />
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                    <Form.Select
                        name="periodoProjeto"
                        value={dados.periodoProjeto}
                        className="inputAluno"
                        disabled
                    >
                        <option value="">Selecione o período</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" id="realizaAcompanhamento">
                    <Form.Label style={{ fontWeight: '500' }}>Realiza Acompanhamento em outra Instituição:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Descreva a instituição se houver"
                        name="realizaAcompanhamento"
                        value={dados.realizaAcompanhamento || ""}
                        onChange={handleChange}
                        className={`inputAluno ${erros.realizaAcompanhamento === 1 ? 'input-error' : ''}`}
                    />
                </Form.Group>

                <Form.Group className="mb-3" id="possuiSindrome">
                    <Form.Label style={{ fontWeight: '500' }}>Possui síndrome ou deficiência:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Descreva se houver"
                        name="possuiSindrome"
                        value={dados.possuiSindrome || ""}
                        onChange={handleChange}
                        className={`inputAluno ${erros.possuiSindrome === 1 ? 'input-error' : ''}`}
                    />
                </Form.Group>

                <Form.Group className="mb-3" id="descricao">
                    <Form.Label style={{ fontWeight: '500' }}>Descrição:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite a descrição"
                        name="descricao"
                        value={dados.descricao}
                        onChange={handleChange}
                        className="inputAluno"
                    />
                </Form.Group>

                {/* Ficha e Saúde */}
                {/* <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" id="formularioSaude">
                            <Form.Label style={{ fontWeight: '500' }}>Formulário de Saúde:</Form.Label>
                            <Form.Control
                                type="text"
                                name="formularioSaude"
                                value={dados.formularioSaude.id || ""}
                                onChange={handleChange}
                                className="inputAluno"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" id="ficha">
                            <Form.Label style={{ fontWeight: '500' }}>Ficha:</Form.Label>
                            <Form.Control
                                type="text"
                                name="ficha"
                                value={dados.ficha.id || ""}
                                onChange={handleChange}
                                className="inputAluno"
                            />
                        </Form.Group>
                    </Col>
                </Row> */}


                {/* Endereço */}
                <div className="divTitulo">
                    <h4><strong>Endereço</strong></h4>
                </div>

                <Form.Group className="mb-3" id="cep">
                    <Form.Label style={{ fontWeight: '500' }}>CEP:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o CEP"
                        name="cep"
                        value={dados.cep}
                        onChange={handleChange}
                        className="inputAluno"
                    />
                </Form.Group>

                {/* Botão de Buscar CEP com Ajuda */}
                <Row className="mb-2 align-items-center">
                    <Col xs="auto">
                        <Button className="botaoPesquisaForm" variant="info" onClick={buscarCep}>
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
                                        Busca dados do CEP informado e preenche Cidade, Bairro e Rua.
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

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3" id="cidade">
                            <Form.Label style={{ fontWeight: '500' }}>Cidade:</Form.Label>
                            <Form.Control
                                type="text"
                                name="cidade"
                                value={dados.cidade || ""}
                                onChange={handleChange}
                                className={`inputAluno ${erros.cidade === 1 ? 'input-error' : ''}`}
                            />
                            {cepNaoEncontrado && <Form.Text className="texto-aviso-cep">CEP não encontrado</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" id="bairro">
                            <Form.Label style={{ fontWeight: '500' }}>Bairro:</Form.Label>
                            <Form.Control
                                type="text"
                                name="bairro"
                                value={dados.bairro || ""}
                                onChange={handleChange}
                                className={`inputAluno ${erros.bairro === 1 ? 'input-error' : ''}`}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" id="rua">
                            <Form.Label style={{ fontWeight: '500' }}>Rua:</Form.Label>
                            <Form.Control
                                type="text"
                                name="rua"
                                value={dados.rua || ""}
                                onChange={handleChange}
                                className={`inputAluno ${erros.rua === 1 ? 'input-error' : ''}`}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" id="numero">
                    <Form.Label style={{ fontWeight: '500' }}>Número:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o número"
                        name="numero"
                        value={dados.numero}
                        onChange={handleChange}
                        className={`inputAluno ${erros.numero === 1 ? 'input-error' : ''}`}
                    />
                </Form.Group>

                {/* Escola */}
                <div className="divTitulo">
                    <h4><strong>Escola</strong></h4>
                </div>

                <Form.Group className="mb-3" id="escola.nome">
                    <Form.Label style={{ fontWeight: '500' }}>Nome:</Form.Label>
                    <AutoCompleteNome
                        onSelecionar={(r) => preencherEscola(r)}
                        dadosResp={dadosEscolas}
                        value={dados.escola.nome}
                        className="inputAluno"
                    />
                
                </Form.Group>
                <Form.Group className="mb-3" id="escola.endereco">
                    <Form.Label style={{ fontWeight: '500' }}>Endereco:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        name="escola.endereco"
                        disabled
                        value={dados.escola.endereco || ""}
                        onChange={handleChange}
                        className="inputAluno"
                    />
                </Form.Group>
                <Form.Group className="mb-3" id="escola.telefone">
                    <Form.Label style={{ fontWeight: '500' }}>Telefone:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        name="escola.telefone"
                        disabled
                        value={dados.escola.telefone || ""}
                        onChange={handleChange}
                        className="inputAluno"
                    />
                </Form.Group>
                <Form.Group className="mb-3" id="escola.tipo">
                    <Form.Label style={{ fontWeight: '500' }}>Tipo:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        name="escola.tipo"
                        disabled
                        value={dados.escola.tipo || ""}
                        onChange={handleChange}
                        className="inputAluno"
                    />
                </Form.Group>
                <div className="d-flex justify-content-between mt-4 margintop">
                    <Button as={Link} to={rotaVoltar} variant="secondary">
                        ⬅️  Voltar
                    </Button>
                    <Button variant="secondary" type="submit" >
                        {editando ? "Atualizar" : "Cadastrar"}
                    </Button>
                </div>
            </Form>
        </PaginaGeral>
    );


}
