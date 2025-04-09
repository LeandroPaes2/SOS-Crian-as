import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';

export default function RelatorioEscolas() {
    const [listaDeEscolas, setListaDeEscolas] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const buscarEscolas = async () => {
            try {
                const response = await fetch("http://localhost:3000/escolas");
                if (!response.ok) throw new Error("Erro ao buscar escolas");
                
                const dados = await response.json();
                setListaDeEscolas(dados);
            } catch (error) {
                console.error("Erro ao buscar escolas:", error);
                setMensagem("Erro ao carregar as escolas.");
            }
        };

        buscarEscolas();
    }, []);

    const excluirEscolas = async (escola) => {
        if (window.confirm("Deseja realmente excluir a escola " + escola.nome)) {
            if (!escola || !escola.nome) {
                setMensagem("Erro: escola inválida!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/escolas/" + escola.nome, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Escola excluída com sucesso!");
                    setListaDeEscolas(listaDeEscolas.filter(e => e.nome !== escola.nome));
                } else {
                    setMensagem("Erro ao excluir a escola.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    };

    const editarEscolas = (escola) => {
        navigate("/cadastroEscola", {
            state: {
                nome: escola.nome,
                endereco: escola.endereco,
                telefone: escola.telefone,
                tipo: escola.tipo
            }
        });
    };

    const escolasFiltradas = pesquisaNome
        ? listaDeEscolas.filter((escola) =>
            escola.nome.toLowerCase().includes(pesquisaNome.toLowerCase())
        )
        : listaDeEscolas;

    return (
        <>
            <PaginaGeral>
                <br />
                <Alert className="alert-custom text-center mt-4 mb-4" variant="dark">
                    <h2 className="titulo-alert">Escolas</h2>
                </Alert>

                <Form>
                    <Form.Group controlId="formPesquisaNome">
                        <Form.Label>PESQUISE A ESCOLA PELO NOME</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Nome da escola"
                                value={pesquisaNome}
                                onChange={(e) => setPesquisaNome(e.target.value)}
                            />
                            <Button variant="secondary">Pesquisar</Button>
                        </InputGroup>
                    </Form.Group>
                </Form>
                <br />

                {mensagem && (
                    <Alert
                        className="mt-2 mb-2 text-center"
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
                                <th>Nome</th>
                                <th>Endereço</th>
                                <th>Telefone</th>
                                <th>Tipo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {escolasFiltradas?.map((escola) => (
                                <tr key={escola.nome}>
                                    <td>{escola.nome}</td>
                                    <td>{escola.endereco}</td>
                                    <td>{escola.telefone}</td>
                                    <td>{escola.tipo}</td>
                                    <td>
                                        <Button onClick={() => editarEscolas(escola)} variant="warning" className="me-2">
                                            ✏️
                                        </Button>
                                        <Button onClick={() => excluirEscolas(escola)} variant="danger">
                                            🗑️
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <p>Quantidade de escolas cadastradas: {listaDeEscolas.length}</p>
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
