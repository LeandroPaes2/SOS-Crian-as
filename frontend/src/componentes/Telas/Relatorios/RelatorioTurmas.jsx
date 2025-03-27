import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import {Link} from 'react-router-dom';

export default function RelatorioTurmas(){

    const [listaDeTurmas, setListaDeTurmas] = useState([]); 
    const [mensagem, setMensagem] = useState("");
    const [cor, setCor] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [pesquisaCor, setPesquisaCor] = useState("");

    useEffect(() => {
        const buscarTurmas = async () => {
            try {
                const response = await fetch("http://localhost:3000/turmas");
                if (!response.ok) throw new Error("Erro ao buscar turmas");
                
                const dados = await response.json();
                setListaDeTurmas(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar turmas:", error);
                setMensagem("Erro ao carregar as turmas.");
            }
        };

        buscarTurmas();
    }, []);

    const excluirTurmas = async (turma) => {

        if(window.confirm("Deseja realmente excluir a turma " + turma.cor)){
            if (!turma || !turma.cor || !turma.periodo) {
                setMensagem("Erro: turma inválida!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/turmas/" + turma.cor, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Turma excluida com sucesso!");
                    setListaDeTurmas(listaDeTurmas.filter(t => t.id !== turma.id));
                } else {
                    setMensagem("Erro ao excluir a turma.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        window.location.reload()
    };

    const editarTurmas = async () => {

        if (!cor || !periodo) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const turma = { cor, periodo };

        try {
            // Verifica se estamos editando ou criando uma nova turma
            const response = turma.cor
                ? await fetch("http://localhost:3000/turmas/"+turma.cor, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(turma),
                })
                : await fetch("http://localhost:3000/turmas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(turma),
                });

            if (response.ok) {
                setMensagem("Turma salva com sucesso!");
                setCor(""); 
                setPeriodo(""); 
            } else {
                setMensagem("Erro ao salvar a turma.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    const turmasFiltradas = pesquisaCor
        ? listaDeTurmas.filter((turma) => turma.cor.toLowerCase().includes(pesquisaCor.toLowerCase()))
        : listaDeTurmas;

    return (
        <>
            <PaginaGeral>
                    <br />
                    <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                        <h2>
                            Turmas
                        </h2>
                    </Alert>
                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label>PESQUISE A TURMA PELA COR</Form.Label>
                            <InputGroup className="divInput">
                                <div>
                                    <Form.Control className="formInput" type="text" placeholder="Cor da turma"
                                    value={pesquisaCor} 
                                    onChange={(e) => setPesquisaCor(e.target.value)}  />
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
                                <th>Cor</th>
                                <th>Periodo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                turmasFiltradas?.map((turma) => {
                                
                                    return (
                                        <tr> 
                                            <td>{turma.cor}</td>
                                            <td>{turma.periodo}</td>
                                            <td>
                                                <Button 
                                                    as={Link} 
                                                    to={{
                                                        pathname: "/cadastroTurma",
                                                        state: { cor: turma.cor, periodo: turma.periodo}}}variant="warning">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                    </svg>
                                                </Button> 
                                                <Button onClick={ ()=> {
                                                    excluirTurmas(turma);
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
                    <p>Quatidade de turmas cadastradas: {listaDeTurmas.length}</p>
                </Container>
                <div>
                        <Button as={Link} to="/telaTurma" className="botaoPesquisa" variant="secondary">
                                Voltar
                        </Button>
                </div>
            </PaginaGeral>
        </>
    );
}
