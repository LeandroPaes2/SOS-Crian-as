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
    const [respNaoEncontrado, setRespNaoEncontrado] = useState(false);
    const [cpfInvalido, setCpfInvalido] = useState(false);
    const [erros, setErros] = useState({ qtdErros: 0 });


    const [dados, setDados] = useState({
        id: 0,
        nome: "",
        dataNascimento: "",
        responsavel: {
            cpf: "",
            rg: "",
            nome: "",
            telefone: "",
            email: "",
            sexo: "",
            dtNascimento: "",
            estCivil: "",
            conjuge: "",
            profissao: "",
            situTrabalho: "",
            escolaridade: "",
            rendaFamiliar: "",
            valorRenda: "",
            qtdeTrabalhadores: "",
            pensaoAlimenticia: "",
            valorPensao: "",
            pagadorPensao: "",
            beneficioSocial: "",
            tipoBeneficio: "",
            valorBeneficio: "",
            beneficiario: "",
        },
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


    async function handleSubmit(e) {
        e.preventDefault();
        console.log("entrei nessa poha");
        const novosErros = {};
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

        
        let aux=false;
        let i=0;
        for(i=0;i<objResp.length;i++){
            if(objResp[i].status===1){
                aux=true;
            }
        }

        if(!aux){
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

                    const token = localStorage.getItem("token");
                    const res = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": ` Bearer ${token}`
                        },
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
        let novasLinhas = objEscola;
        novasLinhas = {
            status: 1,
            escola: r
        };
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
            {mensagem && <Alert variant="info">{mensagem}</Alert>}

            <Form onSubmit={handleSubmit} className="formularioD">


                <div className="divResp">
                    <TabelaResponsavel dadosResp={dadosResp} objResp={objResp} setObjsResp={setObjsResp} />
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
                    <Form.Select name="periodoProjeto" value={dados.periodoProjeto} disabled>
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
                            CEP não encontrado, preencha manualmente.
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
                            CEP não encontrado, preencha manualmente.
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
                            CEP não encontrado, preencha manualmente.
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
                <div className="divTitulo">
                    <strong> <h4>Escola</h4>  </strong>
                </div>
                <Form.Group className="mb-3" id="escola.nome">
                    <Form.Label>Nome:</Form.Label>





                    <AutoCompleteNome onSelecionar={(r) => preencherEscola(r)}
                        dadosResp={dadosEscolas}
                        value={dados.escola.nome}
                    />





                </Form.Group>
                <Form.Group className="mb-3" id="escola.endereco">
                    <Form.Label>Endereco:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        name="escola.endereco"
                        disabled
                        value={dados.escola.endereco || ""}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" id="escola.telefone">
                    <Form.Label>Telefone:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        name="escola.telefone"
                        disabled
                        value={dados.escola.telefone || ""}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" id="escola.tipo">
                    <Form.Label>Tipo:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        name="escola.tipo"
                        disabled
                        value={dados.escola.tipo || ""}
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
    );

}
