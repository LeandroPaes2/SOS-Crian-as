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



import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaListaEspera.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useLocation } from "react-router-dom";

export default function FormCadListaEspera() {
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
            const resposta = await fetch(`http://localhost:3000/responsaveis/cpf/${cpf}`);
            if (!resposta.ok) {
                throw new Error('Responsável não encontrado.');
            }
            const responsavel = await resposta.json();
            setListaEspera(prevState => ({
                ...prevState,
                responsavelNome: responsavel.nome,
                rua: responsavel.rua,
                numero: responsavel.numero,
                telefone: responsavel.telefone
            }));
            setMensagem("");
        } catch (erro) {
            console.error("Erro ao buscar responsável:", erro);
            setMensagem("Responsável não encontrado pelo CPF informado.");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validarCPF(listaEspera.cpfResponsavel)) {
            setMensagem("CPF inválido");
            return;
        }

        let novaListaEspera = { ...listaEspera };

        if (!editando) {
            const hoje = new Date();
            const dataFormatada = hoje.toISOString().split('T')[0];
            novaListaEspera.dataInsercao = dataFormatada;
        }

        if (!novaListaEspera.nome || !novaListaEspera.dataNascimento || !novaListaEspera.responsavelNome || !novaListaEspera.rua || !novaListaEspera.numero || !novaListaEspera.escola || !novaListaEspera.telefone || !novaListaEspera.periodoEscola || !novaListaEspera.realizaAcompanhamento || !novaListaEspera.possuiSindrome || !novaListaEspera.descricao) {
            setMensagem("Preencha todos os campos!");
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
}

