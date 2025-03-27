import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from 'react-router-dom';

export default function RelatorioAlunos() {
    const [listaDeAlunos, setListaDeAlunos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");

    useEffect(() => {
        const buscarAlunos = async () => {
            try {
                const response = await fetch("http://localhost:3000/alunos");
                if (!response.ok) throw new Error("Erro ao buscar alunos");
                
                const dados = await response.json();
                setListaDeAlunos(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar alunos:", error);
                setMensagem("Erro ao carregar os alunos.");
            }
        };

        buscarAlunos();
    }, []);

    const excluirAluno = async (aluno) => {
        if (window.confirm("Deseja realmente excluir o aluno " + aluno.nome)) {
            if (!aluno || !aluno.nome) {
                setMensagem("Erro: aluno inválido!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/alunos/" + aluno.id, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Aluno excluído com sucesso!");
                    setListaDeAlunos(listaDeAlunos.filter(a => a.id !== aluno.id));
                } else {
                    setMensagem("Erro ao excluir o aluno.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        window.location.reload();
    };

    const alunosFiltrados = pesquisaNome
        ? listaDeAlunos.filter((aluno) => aluno.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeAlunos;

    return (
        <>
            <PaginaGeral>
                <br />
                <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                    <h2>
                        Alunos
                    </h2>
                </Alert>
                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label>Pesquise o aluno pelo nome</Form.Label>
                        <InputGroup className="divInput">
                            <div>
                                <Form.Control
                                    className="formInput"
                                    type="text"
                                    placeholder="Nome do aluno"
                                    value={pesquisaNome}
                                    onChange={(e) => setPesquisaNome(e.target.value)}
                                />
                            </div>
                            <div>
                                <Button className="botaoPesquisa" variant="secondary">
                                    Pesquisar
                                </Button>
                            </div>
                        </InputGroup>
                    </Form.Group>
                    <br />
                </Form>
                <Container>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Período</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                alunosFiltrados?.map((aluno) => {
                                    return (
                                        <tr key={aluno.id}>
                                            <td>{aluno.nome}</td>
                                            <td>{aluno.periodo}</td>
                                            <td>
                                                <Button
                                                    as={Link}
                                                    to={{
                                                        pathname: "/cadastroAluno",
                                                        state: { nome: aluno.nome, periodo: aluno.periodo }
                                                    }}
                                                    variant="warning"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                    </svg>
                                                </Button>
                                                <Button onClick={() => excluirAluno(aluno)} variant="danger">
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
                    <p>Quantidade de alunos cadastrados: {listaDeAlunos.length}</p>
                </Container>
                <div>
                    <Button as={Link} to="/telaAluno" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                </div>
            </PaginaGeral>
        </>
    );
}
