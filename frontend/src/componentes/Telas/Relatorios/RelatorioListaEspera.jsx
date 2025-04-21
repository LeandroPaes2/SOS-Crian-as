/*import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import {Link} from 'react-router-dom';
import FormCadListaEspera from "../Formularios/FormCadListaEspera";
import { useNavigate } from "react-router-dom";
import "../../css/alerts.css";

export default function RelatorioListaEspera(){

    const [listaDeListaEspera, setListaDeListaEspera] = useState([]); 
    const [mensagem, setMensagem] = useState("");
    const [id, setID] = useState("");
    const [numProtocolo, setNumProtocolo] = useState("");
    const [nome, setNome]=useState("");
    const [dataInsercao, setDataInsercao] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const navigate = useNavigate();
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        const buscarListaEspera = async () => {
            try {
                const response = await fetch("http://localhost:3000/responsaveis");
                if (!response.ok) throw new Error("Erro ao buscar responsaveis");
                
                const dados = await response.json();
                setListaDeListaEspera(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar responsaveis:", error);
                setMensagem("Erro ao carregar os responsaveis.");
            }
        };

        buscarListaEspera();
    }, []);



    const handleSubmit = async (event) => {
        event.preventDefault();

    
        const url = "http://localhost:3000/listaEspera";
        const method = "POST";
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(listaEspera)
            });
            
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Detalhes do erro:", errorDetails);
                setMensagem(`Erro: ${errorDetails.mensagem || 'Verifique os dados fornecidos.'}`);
            } else {
                const data = await response.json();
                setMensagem("Aluno adicionado a lista de espera com sucesso!");
            }
            
            
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };
    

    const excluirListaEspera = async (listaEspera) => {

        if(window.confirm("Deseja realmente excluir o aluno " + listaEspera.nome +" da lista de espera?")){
            if (!listaEspera || !listaEspera.id || !listaEspera.numProtocolo || !listaEspera.nome || !listaEspera.dataInsercao) {
                console.log(listaEspera.id, listaEspera.numProtocolo, listaEspera.nome, listaEspera.dataInsercao);
                setMensagem("Erro: listaEspera inválido!");
                setTimeout(() => setMensagem(""), 5000);
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/responsaveis/" + listaEspera.id, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("ListaEspera excluido com sucesso!");
                    setTimeout(() => setMensagem(""), 3000);
                    setListaDeListaEspera(listaDeListaEspera.filter(r => r.id !== listaEspera.id));
                } else {
                    setMensagem("Erro ao excluir o listaEspera.");
                    setTimeout(() => setMensagem(""), 3000);
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        window.location.reload()
    };

    const responsaveisFiltrados = pesquisaNome
        ? listaDeListaEspera.filter((listaEspera) => listaEspera.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeListaEspera;

    return (
        <>
            <PaginaGeral>
                    
                    <p></p>
                    <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">Lista de Alunos na Fila de Espera</h2>
            </Alert>
               
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Numero do Protocolo do Aluno</Form.Label>
                        <Form.Control
                            type="number"
                            id = "numProtocolo"
                            placeholder="Digite o numero do Protocolo"
                            value={listaEspera.numProtocolo}
                            name="numProtocolo"
                        />
                    </Form.Group>

                    <Button className="botaoPesquisa" variant="primary" type="submit">
                        {"Cadastrar"}
                    </Button>
                    </Form>


                    <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{fontWeight:400, color:'white'}}>PESQUISE O ALUNO PELO NOME</Form.Label>
                            <InputGroup className="divInput">
                                <div>
                                    <Form.Control className="formInput" type="text" placeholder="Pesquise o nome do aluno"
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
                {mensagem && <Alert className="mt-02 mb-02 green text-center" variant={
                    mensagem.includes("sucesso")
                    ? "success"
                    : mensagem.includes("Erro") || mensagem.includes("erro")
                    ? "danger"
                    : "warning"
                    }>
                    {mensagem}
                    </Alert>}
                <Container>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NUMERO DO PROTOCOLO</th>
                                <th>NOME DO ALUNO</th>
                                <th>DATA DE INSERÇÃO</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                responsaveisFiltrados?.map((listaEspera) => {
                                
                                    return (
                                        <tr> 
                                            <td>{listaEspera.id}</td>
                                            <td>{listaEspera.numProtocolo}</td>
                                            <td>{listaEspera.nome}</td>
                                            <td>{new Date(listaEspera.dataInsercao).toLocaleDateString()}</td>
                                            <td>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <Button onClick={ ()=> {
                                                    excluirListaEspera(listaEspera);
                                                }} variant="danger">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                    </svg>           
                                                </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <p>Quatidade de alunos cadastrados na Lista de Espera: {listaDeListaEspera.length}</p>
                </Container>
                <div>
                        <Button as={Link} to="/telaListaEspera" className="botaoPesquisa" variant="secondary">
                                Voltar
                        </Button>
                </div>
            </PaginaGeral>
        </>
    );
}*/



