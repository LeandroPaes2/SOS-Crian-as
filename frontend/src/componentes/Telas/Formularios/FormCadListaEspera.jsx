/*import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaListaEspera.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FormCadListaEspera() {
    const [listaEspera, setListaEspera] = useState({

        id: 0,
        nome: "",
        dataNascimento: "",
        responsavel: "",
        rua: "",
        numero: "",
        escola: "",
        telefone: "",
        periodoEscola: "",
        realizaAcompanhamento: "",
        possuiSindrome: "",
        descricao: "",
        dataInsercao: ""
    });
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(location.state?.editando || false);
    const [escolas, setEscolas] = useState([]);


    useEffect(() => {
        if (editando && location.state) {
            setListaEspera({
                id: location.state.id,
                nome: location.state.nome,
                dataNascimento: location.state.dataNascimento,
                responsavel: location.state.responsavel,
                rua: location.state.rua,
                numero: location.state.numero,
                escola: location.state.escola,
                telefone: location.state.telefone,
                periodoEscola: location.state.periodoEscola,
                realizaAcompanhamento: location.state.realizaAcompanhamento,
                possuiSindrome: location.state.possuiSindrome,
                descricao: location.state.descricao,
                dataInsercao: location.state.dataInsercao
            });
        }
    }, [editando, location.state]);


    useEffect(() => {
        async function carregarEscolas() {
            try {
                const resposta = await fetch('http://localhost:3000/escolas'); // ou ajuste a URL se for diferente
                const dados = await resposta.json();
                setEscolas(dados);
            } catch (erro) {
                console.error('Erro ao carregar escolas:', erro);
            }
        }
    
        carregarEscolas();
    }, []);
    

    function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;
        setListaEspera({ ...listaEspera, [elemento]: valor });
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
    
        let novaListaEspera = { ...listaEspera };
    
        if (!editando) {
            const hoje = new Date();
            const dataFormatada = hoje.toISOString().split('T')[0]; // Formato 'yyyy-mm-dd'
            novaListaEspera.dataInsercao = dataFormatada;
        }
    
        // Verifique se todos os campos necessários estão preenchidos
        if (!novaListaEspera.nome || !novaListaEspera.dataNascimento || !novaListaEspera.responsavel || !novaListaEspera.rua || !novaListaEspera.numero || !novaListaEspera.escola || !novaListaEspera.telefone || !novaListaEspera.periodoEscola || !novaListaEspera.realizaAcompanhamento || !novaListaEspera.possuiSindrome || !novaListaEspera.descricao || !novaListaEspera.dataInsercao) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        if (!validarCPF(listaEspera.responsavel.cpf)) {
            setMensagem("CPF inválido");
            return;
        }
    
        const url = editando ? `http://localhost:3000/listaEsperas/${novaListaEspera.id}` : "http://localhost:3000/listaEsperas";
        const method = editando ? "PUT" : "POST";
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaListaEspera)
            });
            
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Detalhes do erro:", errorDetails);
                setMensagem(`Erro: ${errorDetails.mensagem || 'Verifique os dados fornecidos.'}`);
            } else {
                const data = await response.json();
                console.log("Lista de Espera atualizada:", data);
                setMensagem(editando ? "Lista de Espera atualizada com sucesso!" : "Cadastrado na Lista de Espera com sucesso!");
            }
    
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };
    
    

    return (
        <div>
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>Cadastro na Lista de Espera</h2>
                </Alert>

                {mensagem && <Alert variant="info">{mensagem}</Alert>}

                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" id="id">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text" value={listaEspera.id} readOnly />
                </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            id = "nome"
                            placeholder="Digite o nome"
                            value={listaEspera.nome}
                            name="nome"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Data de Nascimento</Form.Label>
                        <Form.Control
                            type="date"
                            id = "dataNascimento"
                            value={listaEspera.dataNascimento}
                            name="dataNascimento"
                            onChange={manipularMudanca}
                            disabled={editando}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Responsavel</Form.Label>
                        <Form.Select
                            value={listaEspera.responsavel}
                            id = "responsavel"
                            name="responsavel"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione um cargo</option>
                            <option value="coordenador">Coordenador</option>
                            <option value="professor">Professor</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rua</Form.Label>
                        <Form.Control
                            type="text"
                            id = "rua"
                            placeholder="Digite a Rua"
                            value={listaEspera.rua}
                            name="rua"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Número</Form.Label>
                        <Form.Control
                            type="text"
                            id = "numero"
                            placeholder="Digite o Numero da Casa"
                            value={listaEspera.numero}
                            name="numero"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Escola</Form.Label>
                        <Form.Select
                            value={listaEspera.escola}
                            id="escola"
                            name="escola"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione uma escola</option>
                            {escolas.map((escola) => (
                                <option key={escola.id} value={escola.nome}>
                                    {escola.nome}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control
                            type="text"
                            id = "telefone"
                            placeholder="Digite o Telefone"
                            value={listaEspera.telefone}
                            name="telefone"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Período da Escola</Form.Label>
                        <Form.Select
                            value={listaEspera.periodoEscola}
                            name="periodoEscola"
                            id="periodoEscola"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione um período da escola</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>A criança Realiza Acompanhamento?</Form.Label>
                    <Form.Control
                        type="text"
                        id = "realizaAcompanhamento"
                        placeholder="Digite o Telefone"
                        value={listaEspera.realizaAcompanhamento}
                        name="realizaAcompanhamento"
                        onChange={manipularMudanca}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>A criança Possui Alguma Sindrome?</Form.Label>
                    <Form.Control
                        type="text"
                        id = "possuiSindrome"
                        placeholder="Digite o Telefone"
                        value={listaEspera.possuiSindrome}
                        name="possuiSindrome"
                        onChange={manipularMudanca}
                    />
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>Descrição do Motivo de Interesse na Vaga:</Form.Label>
                    <Form.Control
                        type="text"
                        id = "descricao"
                        placeholder="Digite o Telefone"
                        value={listaEspera.descricao}
                        name="descricao"
                        onChange={manipularMudanca}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Data de Inserção</Form.Label>
                    <Form.Control
                        type="date"
                        id="dataInsercao"
                        value={listaEspera.dataInsercao}
                        name="dataInsercao"
                        onChange={manipularMudanca}
                        disabled 
                    />
                </Form.Group>


                    <Button as={Link} to="/telaListaEspera" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                    <Button className="botaoPesquisa" variant="primary" type="submit">
                        {editando ? "Atualizar" : "Cadastrar"}
                    </Button>
                </Form>
            </PaginaGeral>
        </div>
    );
}*/


