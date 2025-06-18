import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert , Row, Col} from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from 'react-router-dom';

export default function RelatorioFuncionarios() {

    const [listaDeFuncionarios, setListaDeFuncionarios] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");
    const [cpf, setCPF] = useState("");
    const [cargo, setCargo] = useState("");
    const [nivel, setNivel] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        const buscarFuncionarios = async () => {
            try {
                const response = await fetch("http://localhost:3000/funcionarios",{
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                 },
                    
            });
                if (!response.ok) throw new Error("Erro ao buscar funcionarios");

                const dados = await response.json();
                setListaDeFuncionarios(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar funcionarios:", error);
                setMensagem("Erro ao carregar as funcionarios.");
            }
        };

        buscarFuncionarios();
    }, []);

    const excluirFuncionarios = async (funcionario) => {
        if (window.confirm("Deseja realmente excluir a funcionario " + funcionario.nome)) {
            if (!funcionario || !funcionario.cpf || !funcionario.nome || !funcionario.cargo || !funcionario.nivel || !funcionario.email || !funcionario.senha) {
                setMensagem("Erro: funcionario inválida!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/funcionarios/" + funcionario.cpf, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json" },
                    body: JSON.stringify(funcionario),
                });

                if (response.ok) {
                    setMensagem("Funcionario excluida com sucesso!");
                    // Remove da lista sem recarregar
                    setListaDeFuncionarios(listaDeFuncionarios.filter(t => t.cpf !== funcionario.cpf));
                } else {
                    setMensagem("Erro ao excluir a funcionario.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    };


    const editarFuncionarios = async () => {

        if (!cpf || !nome || !cargo || !nivel || !email || !senha) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const funcionario = { nome, cpf, cargo, nivel, email, senha };

        try {
            // Verifica se estamos editando ou criando uma nova funcionario
            const response = funcionario.cpf
                ? await fetch("http://localhost:3000/funcionarios/" + funcionario.cpf, {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json" },
                    body: JSON.stringify(funcionario),
                })
                : await fetch("http://localhost:3000/funcionarios", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json" },
                    body: JSON.stringify(funcionario),
                });

            if (response.ok) {
                setMensagem("Funcionario salva com sucesso!");
                setNome("");
                setCPF("");
                setCargo("");
                setNivel("");
                setEmail("");
                setSenha("");
            } else {
                setMensagem("Erro ao salvar a funcionario.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    const funcionariosFiltradas = pesquisaNome
        ? listaDeFuncionarios.filter((funcionario) => funcionario.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeFuncionarios;

    return (
            <PaginaGeral>
                <div className="TelaD">
                <Container fluid className="py-4">
                    {/* Título */}
                    <div className="bg-light p-4 rounded shadow-sm mb-4">
                        <h2 className="text-center mb-0">📄 Relatório de Funcionarios</h2>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm mb-4">
                            <Row className="gy-3">
                                
                                <Col md={4} sm={12}>
                                    <Form.Label><strong>Pesquisar por nome:</strong></Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            placeholder="Digite o nome do funcionario"
                                            value={pesquisaNome}
                                            onChange={(e) => setPesquisaNome(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                        </div>
                    <div>
                    <Button as={Link} to="/cadastroFuncionario" className="botaoPesquisa" variant="secondary">
                        Cadastrar
                    </Button>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                    <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>Nivel</th>
                                <th>Email</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                funcionariosFiltradas?.map((funcionario) => {

                                    return (
                                        <tr>
                                            <td>{funcionario.nome}</td>
                                            <td>{funcionario.cargo}</td>
                                            <td>{funcionario.nivel}</td>
                                            <td>{funcionario.email}</td>
                                            <td>
                                                <Button
                                                    as={Link}
                                                    to="/cadastroFuncionario"
                                                    state={{
                                                        editando: true,
                                                        nome: funcionario.nome,
                                                        cpf: funcionario.cpf,
                                                        cargo: funcionario.cargo,
                                                        nivel: funcionario.nivel,
                                                        email: funcionario.email,
                                                        senha: funcionario.senha
                                                    }}
                                                    variant="warning"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                    </svg>
                                                </Button>

                                                <Button onClick={() => {
                                                    excluirFuncionarios(funcionario);
                                                }} variant="danger">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        </Table>
                        <p>Quatidade de funcionarios cadastradas: {listaDeFuncionarios.length}</p>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <Button as={Link} to="/telaMenu" variant="secondary">
                            ⬅️ Voltar
                        </Button>
                    </div>
                </div>
            </Container>
            </div>
        </PaginaGeral>
    );
}