/*
import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "../../css/alerts.css";

export default function RelatorioListaEspera() {
    const [listaDeListaEspera, setListaDeListaEspera] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [numProtocolo, setNumProtocolo] = useState("");
    const [nome, setNome] = useState("");
    const [dataInsercao, setDataInsercao] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const buscarListaEspera = async () => {
            try {
                const response = await fetch("http://localhost:3000/responsaveis");
                if (!response.ok) throw new Error("Erro ao buscar responsaveis");

                const dados = await response.json();
                setListaDeListaEspera(dados);
            } catch (error) {
                console.error("Erro ao buscar responsaveis:", error);
                setMensagem("Erro ao carregar os responsaveis.");
            }
        };

        buscarListaEspera();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!numProtocolo || !nome || !dataInsercao) {
            setMensagem("Preencha todos os campos corretamente.");
            return;
        }

        const url = `http://localhost:3000/listaEspera/${numProtocolo}`;

        const listaEspera = {
            nome,
            dataInsercao,
            aluno: {
                numProtocolo: parseInt(numProtocolo)
            }
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(listaEspera)
            });

            const data = await response.json();

            if (!response.ok) {
                setMensagem(`Erro: ${data.mensagem || 'Verifique os dados fornecidos.'}`);
            } else {
                setMensagem("Aluno adicionado à lista de espera com sucesso!");
                setNome("");
                setDataInsercao("");
                setNumProtocolo("");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    const excluirListaEspera = async (listaEspera) => {
        if (window.confirm("Deseja realmente excluir o aluno " + listaEspera.nome + " da lista de espera?")) {
            try {
                const response = await fetch("http://localhost:3000/responsaveis/" + listaEspera.id, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("ListaEspera excluído com sucesso!");
                    setListaDeListaEspera(listaDeListaEspera.filter(r => r.id !== listaEspera.id));
                } else {
                    setMensagem("Erro ao excluir o listaEspera.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    };

    const responsaveisFiltrados = pesquisaNome
        ? listaDeListaEspera.filter((listaEspera) => listaEspera.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeListaEspera;

    return (
        <PaginaGeral>
            <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">Lista de Alunos na Fila de Espera</h2>
            </Alert>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Numero do Protocolo do Aluno</Form.Label>
                    <Form.Control
                        type="number"
                        id="numProtocolo"
                        placeholder="Digite o número do protocolo"
                        value={numProtocolo}
                        onChange={(e) => setNumProtocolo(e.target.value)}
                        name="numProtocolo"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nome do Aluno</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Data de Inserção</Form.Label>
                    <Form.Control
                        type="date"
                        value={dataInsercao}
                        onChange={(e) => setDataInsercao(e.target.value)}
                    />
                </Form.Group>

                <Button className="botaoPesquisa" variant="primary" type="submit">
                    Cadastrar
                </Button>
            </Form>

            <Form>
                <Form.Group className="form" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontWeight: 400, color: 'white' }}>PESQUISE O ALUNO PELO NOME</Form.Label>
                    <InputGroup className="divInput">
                        <Form.Control
                            className="formInput"
                            type="text"
                            placeholder="Pesquise o nome do aluno"
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
            {mensagem && (
                <Alert className="mt-02 mb-02 text-center" variant={
                    mensagem.includes("sucesso") ? "success" :
                    mensagem.includes("Erro") || mensagem.includes("erro") ? "danger" : "warning"
                }>
                    {mensagem}
                </Alert>
            )}

            <Container>
                <Table striped bordered hover>
                    <div>
                    <Button as={Link} to="/telaListaEspera" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                    </div>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NUMERO DO PROTOCOLO</th>
                            <th>NOME DO ALUNO</th>
                            <th>DATA DE INSERÇÃO</th>
                            <th>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responsaveisFiltrados?.map((listaEspera) => (
                            <tr key={listaEspera.id}>
                                <td>{listaEspera.id}</td>
                                <td>{listaEspera.numProtocolo}</td>
                                <td>{listaEspera.nome}</td>
                                <td>{new Date(listaEspera.dataInsercao).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        <Button onClick={() => excluirListaEspera(listaEspera)} variant="danger">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                            </svg>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p>Quantidade de alunos cadastrados na Lista de Espera: {listaDeListaEspera.length}</p>
            </Container>
        </PaginaGeral>
    );
}*/