/*
import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaListaEspera.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Importando useNavigate



export default function FormCadListaEspera() {
    // Dentro do seu componente
    const navigate = useNavigate();
    const [listaEspera, setListaEspera] = useState({
        id: 0,
        nome: "",
        dataNascimento: "",
        cpfResponsavel: "",
        responsavelNome: "",
        rua: "",
        numero: "",
        escola: "",
        telefone: "",
        periodoEscola: "",
        realizaAcompanhamento: "",
        possuiSindrome: "",
        descricao: "",
        dataInsercao: ""
    });

    const [mensagem, setMensagem] = useState("");
    const [escolas, setEscolas] = useState([]);
    const location = useLocation();
    const [editando, setEditando] = useState(location.state?.editando || false);

    useEffect(() => {
        if (editando && location.state) {
            setListaEspera({
                id: location.state.id,
                nome: location.state.nome,
                dataNascimento: location.state.dataNascimento,
                cpfResponsavel: location.state.cpfResponsavel,
                responsavelNome: location.state.responsavelNome,
                rua: location.state.rua,
                numero: location.state.numero,
                escola: location.state.escola,
                telefone: location.state.telefone,
                periodoEscola: location.state.periodoEscola,
                realizaAcompanhamento: location.state.realizaAcompanhamento,
                possuiSindrome: location.state.possuiSindrome,
                descricao: location.state.descricao,
                dataInsercao: location.state.dataInsercao
            });
        }
    }, [editando, location.state]);

    useEffect(() => {
        async function carregarEscolas() {
            try {
                const resposta = await fetch('http://localhost:3000/escolas');
                const dados = await resposta.json();
                setEscolas(dados);
            } catch (erro) {
                console.error('Erro ao carregar escolas:', erro);
            }
        }
        carregarEscolas();
    }, []);

    function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;
        setListaEspera({ ...listaEspera, [elemento]: valor });
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }



    async function buscarResponsavel(cpf) {
        try {
            // Fazendo a busca do responsável pelo CPF
            const resposta = await fetch(`http://localhost:3000/responsaveis/cpf/${cpf}`);
            
            if (!resposta.ok) {
                // Se o responsável não for encontrado, mostramos o erro e limpamos os dados
                throw new Error('Responsável não encontrado.');
            }
            
            const responsavel = await resposta.json();
    
            // Atualizando os campos com as informações do responsável
            setListaEspera(prev => ({
                ...prev,
                responsavelNome: responsavel.nome,
                rua: responsavel.rua,
                numero: responsavel.numero,
                telefone: responsavel.telefone
            }));
    
            // Limpando a mensagem de erro, se o responsável for encontrado
            setMensagem("");
        } catch (erro) {
            console.error("Erro ao buscar responsável:", erro);
            // Se ocorrer um erro, mostramos uma mensagem de erro para o usuário
            setMensagem("Responsável não encontrado pelo CPF informado.");
            
            // Limpando os campos do responsável se não encontrado
            setListaEspera(prev => ({
                ...prev,
                responsavelNome: "",
                rua: "",
                numero: "",
                telefone: ""
            }));
        }
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validarCPF(listaEspera.cpfResponsavel)) {
            setMensagem("CPF do responsável inválido!");
            return;
        }
    
        // Verifica se o nome do responsável foi encontrado
        if (!listaEspera.responsavelNome) {
            setMensagem("Responsável não encontrado. Verifique o CPF informado.");
            return;
        }
    
        // Verifica campos obrigatórios
        const camposObrigatorios = ["nome", "dataNascimento", "rua", "numero", "escola", "telefone", "periodoEscola", "realizaAcompanhamento", "possuiSindrome", "descricao"];
        for (const campo of camposObrigatorios) {
            if (!listaEspera[campo] || listaEspera[campo].trim() === "") {
                setMensagem("Preencha todos os campos obrigatórios.");
                return;
            }
        }
    
        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];
    
        const novaListaEspera = {
            ...listaEspera,
            dataInsercao: editando ? listaEspera.dataInsercao : dataFormatada
        };
    
        const url = editando
            ? `http://localhost:3000/listaEsperas/${novaListaEspera.id}`
            : "http://localhost:3000/listaEsperas";
    
        const method = editando ? "PUT" : "POST";
    
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaListaEspera)
            });
    
            if (!response.ok) {
                const error = await response.json();
                setMensagem(`Erro: ${error.mensagem || "Falha ao salvar dados."}`);
                return;
            }
    
            setMensagem(editando ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
            setTimeout(() => navigate("/telaListaEspera"), 2000);
    
        } catch (error) {
            console.error("Erro ao salvar:", error);
            setMensagem("Erro ao conectar com o servidor.");
        }
    };
    

    return (
        <div>
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>Cadastro na Lista de Espera</h2>
                </Alert>

                {mensagem && <Alert variant="info">{mensagem}</Alert>}

                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" id="id">
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" value={listaEspera.id} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nome da Criança</Form.Label>
                        <Form.Control
                            type="text"
                            id="nome"
                            placeholder="Digite o nome"
                            value={listaEspera.nome}
                            name="nome"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Data de Nascimento</Form.Label>
                        <Form.Control
                            type="date"
                            id="dataNascimento"
                            value={listaEspera.dataNascimento}
                            name="dataNascimento"
                            onChange={manipularMudanca}
                            disabled={editando}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>CPF do Responsável</Form.Label>
                        <Form.Control
                            type="text"
                            id="cpfResponsavel"
                            placeholder="Digite o CPF"
                            value={listaEspera.cpfResponsavel}
                            name="cpfResponsavel"
                            onChange={async (e) => {
                                manipularMudanca(e);
                                const cpf = e.target.value;
                                if (validarCPF(cpf)) {
                                    await buscarResponsavel(cpf);
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nome do Responsável</Form.Label>
                        <Form.Control
                            type="text"
                            id="responsavelNome"
                            placeholder="Nome do responsável"
                            value={listaEspera.responsavelNome}
                            name="responsavelNome"
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rua</Form.Label>
                        <Form.Control
                            type="text"
                            id="rua"
                            placeholder="Digite a Rua"
                            value={listaEspera.rua}
                            name="rua"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Número</Form.Label>
                        <Form.Control
                            type="text"
                            id="numero"
                            placeholder="Digite o Número"
                            value={listaEspera.numero}
                            name="numero"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Escola</Form.Label>
                        <Form.Select
                            value={listaEspera.escola}
                            id="escola"
                            name="escola"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione uma escola</option>
                            {escolas.map((escola) => (
                                <option key={escola.id} value={escola.nome}>
                                    {escola.nome}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control
                            type="text"
                            id="telefone"
                            placeholder="Digite o Telefone"
                            value={listaEspera.telefone}
                            name="telefone"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Período da Escola</Form.Label>
                        <Form.Select
                            value={listaEspera.periodoEscola}
                            name="periodoEscola"
                            id="periodoEscola"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione um período</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Acompanhamento?</Form.Label>
                        <Form.Control
                            type="text"
                            id="realizaAcompanhamento"
                            placeholder="Realiza acompanhamento?"
                            value={listaEspera.realizaAcompanhamento}
                            name="realizaAcompanhamento"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Possui Síndrome?</Form.Label>
                        <Form.Control
                            type="text"
                            id="possuiSindrome"
                            placeholder="Possui alguma síndrome?"
                            value={listaEspera.possuiSindrome}
                            name="possuiSindrome"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descrição do Motivo</Form.Label>
                        <Form.Control
                            type="text"
                            id="descricao"
                            placeholder="Descrição do interesse na vaga"
                            value={listaEspera.descricao}
                            name="descricao"
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Data de Inserção</Form.Label>
                        <Form.Control
                            type="date"
                            id="dataInsercao"
                            value={listaEspera.dataInsercao}
                            name="dataInsercao"
                            readOnly
                        />
                    </Form.Group>

                    <Button as={Link} to="/telaListaEspera" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                    <Button className="botaoPesquisa" variant="primary" type="submit">
                        {editando ? "Atualizar" : "Cadastrar"}
                    </Button>
                </Form>
            </PaginaGeral>
        </div>
    );
}*/

