import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';
import "../../css/telaTurma.css"

export default function RelatorioMateria() {
    const [listaDenomes, setListaDeNomes] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");  
    const navigate = useNavigate();

    useEffect(() => {
        const buscarMateria = async () => {
            try {
                const response = await fetch("http://localhost:3000/materias",{
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) throw new Error("Erro ao buscar matéria");

                const dados = await response.json();
                setListaDeNomes(dados); // atualiza com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar matéria:", error);
                setMensagem("Erro ao carregar as matérias.");
            }
        };

        buscarMateria();
    }, []);

    const excluirMaterias = async (materia) => {
        if (window.confirm("Deseja realmente excluir a matéria " + materia.nome + "?")) {
            if (!materia || !materia.id) {
                setMensagem("Erro: matéria inválida!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/materias/" + materia.id, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    setMensagem("Matéria excluída com sucesso!");
                    setListaDeNomes(listaDenomes.filter(m => m.id !== materia.id));
                } else {
                    setMensagem("Erro ao excluir a matéria.");
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

    return (
        <div className="topo">
            <>
                <PaginaGeral>
                    <Container className="form-container mt-4">
                        <Alert className="alert-custom text-center" variant="dark">
                            <h2 className="titulo-alert">Matéria</h2>
                        </Alert>
                        <Form className="mb-4">
                            <Form.Group controlId="formPesquisaNome">
                                <Form.Label className="fw-semibold">Pesquise a matéria pelo nome</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o nome da matéria..."
                                        value={pesquisaNome}
                                        onChange={(e) => setPesquisaNome(e.target.value)}
                                    />
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
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Descrição</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        // filtra as matérias conforme o nome pesquisado
                                        listaDenomes
                                            .filter((materia) =>
                                                pesquisaNome
                                                    ? materia.nome.toLowerCase().includes(pesquisaNome.toLowerCase())
                                                    : true
                                            )
                                            .map((materia) => {
                                                return (
                                                    <tr key={materia.id}>
                                                        <td>{materia.id}</td>
                                                        <td>{materia.nome}</td>
                                                        <td>{materia.descricao}</td>
                                                        <td>
                                                            <Button
                                                                onClick={() => navigate("/cadastroMateria", { state: { id: materia.id, nome: materia.nome, descricao: materia.descricao } })}
                                                                variant="warning"
                                                                size="sm"
                                                                className="me-2"
                                                                title="Editar"
                                                            >
                                                                ✏️
                                                            </Button>
                                                            <Button
                                                                onClick={() => excluirMaterias(materia)}
                                                                variant="danger"
                                                                size="sm"
                                                                title="Excluir"
                                                            >
                                                                🗑️
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                    }
                                </tbody>
                            </Table>
                        </Container>
                        <div>
                            <Button as={Link} to="/telaMateria" className="botaoPesquisa" variant="secondary">
                                Voltar
                            </Button>
                        </div>
                    </Container>
                </PaginaGeral>
            </>
        </div>
    );
}