import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "../../css/alerts.css";

export default function RelatorioListaEspera() {
    const [listaDeListaEspera, setListaDeListaEspera] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [numProtocolo, setNumProtocolo] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const buscarListaEspera = async () => {
            try {
                const response = await fetch("http://localhost:3000/responsaveis");
                if (!response.ok) throw new Error("Erro ao buscar responsaveis");

                const dados = await response.json();
                setListaDeListaEspera(dados);
            } catch (error) {
                console.error("Erro ao buscar responsaveis:", error);
                setMensagem("Erro ao carregar os responsaveis.");
            }
        };

        buscarListaEspera();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!numProtocolo) {
            setMensagem("Informe o número do protocolo.");
            return;
        }

        const dataAtual = new Date().toISOString();

        const url = `http://localhost:3000/listaEspera/${numProtocolo}`;
        const listaEspera = {
            dataInsercao: dataAtual,
            aluno: {
                numProtocolo: parseInt(numProtocolo)
            }
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(listaEspera)
            });

            const data = await response.json();

            if (!response.ok) {
                setMensagem(`Erro: ${data.mensagem || 'Verifique os dados fornecidos.'}`);
            } else {
                setMensagem("Aluno adicionado à lista de espera com sucesso!");
                setNumProtocolo("");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    const excluirListaEspera = async (listaEspera) => {
        if (window.confirm("Deseja realmente excluir o aluno " + listaEspera.nome + " da lista de espera?")) {
            try {
                const response = await fetch("http://localhost:3000/responsaveis/" + listaEspera.id, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("ListaEspera excluído com sucesso!");
                    setListaDeListaEspera(listaDeListaEspera.filter(r => r.id !== listaEspera.id));
                } else {
                    setMensagem("Erro ao excluir o listaEspera.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    };

    const responsaveisFiltrados = pesquisaNome
        ? listaDeListaEspera.filter((listaEspera) => listaEspera.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeListaEspera;

    return (
        <PaginaGeral>
            <Alert className="alert-custom text-center mt-4 mb-4">
                <h2 className="titulo-alert">Lista de Alunos na Fila de Espera</h2>
            </Alert>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Numero do Protocolo do Aluno</Form.Label>
                    <Form.Control
                        type="number"
                        id="numProtocolo"
                        placeholder="Digite o número do protocolo"
                        value={numProtocolo}
                        onChange={(e) => setNumProtocolo(e.target.value)}
                        name="numProtocolo"
                    />
                </Form.Group>

                <Button className="botaoPesquisa" variant="primary" type="submit">
                    Cadastrar
                </Button>
            </Form>

            <Form>
                <Form.Group className="form" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontWeight: 400, color: 'white' }}>PESQUISE O ALUNO PELO NOME</Form.Label>
                    <InputGroup className="divInput">
                        <Form.Control
                            className="formInput"
                            type="text"
                            placeholder="Pesquise o nome do aluno"
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
            {mensagem && (
                <Alert className="mt-02 mb-02 text-center" variant={
                    mensagem.includes("sucesso") ? "success" :
                        mensagem.includes("Erro") || mensagem.includes("erro") ? "danger" : "warning"
                }>
                    {mensagem}
                </Alert>
            )}

            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NUMERO DO PROTOCOLO</th>
                            <th>NOME DO ALUNO</th>
                            <th>DATA DE INSERÇÃO</th>
                            <th>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responsaveisFiltrados?.map((listaEspera) => (
                            <tr key={listaEspera.id}>
                                <td>{listaEspera.id}</td>
                                <td>{listaEspera.numProtocolo}</td>
                                <td>{listaEspera.nome}</td>
                                <td>{new Date(listaEspera.dataInsercao).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        <Button onClick={() => excluirListaEspera(listaEspera)} variant="danger">
                                            🗑️
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p>Quantidade de alunos cadastrados na Lista de Espera: {listaDeListaEspera.length}</p>
            </Container>

            <div>
                <Button as={Link} to="/telaListaEspera" className="botaoPesquisa" variant="secondary">
                    Voltar
                </Button>
            </div>
        </PaginaGeral>
    );
}


