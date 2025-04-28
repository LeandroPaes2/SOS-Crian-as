/*import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import {Link} from 'react-router-dom';

export default function RelatorioListaEspera(){  

    const [listaDeListaEspera, setListaDeListaEspera] = useState([]); 
    const [mensagem, setMensagem] = useState("");
    const [id, setID] = useState("");
    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [escola, setEscola] = useState("");
    const [telefone, setTelefone] = useState("");
    const [periodoEscola, setPeriodoEscola] = useState("");
    const [realizaAcompanhamento, setRealizaAcompanhamento] = useState("");
    const [possuiSindrome, setPossuiSindrome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataInsercao, setDataInsercao] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");

    useEffect(() => {
        const buscarListaEspera = async () => {
            try {
                const response = await fetch("http://localhost:3000/listaEspera");
                if (!response.ok) throw new Error("Erro ao buscar listaEspera");
                
                const dados = await response.json();
                setListaDeListaEspera(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar listaEspera:", error);
                setMensagem("Erro ao carregar as listaEspera.");
            }
        };

        buscarListaEspera();
    }, []);

    const excluirListaEspera = async (listaEspera) => {

        if(window.confirm("Deseja realmente excluir a listaEspera " + listaEspera.nome)){
            if (!listaEspera || !listaEspera.id 
                || !listaEspera.nome || !listaEspera.dataNascimento 
                || !listaEspera.responsavel || !listaEspera.rua 
                || !listaEspera.numero || !listaEspera.escola 
                || !listaEspera.telefone || !listaEspera.periodoEscola 
                || !listaEspera.realizaAcompanhamento || !listaEspera.possuiSindrome 
                || !listaEspera.descricao || !listaEspera.periodoEscola) {
                setMensagem("Erro: listaEspera inválida!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/listaEspera/" + listaEspera.id, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Funcionario excluida com sucesso!");
                    setListaDeListaEspera(listaDeListaEspera.filter(t => t.id !== listaEspera.id));
                } else {
                    setMensagem("Erro ao excluir a listaEspera.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        window.location.reload()
    };

    const editarListaEspera = async () => {

        if (!id || !nome || !dataNascimento || !responsavel || !rua || !numero || !escola || !telefone || !periodoEscola
             || !realizaAcompanhamento || !possuiSindrome || !descricao || !dataInsercao) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const listaEspera = { id, nome, dataNascimento, responsavel, rua, numero, escola, telefone, periodoEscola, realizaAcompanhamento, possuiSindrome, descricao, dataInsercao};

        try {
            // Verifica se estamos editando ou criando uma nova listaEspera
            const response = listaEspera.id
                ? await fetch("http://localhost:3000/listaEspera/"+listaEspera.id, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(listaEspera),
                })
                : await fetch("http://localhost:3000/listaEspera", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(listaEspera),
                });

            if (response.ok) {
                setMensagem("Salvo com sucesso na Lisrta de Espera!");
                setID(""); 
                setNome(""); 
                setDataNascimento("");
                setResponsavel("");
                setRua("");
                setNumero("");
                setEscola("");
                setTelefone("");
                setPeriodoEscola("");
                setRealizaAcompanhamento("");
                setPossuiSindrome("");
                setDescricao("");
                setDataInsercao("");
            } else {
                setMensagem("Erro ao salvar na Lista de Espera.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    const listaEsperaFiltradas = pesquisaNome
        ? listaDeListaEspera.filter((listaEspera) => listaEspera.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeListaEspera;

    return (
        <>
            <PaginaGeral>
                    <br />
                    <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                        <h2>
                            ListaEspera
                        </h2>
                    </Alert>
                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label>PESQUISE A CRIANÇA PELO NOME</Form.Label>
                            <InputGroup className="divInput">
                                <div>
                                    <Form.Control className="formInput" type="text" placeholder="Nome da Criança"
                                    value={pesquisaNome} 
                                    onChange={(e) => setPesquisaNome(e.target.value)}  />
                                </div>
                                <div>
                                    <Button className="botaoPesquisa" variant="secondary">
                                        Pesquisar
                                    </Button>
                                </div>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                    <br />
                <Container>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Responsavel</th>
                                <th>Data Inserção</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listaEsperaFiltradas?.map((listaEspera) => {
                                
                                    return (
                                        <tr> 
                                            <td>{listaEspera.id}</td>
                                            <td>{listaEspera.nome}</td>
                                            <td>{listaEspera.responsavel}</td>
                                            <td>{listaEspera.dataInsercao}</td>
                                            <td>
                                            <Button
                                                as={Link}
                                                to="/cadastroFuncionario"
                                                state={{
                                                    editando: true,
                                                    id: listaEspera.id,
                                                    nome: listaEspera.nome,
                                                    dataNascimento: listaEspera.dataNascimento,
                                                    responsavel: listaEspera.responsavel,
                                                    rua: listaEspera.rua,
                                                    numero: listaEspera.numero,
                                                    escola: listaEspera.escola,
                                                    telefone: listaEspera.telefone,
                                                    periodoEscola: listaEspera.periodoEscola,
                                                    realizaAcompanhamento: listaEspera.realizaAcompanhamento,
                                                    possuiSindrome: listaEspera.possuiSindrome,
                                                    descricao: listaEspera.descricao,
                                                    dataInsercao: listaEspera.dataInsercao
                                                }}
                                                variant="warning"
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                </svg>
                                                </Button>
 
                                                <Button onClick={ ()=> {
                                                    excluirListaEspera(listaEspera);
                                                }} variant="danger">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                    </svg>           
                                                </Button>

                                                <Button onClick={ ()=> {
                                                    AdicionarAluno(listaEspera);
                                                }} variant="c">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                    </svg>           
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <p>Quatidade de listaEspera cadastradas: {listaDeListaEspera.length}</p>
                </Container>
                <div>
                        <Button as={Link} to="/telaFuncionario" className="botaoPesquisa" variant="secondary">
                                Voltar
                        </Button>
                        <Button as={Link} to="/cadastroFuncionario" className="botaoPesquisa" variant="secondary">
                                                        Cadastrar
                        </Button>
                </div>
            </PaginaGeral>
        </>
    );
}*/