import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaListaEspera.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function FormCadListaEspera() {
    const navigate = useNavigate();
    const location = useLocation();
    const [editando, setEditando] = useState(location.state?.editando || false);

    const [listaEspera, setListaEspera] = useState({
        id: 0,
        nome: "",
        dataNascimento: "",
        responsavel: {
            cpf: "",
            nome: "",
            telefone: ""
        },
        rua: "",
        numero: "",
        escola: {
            id: "",
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
        dataInsercao: ""
    });

    const [mensagem, setMensagem] = useState("");
    const [escolas, setEscolas] = useState([]);

    useEffect(() => {
        if (editando && location.state) {
            setListaEspera({ ...location.state });
        }
    }, [editando, location.state]);

    useEffect(() => {
        async function carregarEscolas() {
            try {
                const resposta = await fetch('http://localhost:3000/escolas');
                const dados = await resposta.json();
                setEscolas(dados);
            } catch (erro) {
                console.error('Erro ao carregar escolas:', erro);
            }
        }
        carregarEscolas();
    }, []);

    function manipularMudanca(evento) {
        const { name, value } = evento.target;
        setListaEspera({ ...listaEspera, [name]: value });
    }

    function manipularMudancaResponsavel(evento) {
        const { name, value } = evento.target;
        setListaEspera((prev) => ({
            ...prev,
            responsavel: { ...prev.responsavel, [name]: value }
        }));
    }

    function manipularMudancaEscola(evento) {
        const { value } = evento.target;
        const escolaSelecionada = escolas.find(e => e.id.toString() === value);
        if (escolaSelecionada) {
            setListaEspera(prev => ({
                ...prev,
                escola: { ...escolaSelecionada }
            }));
        }
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    async function buscarResponsavelPorNome(nomeResponsavel, cpfResponsavel) {
        try {
            const resposta = await fetch(`http://localhost:3000/responsaveis?nome=${nomeResponsavel}`);
            const listaResponsaveis = await resposta.json();
    
            if (listaResponsaveis.length === 0) {
                throw new Error('Nenhum responsável encontrado com esse nome.');
            }
    
            // Procurar o responsável certo pelo CPF
            const responsavelCorreto = listaResponsaveis.find(r => 
                r.cpf.replace(/[^\d]+/g, '') === cpfResponsavel.replace(/[^\d]+/g, '')
            );
    
            if (!responsavelCorreto) {
                throw new Error('Nenhum responsável encontrado com o CPF informado.');
            }
    
            setListaEspera(prev => ({
                ...prev,
                responsavel: {
                    cpf: responsavelCorreto.cpf,
                    nome: responsavelCorreto.nome,
                    telefone: responsavelCorreto.telefone
                }
            }));
    
            setMensagem("");
        } catch (erro) {
            console.error("Erro ao buscar responsável:", erro);
            setMensagem(erro.message);
            setListaEspera(prev => ({
                ...prev,
                responsavel: {
                    cpf: "",
                    nome: "",
                    telefone: ""
                }
            }));
        }
    }
    

    const handleSubmit = async (evento) => {
        evento.preventDefault();

        if (!validarCPF(listaEspera.responsavel.cpf)) {
            setMensagem("CPF do responsável inválido!");
            return;
        }

        if (!listaEspera.responsavel.nome || !listaEspera.responsavel.telefone) {
            setMensagem("Responsável não encontrado. Verifique nome e CPF.");
            return;
        }

        const camposObrigatorios = ["nome", "dataNascimento", "rua", "numero", "telefone", "periodoEscola", "realizaAcompanhamento", "possuiSindrome", "descricao"];
        for (const campo of camposObrigatorios) {
            if (!listaEspera[campo] || listaEspera[campo].trim() === "") {
                setMensagem("Preencha todos os campos obrigatórios.");
                return;
            }
        }

        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];

        const novaListaEspera = {
            ...listaEspera,
            dataInsercao: editando ? listaEspera.dataInsercao : dataFormatada
        };

        const url = editando
            ? `http://localhost:3000/listaEsperas/${novaListaEspera.id}`
            : "http://localhost:3000/listaEsperas";

        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaListaEspera)
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar dados.");
            }

            setMensagem(editando ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
            setTimeout(() => navigate("/telaListaEspera"), 2000);

        } catch (erro) {
            console.error('Erro ao salvar:', erro);
            setMensagem(erro.message);
        }
    };

    return (
        <div>
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>{editando ? "Editar" : "Cadastro"} Lista de Espera</h2>
                </Alert>

                {mensagem && <Alert variant="info">{mensagem}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {/* -- campos normais -- */}

                    <Form.Group className="mb-3">
                        <Form.Label>Nome da Criança</Form.Label>
                        <Form.Control
                            type="text"
                            name="nome"
                            value={listaEspera.nome}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Data de Nascimento</Form.Label>
                        <Form.Control
                            type="date"
                            name="dataNascimento"
                            value={listaEspera.dataNascimento}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    {/* -- RESPONSAVEL -- */}
                    <Form.Group className="mb-3">
                        <Form.Label>CPF do Responsável</Form.Label>
                        <Form.Control
                            type="text"
                            name="cpf"
                            value={listaEspera.responsavel.cpf}
                            onChange={manipularMudancaResponsavel}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nome do Responsável</Form.Label>
                        <Form.Control
                            type="text"
                            name="nome"
                            value={listaEspera.responsavel.nome}
                            onChange={manipularMudancaResponsavel}
                            onBlur={() => buscarResponsavel(listaEspera.responsavel.nome, listaEspera.responsavel.cpf)}
                        />
                    </Form.Group>

                    {/* -- ESCOLA -- */}
                    <Form.Group className="mb-3">
                        <Form.Label>Escola</Form.Label>
                        <Form.Select value={listaEspera.escola.id} name="id" onChange={manipularMudancaEscola}>
                            <option value="">Selecione a escola</option>
                            {escolas.map((e) => (
                                <option key={e.id} value={e.id}>{e.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* -- outros campos -- */}
                    <Form.Group className="mb-3">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control
                            type="text"
                            name="telefone"
                            value={listaEspera.telefone}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rua</Form.Label>
                        <Form.Control
                            type="text"
                            name="rua"
                            value={listaEspera.rua}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Número</Form.Label>
                        <Form.Control
                            type="text"
                            name="numero"
                            value={listaEspera.numero}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Período Escolar</Form.Label>
                        <Form.Control
                            type="text"
                            name="periodoEscola"
                            value={listaEspera.periodoEscola}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Realiza Acompanhamento</Form.Label>
                        <Form.Control
                            type="text"
                            name="realizaAcompanhamento"
                            value={listaEspera.realizaAcompanhamento}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Possui Síndrome</Form.Label>
                        <Form.Control
                            type="text"
                            name="possuiSindrome"
                            value={listaEspera.possuiSindrome}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            name="descricao"
                            value={listaEspera.descricao}
                            onChange={manipularMudanca}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {editando ? "Atualizar" : "Cadastrar"}
                    </Button>
                    <Link to="/telaListaEspera">
                        <Button className="ml-2" variant="secondary">Cancelar</Button>
                    </Link>
                </Form>
            </PaginaGeral>
        </div>
    );
}
