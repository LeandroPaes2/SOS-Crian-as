import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import {Link} from 'react-router-dom';

export default function RelatorioEscolas(){

    const [listaDeEscolas, setListaDeEscolas] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");
    const [endereco, setEndereco] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");

    useEffect(() => {
        const buscarEscolas = async () => {
            try {
                const response = await fetch("http://localhost:3000/escolas");
                if (!response.ok) throw new Error("Erro ao buscar escolas");
                
                const dados = await response.json();
                setListaDeEscolas(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar escolas:", error);
                setMensagem("Erro ao carregar as escolas.");
            }
        };

        buscarEscolas();
    }, []);

    const excluirEscolas = async (escola) => {

        if(window.confirm("Deseja realmente excluir a escola " + escola.nome)){
            if (!escola || !escola.nome || !escola.endereco) {
                setMensagem("Erro: escola inválida!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/escolas/" + escola.nome, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Escola excluida com sucesso!");
                    setListaDeEscolas(listaDeEscolas.filter(e => e.id !== escola.id));
                } else {
                    setMensagem("Erro ao excluir a escola.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        window.location.reload()
    };

    const editarEscolas = async (escola) => {
        if (!escola || !escola.nome || !escola.endereco) {
            setMensagem("Preencha todos os campos!");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/escolas/${escola.id}`, { // Certifique-se de usar o ID
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(escola),
            });
    
            if (response.ok) {
                setMensagem("Escola editada com sucesso!");
                
                // Atualizar a lista sem recarregar a página
                setListaDeEscolas(listaDeEscolas.map(e => (e.id === escola.id ? escola : e)));
            } else {
                setMensagem("Erro ao editar a escola.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };
    
    const escolasFiltradas = pesquisaNome
    ? listaDeEscolas.filter((escola) => escola.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
    : listaDeEscolas;

    return (
        <>
            <PaginaGeral>
                    <br />
                    <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                        <h2>
                            Escolas
                        </h2>
                    </Alert>
                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label>PESQUISE A ESCOLA PELO NOME</Form.Label>
                            <InputGroup className="divInput">
                                <div>
                                    <Form.Control className="formInput" type="text" placeholder="Nome da escola"
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
                                <th>Nome</th>
                                <th>Endereço</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                escolasFiltradas?.map((escola) => {
                                
                                    return (
                                        <tr> 
                                            <td>{escola.nome}</td>
                                            <td>{escola.endereco}</td>
                                            <td>
                                                <Button onClick={()=>{
                                                    editarEscolas({id: escola.id, 
                                                        nome: nome || escola.nome, 
                                                        endereco: endereco || escola.endereco});
                                                }} variant="danger"
                                                    >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                    </svg>
                                                </Button> <Button onClick={ ()=> {
                                                    excluirEscolas(escola);
                                                }} variant="danger">
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
                    <p>Quatidade de escolas cadastradas: {listaDeEscolas.length}</p>
                </Container>
                <div>
                        <Button as={Link} to="/telaEscola" className="botaoPesquisa" variant="secondary">
                                Voltar
                        </Button>
                </div>
            </PaginaGeral>
        </>
    );

}