import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';

export default function RelatorioListaEspera() {  

    const navigate = useNavigate();

    const [listaDeListaEspera, setListaDeListaEspera] = useState([]); 
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");

    useEffect(() => {
        const buscarListaEspera = async () => {
            try {
                const response = await fetch("http://localhost:3000/listasEspera");
                if (!response.ok) throw new Error("Erro ao buscar listaEspera");
                
                const dados = await response.json();
                setListaDeListaEspera(dados); 
            } catch (error) {
                console.error("Erro ao buscar listaEspera:", error);
                setMensagem("Erro ao carregar a lista de espera.");
            }
        };

        buscarListaEspera();
    }, []);

    const excluirListaEspera = async (listaEspera) => {
        if (window.confirm("Deseja realmente excluir a criança " + listaEspera.nome + " da lista de espera?")) {
            try {
                const response = await fetch("http://localhost:3000/listasEspera/" + listaEspera.id, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Excluído com sucesso!");
                    setListaDeListaEspera(listaDeListaEspera.filter(t => t.id !== listaEspera.id));
                } else {
                    setMensagem("Erro ao excluir.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    };

    const adicionarAluno = (listaEspera) => {
        navigate("/cadastroAluno", {
            state: {
                nome: listaEspera.nome,
                dataNascimento: listaEspera.dataNascimento,
                responsavel: listaEspera.responsavel,
                rua: listaEspera.rua,
                numero: listaEspera.numero,
                escola: listaEspera.escola,
                telefone: listaEspera.telefone,
                periodoEscola: listaEspera.periodoEscola,
                realizaAcompanhamento: listaEspera.realizaAcompanhamento,
                possuiSindrome: listaEspera.possuiSindrome,
                descricao: listaEspera.descricao,
                dataInsercao: listaEspera.dataInsercao
            }
        });
    };

    const listaEsperaFiltradas = pesquisaNome
        ? listaDeListaEspera.filter((listaEspera) => listaEspera.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeListaEspera;

    return (
        <PaginaGeral>
            <br />
            <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                <h2>Lista de Espera</h2>
            </Alert>
            <Form>
                <Form.Group className="form" controlId="exampleForm.ControlInput1">
                    <Form.Label>Pesquise a criança pelo nome</Form.Label>
                    <InputGroup className="divInput">
                        <Form.Control
                            className="formInput"
                            type="text"
                            placeholder="Nome da Criança"
                            value={pesquisaNome}
                            onChange={(e) => setPesquisaNome(e.target.value)}
                        />
                        <Button className="botaoPesquisa" variant="secondary">
                            Pesquisar
                        </Button>
                    </InputGroup>
                </Form.Group>
            </Form>
            <br />
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Responsável</th>
                            <th>Data Inserção</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaEsperaFiltradas.map((listaEspera) => (
                            <tr key={listaEspera.id}>
                                <td>{listaEspera.id}</td>
                                <td>{listaEspera.nome}</td>
                                <td>{listaEspera.responsavel.nome}</td>
                                <td>{listaEspera.dataInsercao}</td>
                                <td>
                                    <Button
                                        as={Link}
                                        to="/cadastroListaEspera"
                                        state={{
                                            editando: true,
                                            id: listaEspera.id,
                                            nome: listaEspera.nome,
                                            dataNascimento: listaEspera.dataNascimento,
                                            responsavel: listaEspera.responsavel,
                                            rua: listaEspera.rua,
                                            numero: listaEspera.numero,
                                            escola: listaEspera.escola,
                                            telefone: listaEspera.telefone,
                                            periodoEscola: listaEspera.periodoEscola,
                                            realizaAcompanhamento: listaEspera.realizaAcompanhamento,
                                            possuiSindrome: listaEspera.possuiSindrome,
                                            descricao: listaEspera.descricao,
                                            dataInsercao: listaEspera.dataInsercao
                                        }}
                                        variant="warning"
                                        className="me-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                        </svg>
                                    </Button>

                                    <Button
                                        onClick={() => excluirListaEspera(listaEspera)}
                                        variant="danger"
                                        className="me-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </Button>

                                    <Button
                                        onClick={() => adicionarAluno(listaEspera)}
                                        variant="success"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                            <path d="M13.485 1.929a.75.75 0 0 1 1.06 1.06l-8.25 8.25-4.25-4.25a.75.75 0 0 1 1.06-1.06L6.5 8.69l7.485-7.485z"/>
                                        </svg>
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p>Quantidade de crianças cadastradas na lista de espera: {listaDeListaEspera.length}</p>
            </Container>

            <div className="mt-4">
                <Button as={Link} to="/telaListaEspera" variant="secondary" className="me-2">
                    Voltar
                </Button>
                <Button as={Link} to="/cadastroListaEspera" variant="secondary">
                    Cadastrar
                </Button>
            </div>
        </PaginaGeral>
    );
}
