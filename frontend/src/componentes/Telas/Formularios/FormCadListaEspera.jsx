/*
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
        setListaEspera(prev => ({
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


        async function buscarResponsavel(nomeResponsavel, cpfResponsavel) {
            try {
                const resposta = await fetch(`http://localhost:3000/responsaveis?nome=${encodeURIComponent(nomeResponsavel)}`);
                const listaResponsaveis = await resposta.json();
        
                if (listaResponsaveis.length === 0) {
                    throw new Error('Nenhum responsável encontrado com esse nome.');
                }
        
                const responsavelCorreto = listaResponsaveis.find(r => r.cpf === cpfResponsavel);
        
                if (!responsavelCorreto) {
                    throw new Error('Nenhum responsável encontrado com o CPF informado.');
                }
        
                // Aqui preenche automaticamente o telefone
                setListaEspera(prev => ({
                    ...prev,
                    responsavel: {
                        ...prev.responsavel,
                        cpf: responsavelCorreto.cpf,
                        nome: responsavelCorreto.nome,
                        telefone: responsavelCorreto.telefone
                    }
                }));
        
                setMensagem('Responsável encontrado com sucesso!');
        
            } catch (erro) {
                console.error("Erro ao buscar responsável:", erro);
                setMensagem(erro.message);
            }
        }
        

    const handleSubmit = async (evento) => {
        evento.preventDefault();

        if (!validarCPF(listaEspera.responsavel.cpf)) {
            setMensagem("CPF do responsável inválido!");
            return;
        }

        if (!listaEspera.responsavel.nome || !listaEspera.responsavel.cpf) {
            setMensagem("Preencha nome e CPF do responsável.");
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

        const url = editando ? `http://localhost:3000/listasEspera/${novaListaEspera.id}` : "http://localhost:3000/listasEspera";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
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

                    <Form.Group className="mb-3">
                        <Form.Label>Escola</Form.Label>
                        <Form.Select value={listaEspera.escola.id} name="id" onChange={manipularMudancaEscola}>
                            <option value="">Selecione a escola</option>
                            {escolas.map((e) => (
                                <option key={e.id} value={e.id}>{e.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

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
                        <Form.Label>Período da Escola</Form.Label>
                        <Form.Select
                            value={listaEspera.periodoEscola}
                            name="periodoEscola"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione um período</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
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
        setListaEspera(prev => ({
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

    async function buscarResponsavel(cpfResponsavel) {
        try {
            const resposta = await fetch(`http://localhost:3000/responsaveis?cpf=${encodeURIComponent(cpfResponsavel)}`);
            
            if (!resposta.ok) {
                throw new Error('Erro ao consultar o servidor.');
            }

            const responsavel = await resposta.json();

            if (!responsavel || Object.keys(responsavel).length === 0) {
                throw new Error('Nenhum responsável encontrado com o CPF informado.');
            }

            setListaEspera(prev => ({
                ...prev,
                responsavel: {
                    cpf: responsavel.cpf,
                    nome: responsavel.nome,
                    telefone: responsavel.telefone
                }
            }));

            setMensagem('Responsável encontrado com sucesso!');
            return responsavel;

        } catch (erro) {
            console.error("Erro ao buscar responsável:", erro);
            setMensagem(erro.message);
            return null;
        }
    }

    const handleSubmit = async (evento) => {
        evento.preventDefault();

        const cpf = listaEspera.responsavel.cpf;

        if (!cpf || cpf.trim() === "") {
            setMensagem("Preencha o CPF do responsável.");
            return;
        }

        if (!validarCPF(cpf)) {
            setMensagem("CPF do responsável inválido!");
            return;
        }

        const responsavelEncontrado = await buscarResponsavel(cpf);
        if (!responsavelEncontrado) return; // Interrompe se não achou responsável

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

        const url = editando ? `http://localhost:3000/listasEspera/${novaListaEspera.id}` : "http://localhost:3000/listasEspera";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
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
                        <Form.Label>Escola</Form.Label>
                        <Form.Select value={listaEspera.escola.id} name="id" onChange={manipularMudancaEscola}>
                            <option value="">Selecione a escola</option>
                            {escolas.map((e) => (
                                <option key={e.id} value={e.id}>{e.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

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
                        <Form.Label>Período da Escola</Form.Label>
                        <Form.Select
                            value={listaEspera.periodoEscola}
                            name="periodoEscola"
                            onChange={manipularMudanca}
                        >
                            <option value="">Selecione um período</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
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

