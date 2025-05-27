import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';
import "../../css/telaTurma.css";
export default function RelatorioTurmas() {

    const [listaDeTurmas, setListaDeTurmas] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [cor, setCor] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [pesquisaCor, setPesquisaCor] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    const buscarTurmas = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token não encontrado. Faça login novamente.");

            const response = await fetch("http://localhost:3000/turmas", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!response.ok) throw new Error("Erro ao buscar turmas");

            const dados = await response.json();
            setListaDeTurmas(dados);
        } catch (error) {
            console.error("Erro ao buscar turmas:", error);
            setMensagem("Erro ao carregar as turmas.");
        }
    };

    buscarTurmas();
}, []);


    const excluirTurmas = async (turma) => {
        if (window.confirm("Deseja realmente excluir a turma " + turma.cor)) {
            if (!turma || !turma.id) {
                setMensagem("Erro: turma inválida!");
                return;
            }
    
            try {
                const response = await fetch(`http://localhost:3000/turmas/${turma.id}`, {
                    method: "DELETE"
                });
    
                if (response.ok) {
                    setMensagem("Turma excluída com sucesso!");
                    setListaDeTurmas(listaDeTurmas.filter(t => t.id !== turma.id));
                } else {
                    setMensagem("Erro ao excluir a turma.");
                }

                setTimeout(() => {
                    setMensagem("");
                }, 3000);
    
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
                setTimeout(() => {
                    setMensagem("");
                }, 3000);
            }
        }
    };
    

    const editarTurmas = (turma) => {
        navigate("/cadastroTurma", {
            state: {
                id: turma.id,
                cor: turma.cor,
                periodo: turma.periodo
            }
        });
    };

    const turmasFiltradas = pesquisaCor
        ? listaDeTurmas.filter((turma) => turma.cor.toLowerCase().includes(pesquisaCor.toLowerCase()))
        : listaDeTurmas;

    return (
        <div className="topo">
            <>
                <PaginaGeral>
                    <Container className="form-container mt-4">
                        <Alert className="alert-custom text-center" variant="dark">
                            <h2 className="titulo-alert">Turmas</h2>
                        </Alert>

                        <Form className="mb-4">
                            <Form.Group controlId="formPesquisaNome">
                                <Form.Label className="fw-semibold">Pesquise a turma pela cor</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite a cor da turma..."
                                        value={pesquisaCor}
                                        onChange={(e) => setPesquisaCor(e.target.value)} />
                                    <Button variant="secondary">
                                        Pesquisar
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Form>

                        {mensagem && (
                            <Alert
                                className="text-center"
                                variant={
                                    mensagem.toLowerCase().includes("sucesso")
                                        ? "success"
                                        : mensagem.toLowerCase().includes("erro")
                                            ? "danger"
                                            : "warning"
                                }
                            >
                                
                                {mensagem}
                            </Alert>
                        )}

                        <Container>
                            <Table responsive striped hover borderless className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Cor</th>
                                        <th>Periodo</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        turmasFiltradas?.map((turma) => (


                                            <tr key={turma.id}>
                                                <td>{turma.cor}</td>
                                                <td>{turma.periodo}</td>
                                                <td>
                                                    <Button
                                                        onClick={() => {
                                                            editarTurmas(turma);
                                                        }}
                                                        variant="warning"
                                                        size="sm"
                                                        className="me-2"
                                                        title="Editar">
                                                        ✏️
                                                    </Button>
                                                    <Button onClick={() => {
                                                        excluirTurmas(turma);
                                                    }} variant="danger"
                                                        size="sm"
                                                        title="Excluir">
                                                        🗑️
                                                    </Button>
                                                </td>
                                            </tr>

                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Container>
                        <div>
                            <Button as={Link} to="/telaTurma" className="botaoPesquisa" variant="secondary">
                                Voltar
                            </Button>
                        </div>
                    </Container>
                </PaginaGeral>
            </>
        </div>
    );
}
